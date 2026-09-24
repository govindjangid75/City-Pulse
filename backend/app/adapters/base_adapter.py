"""
Abstract Base Adapter for Civic Data Feeds.
All adapters (weather, transit, 311) must adhere to this interface.
"""
from abc import ABC, abstractmethod
from typing import List
from ..models.events import CivicEvent

class BaseAdapter(ABC):
    @abstractmethod
    async def fetch_raw_data(self) -> List[dict]:
        """Fetch raw data from external API or local synthetic stream."""
        pass

    @abstractmethod
    def normalize(self, raw_record: dict) -> CivicEvent:
        """Transform raw feed payload into standardized CivicEvent schema."""
        pass

    @abstractmethod
    async def ingest(self) -> List[CivicEvent]:
        """Fetch, normalize, and return validated CivicEvent objects."""
        pass
