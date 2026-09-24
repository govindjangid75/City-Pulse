"""
Transit Data Adapter for CityPulse.
Handles real-time metro, bus, and rail alerts, delays, and service suspensions.
"""
import os
import json
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from .base_adapter import BaseAdapter
from ..models.events import CivicEvent, FeedSourceEnum, SeverityEnum
from ..services.normalization import parse_iso_utc, map_severity

class TransitAdapter(BaseAdapter):
    def __init__(self, data_source_path: Optional[str] = None):
        if data_source_path:
            self.data_source_path = data_source_path
        else:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.data_source_path = os.path.join(os.path.dirname(base_dir), "sample_data", "transit_delays.json")

    async def fetch_raw_data(self) -> List[dict]:
        """Fetch raw transit events from data source."""
        if os.path.exists(self.data_source_path):
            try:
                with open(self.data_source_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return data.get("events", [])
            except Exception as e:
                print(f"[TransitAdapter] Error reading file {self.data_source_path}: {e}")
                return []
        return []

    def normalize(self, raw_record: dict) -> CivicEvent:
        """Standardize raw transit record into unified CivicEvent schema."""
        event_id = str(raw_record.get("id") or f"tr-{uuid.uuid4().hex[:8]}")
        zone = str(raw_record.get("zone", "zone-1"))
        timestamp = parse_iso_utc(raw_record.get("timestamp", datetime.now(timezone.utc).isoformat()))
        event_type = str(raw_record.get("type", "on_time"))
        severity = map_severity(raw_record.get("severity", "low"))
        payload = raw_record.get("payload", {})
        
        return CivicEvent(
            id=event_id,
            zone=zone,
            timestamp=timestamp,
            source=FeedSourceEnum.TRANSIT,
            type=event_type,
            severity=severity,
            payload=payload
        )

    async def ingest(self) -> List[CivicEvent]:
        """Fetch raw records, normalize, and return validated CivicEvent objects."""
        raw_events = await self.fetch_raw_data()
        return [self.normalize(e) for e in raw_events]
