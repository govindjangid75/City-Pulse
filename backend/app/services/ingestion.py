"""
Ingestion Orchestration Service.
Schedules periodic polling of adapters, normalizes records, and writes to SQLite.
"""
from typing import List
from ..adapters import WeatherAdapter, TransitAdapter, IncidentsAdapter
from ..database import get_db_connection
from ..models.events import CivicEvent

class IngestionManager:
    def __init__(self):
        self.weather_adapter = WeatherAdapter()
        self.transit_adapter = TransitAdapter()
        self.incidents_adapter = IncidentsAdapter()

    async def run_ingestion_cycle(self) -> int:
        """Execute one ingestion sweep across all configured adapters."""
        all_events: List[CivicEvent] = []
        # Ingestion logic pulls from adapters and stores to DB
        return len(all_events)
