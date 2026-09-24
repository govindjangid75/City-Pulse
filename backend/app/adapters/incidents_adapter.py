"""
311 Incidents Adapter.
Handles citizen reports (flooding, noise, potholes, power flickers, traffic lights down).
"""
from typing import List
from .base_adapter import BaseAdapter
from ..models.events import CivicEvent, FeedSourceEnum, SeverityEnum

class IncidentsAdapter(BaseAdapter):
    def __init__(self, data_source_path: str = None):
        self.data_source_path = data_source_path

    async def fetch_raw_data(self) -> List[dict]:
        return []

    def normalize(self, raw_record: dict) -> CivicEvent:
        return CivicEvent(
            id=raw_record.get("id"),
            zone=raw_record.get("zone"),
            timestamp=raw_record.get("timestamp"),
            source=FeedSourceEnum.INCIDENTS,
            type=raw_record.get("type", "incident"),
            severity=SeverityEnum(raw_record.get("severity", "low")),
            payload=raw_record.get("payload", {})
        )

    async def ingest(self) -> List[CivicEvent]:
        raw_events = await self.fetch_raw_data()
        return [self.normalize(e) for e in raw_events]
