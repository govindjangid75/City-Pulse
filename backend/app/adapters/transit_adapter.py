"""
Transit Data Adapter for CityPulse.
Handles real-time traffic incidents, road closures, congestion delays, and transit alerts.
Pulls live telemetry from TomTom Traffic API with fallback to local sample data.
"""
import os
import json
import uuid
from datetime import datetime, timezone
from typing import List, Optional
import httpx

from .base_adapter import BaseAdapter
from ..config import settings
from ..models.events import CivicEvent, FeedSourceEnum, SeverityEnum
from ..services.normalization import parse_iso_utc, map_severity

class TransitAdapter(BaseAdapter):
    def __init__(self, data_source_path: Optional[str] = None):
        if data_source_path:
            self.data_source_path = data_source_path
        else:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.data_source_path = os.path.join(os.path.dirname(base_dir), "sample_data", "transit_delays.json")

    async def _fetch_tomtom_incidents(self) -> List[dict]:
        """Fetch live traffic incidents from TomTom API."""
        if not settings.TOMTOM_API_KEY:
            return []

        lat = settings.CITY_LATITUDE or 28.5447
        lon = settings.CITY_LONGITUDE or 77.3331
        # Bounding box around monitored city region (+/- 0.25 deg ~ 25km)
        bbox = f"{lon - 0.25:.4f},{lat - 0.20:.4f},{lon + 0.25:.4f},{lat + 0.20:.4f}"
        url = "https://api.tomtom.com/traffic/services/5/incidentDetails"
        params = {
            "key": settings.TOMTOM_API_KEY,
            "bbox": bbox,
            "fields": "{incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code},from,to,length,delay}}}"
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()

        incidents = data.get("incidents", [])
        events = []
        center_lat = lat
        center_lon = lon

        for inc in incidents[:20]:  # Top 20 most relevant live events
            props = inc.get("properties", {})
            geom = inc.get("geometry", {})
            coords = geom.get("coordinates", [])

            # Extract latitude and longitude
            item_lat, item_lon = None, None
            if coords:
                if isinstance(coords[0], list):
                    mid_idx = len(coords) // 2
                    item_lon, item_lat = coords[mid_idx][0], coords[mid_idx][1]
                elif len(coords) >= 2:
                    item_lon, item_lat = coords[0], coords[1]

            # Assign to zone based on quadrant
            if item_lat is not None and item_lon is not None:
                if item_lat >= center_lat and item_lon < center_lon:
                    zone = "zone-1"
                elif item_lat >= center_lat and item_lon >= center_lon:
                    zone = "zone-2"
                elif item_lat < center_lat and item_lon < center_lon:
                    zone = "zone-3"
                else:
                    zone = "zone-4"
            else:
                zone = "zone-1"

            mag = props.get("magnitudeOfDelay", 0)
            events_desc = props.get("events", [])
            desc = events_desc[0].get("description", "Traffic Delay") if events_desc else "Congestion"

            if mag == 4 or "closed" in desc.lower():
                severity = "critical"
                event_type = "road_closure"
            elif mag == 3:
                severity = "high"
                event_type = "major_delay"
            elif mag == 2:
                severity = "medium"
                event_type = "delay"
            else:
                severity = "low"
                event_type = "minor_delay"

            from_loc = props.get("from", "")
            to_loc = props.get("to", "")
            if from_loc and to_loc:
                road = f"{from_loc} -> {to_loc}"
            elif from_loc:
                road = from_loc
            else:
                road = "Metropolitan Arterial Corridor"

            events.append({
                "id": f"tt-{props.get('id', uuid.uuid4().hex[:8])}",
                "zone": zone,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "type": event_type,
                "severity": severity,
                "payload": {
                    "line": road,
                    "cause": desc,
                    "delay_min": round((props.get("delay") or 0) / 60, 1),
                    "length_m": round(props.get("length") or 0),
                    "magnitude": mag,
                    "city": settings.CITY_NAME,
                    "source_provider": "TomTom Live Traffic"
                }
            })

        return events

    async def fetch_raw_data(self) -> List[dict]:
        """Fetch raw transit/traffic events from live TomTom API or fallback to JSON storage."""
        # Try live TomTom Traffic first if key is present
        if settings.TOMTOM_API_KEY:
            try:
                live_events = await self._fetch_tomtom_incidents()
                if live_events:
                    return live_events
            except Exception as e:
                print(f"[TransitAdapter] Live TomTom fetch warning: {e}. Falling back to sample data.")

        # Fallback to local sample dataset
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
