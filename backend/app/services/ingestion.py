"""
Ingestion Orchestration & Simulation Service for CityPulse.
Schedules periodic polling of adapters, normalizes records, writes to SQLite,
and broadcasts updates over WebSockets.
"""
import os
import json
import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional
from ..adapters import WeatherAdapter, TransitAdapter, IncidentsAdapter
from ..database import get_db_connection
from ..models.events import CivicEvent, FeedSourceEnum, SeverityEnum, FeedHealthEnum, FeedHealthStatus
from ..ws import ws_manager

class IngestionManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(IngestionManager, cls).__new__(cls)
            cls._instance._init_manager()
        return cls._instance

    def _init_manager(self):
        self.weather_adapter = WeatherAdapter()
        self.transit_adapter = TransitAdapter()
        self.incidents_adapter = IncidentsAdapter()
        
        # Track feed health telemetry
        now_str = datetime.now(timezone.utc).isoformat()
        self.feed_health: Dict[str, FeedHealthStatus] = {
            FeedSourceEnum.WEATHER.value: FeedHealthStatus(status=FeedHealthEnum.OK, last_seen=now_str, event_count_24h=6),
            FeedSourceEnum.TRANSIT.value: FeedHealthStatus(status=FeedHealthEnum.OK, last_seen=now_str, event_count_24h=5),
            FeedSourceEnum.INCIDENTS.value: FeedHealthStatus(status=FeedHealthEnum.OK, last_seen=now_str, event_count_24h=6),
        }

    def get_feed_health(self) -> Dict[str, FeedHealthStatus]:
        """Return snapshot of feed health status."""
        return self.feed_health

    def set_feed_health(self, feed: str, status: FeedHealthEnum):
        """Manually toggle feed health (useful for graceful degradation demos)."""
        if feed in self.feed_health:
            self.feed_health[feed].status = status

    def save_events_to_db(self, events: List[CivicEvent]) -> int:
        """Write normalized events to SQLite database."""
        if not events:
            return 0
            
        conn = get_db_connection()
        cursor = conn.cursor()
        inserted = 0
        now_str = datetime.now(timezone.utc).isoformat()
        
        for e in events:
            cursor.execute("""
            INSERT OR REPLACE INTO events (id, zone, timestamp, source, type, severity, payload)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                e.id,
                e.zone,
                e.timestamp,
                e.source.value if hasattr(e.source, 'value') else str(e.source),
                e.type,
                e.severity.value if hasattr(e.severity, 'value') else str(e.severity),
                json.dumps(e.payload)
            ))
            inserted += 1
            
            # Update telemetry
            src_key = e.source.value if hasattr(e.source, 'value') else str(e.source)
            if src_key in self.feed_health:
                self.feed_health[src_key].last_seen = now_str
                self.feed_health[src_key].event_count_24h += 1
                
        conn.commit()
        conn.close()
        return inserted

    async def run_ingestion_cycle(self) -> int:
        """Execute one complete ingestion sweep across all active adapters."""
        all_events: List[CivicEvent] = []
        
        # Weather
        if self.feed_health[FeedSourceEnum.WEATHER.value].status != FeedHealthEnum.MISSING:
            try:
                wx_events = await self.weather_adapter.ingest()
                all_events.extend(wx_events)
            except Exception as ex:
                print(f"[Ingestion] Weather feed error: {ex}")
                self.feed_health[FeedSourceEnum.WEATHER.value].status = FeedHealthEnum.DELAYED
                
        # Transit
        if self.feed_health[FeedSourceEnum.TRANSIT.value].status != FeedHealthEnum.MISSING:
            try:
                tr_events = await self.transit_adapter.ingest()
                all_events.extend(tr_events)
            except Exception as ex:
                print(f"[Ingestion] Transit feed error: {ex}")
                self.feed_health[FeedSourceEnum.TRANSIT.value].status = FeedHealthEnum.DELAYED

        # 311 Incidents
        if self.feed_health[FeedSourceEnum.INCIDENTS.value].status != FeedHealthEnum.MISSING:
            try:
                inc_events = await self.incidents_adapter.ingest()
                all_events.extend(inc_events)
            except Exception as ex:
                print(f"[Ingestion] 311 feed error: {ex}")
                self.feed_health[FeedSourceEnum.INCIDENTS.value].status = FeedHealthEnum.DELAYED

        inserted = self.save_events_to_db(all_events)
        
        # Broadcast refresh signal
        await ws_manager.broadcast_json({"type": "ZONE_UPDATE", "timestamp": datetime.now(timezone.utc).isoformat()})
        return inserted

    async def trigger_scenario(self, scenario_name: str, zone: str = "zone-3") -> List[CivicEvent]:
        """Inject preset realistic multi-feed crisis or calm scenarios."""
        now = datetime.now(timezone.utc)
        now_iso = now.isoformat()
        t_minus_5 = (now - timedelta(minutes=5)).isoformat()
        t_minus_10 = (now - timedelta(minutes=10)).isoformat()
        t_minus_15 = (now - timedelta(minutes=15)).isoformat()
        
        events: List[CivicEvent] = []
        
        if scenario_name == "storm_flood":
            events = [
                CivicEvent(
                    id=f"wx-{uuid.uuid4().hex[:6]}",
                    zone=zone,
                    timestamp=t_minus_15,
                    source=FeedSourceEnum.WEATHER,
                    type="flood_alert",
                    severity=SeverityEnum.HIGH,
                    payload={"condition": "Flash flood warning - 35mm/hr torrential rain", "affected_area": f"Low-lying Underpass, {zone}"}
                ),
                CivicEvent(
                    id=f"tr-{uuid.uuid4().hex[:6]}",
                    zone=zone,
                    timestamp=t_minus_10,
                    source=FeedSourceEnum.TRANSIT,
                    type="service_suspended",
                    severity=SeverityEnum.HIGH,
                    payload={"line": "Red Line Metro", "cause": "Flooded track section at 5th & Main", "bus_bridge": "Active"}
                ),
                CivicEvent(
                    id=f"inc-{uuid.uuid4().hex[:6]}",
                    zone=zone,
                    timestamp=t_minus_5,
                    source=FeedSourceEnum.INCIDENTS,
                    type="street_flooding",
                    severity=SeverityEnum.HIGH,
                    payload={"category": "Flooding", "description": "Vehicles stranded at underpass with 3ft standing water"}
                ),
                CivicEvent(
                    id=f"inc-{uuid.uuid4().hex[:6]}",
                    zone=zone,
                    timestamp=now_iso,
                    source=FeedSourceEnum.INCIDENTS,
                    type="power_outage",
                    severity=SeverityEnum.MEDIUM,
                    payload={"category": "Utilities", "description": "Substation water ingress causing localized flickering"}
                )
            ]
        elif scenario_name == "rush_hour_congestion":
            events = [
                CivicEvent(
                    id=f"tr-{uuid.uuid4().hex[:6]}",
                    zone=zone,
                    timestamp=t_minus_10,
                    source=FeedSourceEnum.TRANSIT,
                    type="major_delay",
                    severity=SeverityEnum.MEDIUM,
                    payload={"line": "Blue Line", "delay_min": 18, "cause": "Signal timing malfunction"}
                ),
                CivicEvent(
                    id=f"inc-{uuid.uuid4().hex[:6]}",
                    zone=zone,
                    timestamp=t_minus_5,
                    source=FeedSourceEnum.INCIDENTS,
                    type="traffic_signal_down",
                    severity=SeverityEnum.MEDIUM,
                    payload={"category": "Traffic", "description": "Intersection signals flashing red on Grand Ave"}
                ),
                CivicEvent(
                    id=f"inc-{uuid.uuid4().hex[:6]}",
                    zone=zone,
                    timestamp=now_iso,
                    source=FeedSourceEnum.INCIDENTS,
                    type="transit_complaint",
                    severity=SeverityEnum.LOW,
                    payload={"category": "Transit", "description": "Overcrowded platform at Central Station"}
                )
            ]
        elif scenario_name == "heat_wave":
            events = [
                CivicEvent(
                    id=f"wx-{uuid.uuid4().hex[:6]}",
                    zone=zone,
                    timestamp=t_minus_15,
                    source=FeedSourceEnum.WEATHER,
                    type="excessive_heat_advisory",
                    severity=SeverityEnum.MEDIUM,
                    payload={"condition": "Extreme Heat Advisory 41°C / 106°F", "precip_mm_hr": 0}
                ),
                CivicEvent(
                    id=f"inc-{uuid.uuid4().hex[:6]}",
                    zone=zone,
                    timestamp=t_minus_5,
                    source=FeedSourceEnum.INCIDENTS,
                    type="grid_stress",
                    severity=SeverityEnum.MEDIUM,
                    payload={"category": "Utilities", "description": "AC power surge causing transformer tripping"}
                )
            ]

        self.save_events_to_db(events)
        await ws_manager.broadcast_json({"type": "SCENARIO_TRIGGERED", "scenario": scenario_name, "zone": zone})
        return events

    def reset_database_from_seed(self):
        """Wipe database and re-seed from sample_data JSON files."""
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM events")
        conn.commit()
        conn.close()

        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        sample_dir = os.path.join(os.path.dirname(base_dir), "sample_data")
        
        from ..adapters.weather_adapter import WeatherAdapter
        from ..adapters.transit_adapter import TransitAdapter
        from ..adapters.incidents_adapter import IncidentsAdapter
        
        # Reset feed health
        now_str = datetime.now(timezone.utc).isoformat()
        for k in self.feed_health:
            self.feed_health[k].status = FeedHealthEnum.OK
            self.feed_health[k].last_seen = now_str

        # Seed files
        conn = get_db_connection()
        cursor = conn.cursor()
        for filename, source in [("weather.json", "weather"), ("transit_delays.json", "transit"), ("incidents_311.json", "311")]:
            fpath = os.path.join(sample_dir, filename)
            if os.path.exists(fpath):
                with open(fpath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for ev in data.get("events", []):
                        cursor.execute("""
                        INSERT OR REPLACE INTO events (id, zone, timestamp, source, type, severity, payload)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        """, (
                            ev["id"],
                            ev["zone"],
                            ev["timestamp"],
                            source,
                            ev["type"],
                            ev["severity"],
                            json.dumps(ev.get("payload", {}))
                        ))
        conn.commit()
        conn.close()

ingestion_manager = IngestionManager()
