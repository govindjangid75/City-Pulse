"""
FastAPI REST Routes for CityPulse.
Endpoints:
- GET /api/v1/zones (all zones' current status and summaries)
- GET /api/v1/zones/{zone_id} (deep-dive for a single zone)
- GET /api/v1/zones/{zone_id}/events (raw recent events in window)
- GET /api/v1/health (system and feed health status)
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models.events import ZoneStatus, CivicEvent

router = APIRouter()

@router.get("/zones", response_model=List[ZoneStatus])
async def get_all_zones_status():
    """Retrieve the computed real-time pulse of all configured city zones."""
    return []

@router.get("/zones/{zone_id}", response_model=ZoneStatus)
async def get_zone_status(zone_id: str):
    """Retrieve detailed pulse, correlations, and summary for one zone."""
    return {}

@router.get("/zones/{zone_id}/events", response_model=List[CivicEvent])
async def get_zone_events(
    zone_id: str, 
    window_minutes: int = Query(30, ge=5, le=1440)
):
    """Retrieve raw normalized events for the specified zone within the rolling window."""
    return []

@router.get("/health")
async def get_health_check():
    """System health check and feed latency monitor."""
    return {"status": "ok", "feeds": {"weather": "ok", "transit": "ok", "311": "ok"}}
