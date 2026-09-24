"""
FastAPI REST Routes for CityPulse.
Implements:
- GET /api/v1/zones (all zones' computed pulse and summaries)
- GET /api/v1/zones/{zone_id} (deep-dive for a single zone)
- GET /api/v1/zones/{zone_id}/events (raw recent events in window)
- GET /api/v1/health (system and feed health status)
- POST /api/v1/events (manual event injection)
- POST /api/v1/simulate/scenario (trigger storm / rush hour / heat wave scenarios)
- POST /api/v1/simulate/toggle-feed (simulate feed delay or outage)
- POST /api/v1/simulate/reset (reset SQLite database to initial seed)
- GET /api/v1/history/timeline (chronological timestamps for scrubber replay)
"""
import json
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Body
from ..config import settings
from ..database import get_db_connection, init_db
from ..models.events import (
    CivicEvent, ZoneStatus, ZoneStatusEnum, FeedSourceEnum, 
    SeverityEnum, FeedHealthEnum, FeedHealthStatus, CorrelationFlag
)
from ..services.correlation import detect_correlations, compute_zone_status
from ..services.summary_generator import generate_zone_summary
from ..services.ingestion import ingestion_manager
from ..services.normalization import parse_iso_utc, map_severity
from .websocket import ws_manager
from .auth import router as auth_router

router = APIRouter()
router.include_router(auth_router)

def get_reference_datetime(as_of: Optional[str] = None) -> datetime:
    """Determine the reference end-time for the rolling window."""
    if as_of:
        try:
            return datetime.fromisoformat(as_of.replace("Z", "+00:00"))
        except Exception:
            pass
            
    # Check max timestamp in DB
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT MAX(timestamp) as max_ts FROM events")
        row = cursor.fetchone()
    except Exception:
        row = None
    conn.close()
    
    if row and row["max_ts"]:
        try:
            db_max_dt = datetime.fromisoformat(row["max_ts"].replace("Z", "+00:00"))
            now_dt = datetime.now(timezone.utc)
            # If current real time is newer and within 2 hours of DB, use now; otherwise anchor to max_ts
            if now_dt > db_max_dt and (now_dt - db_max_dt).total_seconds() < 7200:
                return now_dt
            return db_max_dt
        except Exception:
            pass
            
    return datetime.now(timezone.utc)

def query_events_for_zone(zone_id: str, ref_dt: datetime, window_minutes: int) -> List[CivicEvent]:
    """Query normalized events from SQLite within the window [ref_dt - window_minutes, ref_dt]."""
    start_dt = ref_dt - timedelta(minutes=window_minutes)
    start_iso = start_dt.isoformat()
    end_iso = ref_dt.isoformat()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, zone, timestamp, source, type, severity, payload 
        FROM events 
        WHERE zone = ? AND timestamp <= ? AND timestamp >= ?
        ORDER BY timestamp DESC
    """, (zone_id, end_iso, start_iso))
    
    rows = cursor.fetchall()
    conn.close()
    
    events: List[CivicEvent] = []
    for r in rows:
        try:
            payload = json.loads(r["payload"]) if r["payload"] else {}
        except Exception:
            payload = {}
            
        events.append(CivicEvent(
            id=r["id"],
            zone=r["zone"],
            timestamp=r["timestamp"],
            source=FeedSourceEnum(r["source"]),
            type=r["type"],
            severity=SeverityEnum(r["severity"]),
            payload=payload
        ))
    return events

@router.get("/zones", response_model=List[ZoneStatus])
async def get_all_zones_status(
    window_minutes: int = Query(30, ge=5, le=1440),
    as_of: Optional[str] = Query(None, description="ISO 8601 reference time for historical replay")
):
    """Retrieve computed real-time pulse of all configured city zones."""
    ref_dt = get_reference_datetime(as_of)
    feed_health = ingestion_manager.get_feed_health()
    results: List[ZoneStatus] = []
    
    for zone_id in settings.ACTIVE_ZONES:
        events = query_events_for_zone(zone_id, ref_dt, window_minutes)
        correlations = detect_correlations(events, zone_id, window_minutes)
        status = compute_zone_status(events, zone_id, correlations)
        summary = generate_zone_summary(zone_id, status, events, correlations)
        
        results.append(ZoneStatus(
            zone=zone_id,
            status=status,
            active_event_count=len(events),
            correlations=correlations,
            summary=summary,
            feed_health=feed_health
        ))
        
    return results

@router.get("/zones/{zone_id}", response_model=ZoneStatus)
async def get_zone_status(
    zone_id: str,
    window_minutes: int = Query(30, ge=5, le=1440),
    as_of: Optional[str] = Query(None)
):
    """Retrieve detailed pulse, correlations, and summary for one specific zone."""
    if zone_id not in settings.ACTIVE_ZONES:
        raise HTTPException(status_code=404, detail=f"Zone '{zone_id}' not found in active zone registry.")
        
    ref_dt = get_reference_datetime(as_of)
    feed_health = ingestion_manager.get_feed_health()
    
    events = query_events_for_zone(zone_id, ref_dt, window_minutes)
    correlations = detect_correlations(events, zone_id, window_minutes)
    status = compute_zone_status(events, zone_id, correlations)
    summary = generate_zone_summary(zone_id, status, events, correlations)
    
    return ZoneStatus(
        zone=zone_id,
        status=status,
        active_event_count=len(events),
        correlations=correlations,
        summary=summary,
        feed_health=feed_health
    )

@router.get("/zones/{zone_id}/events", response_model=List[CivicEvent])
async def get_zone_events(
    zone_id: str,
    window_minutes: int = Query(30, ge=5, le=1440),
    as_of: Optional[str] = Query(None)
):
    """Retrieve raw normalized events for the specified zone within the rolling window."""
    ref_dt = get_reference_datetime(as_of)
    return query_events_for_zone(zone_id, ref_dt, window_minutes)

@router.get("/health")
async def get_health_check():
    """System health check and feed latency monitor."""
    feed_health = ingestion_manager.get_feed_health()
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "feeds": {k: v.status for k, v in feed_health.items()},
        "telemetry": feed_health
    }

@router.post("/events", response_model=CivicEvent)
async def create_event(event_data: Dict[str, Any] = Body(...)):
    """Manually ingest a new event and broadcast update to dashboard."""
    import uuid
    e_id = str(event_data.get("id") or f"custom-{uuid.uuid4().hex[:6]}")
    zone = str(event_data.get("zone", "zone-1"))
    timestamp = parse_iso_utc(str(event_data.get("timestamp", datetime.now(timezone.utc).isoformat())))
    source_val = str(event_data.get("source", "311"))
    source = FeedSourceEnum(source_val) if source_val in [s.value for s in FeedSourceEnum] else FeedSourceEnum.INCIDENTS
    event_type = str(event_data.get("type", "general_incident"))
    severity = map_severity(str(event_data.get("severity", "low")))
    payload = event_data.get("payload", {})
    
    event = CivicEvent(
        id=e_id,
        zone=zone,
        timestamp=timestamp,
        source=source,
        type=event_type,
        severity=severity,
        payload=payload
    )
    
    ingestion_manager.save_events_to_db([event])
    await ws_manager.broadcast_json({"type": "EVENT_INJECTED", "event": event.dict()})
    return event

@router.post("/simulate/scenario")
async def trigger_simulation_scenario(
    scenario: str = Body(..., embed=True),
    zone: str = Body("zone-3", embed=True)
):
    """Trigger realistic test scenarios ('storm_flood', 'rush_hour_congestion', 'heat_wave')."""
    events = await ingestion_manager.trigger_scenario(scenario, zone)
    return {"status": "scenario_injected", "scenario": scenario, "zone": zone, "events_count": len(events)}

@router.post("/simulate/toggle-feed")
async def toggle_feed_status(
    feed: str = Body(..., embed=True),
    status: str = Body(..., embed=True)
):
    """Simulate feed degradation ('ok', 'delayed', 'missing')."""
    try:
        health_enum = FeedHealthEnum(status)
        ingestion_manager.set_feed_health(feed, health_enum)
        await ws_manager.broadcast_json({"type": "FEED_HEALTH_CHANGE", "feed": feed, "status": status})
        return {"status": "success", "feed": feed, "health": status}
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status '{status}'. Valid options: ok, delayed, missing")

@router.post("/simulate/reset")
async def reset_simulation():
    """Reset database to initial baseline seed."""
    ingestion_manager.reset_database_from_seed()
    await ws_manager.broadcast_json({"type": "RESET_COMPLETE"})
    return {"status": "database_reset_complete"}

@router.get("/history/timeline")
async def get_history_timeline():
    """Return list of distinct event timestamps for interactive historical playback."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT timestamp FROM events ORDER BY timestamp ASC")
    rows = cursor.fetchall()
    conn.close()
    return [r["timestamp"] for r in rows]
