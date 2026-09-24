"""
Weather Data Adapter for CityPulse.
Handles real-time meteorological observations, storm warnings, flood advisories, and weather sensor feeds.
Pulls live telemetry from Open-Meteo with fallback to local sample data.
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

class WeatherAdapter(BaseAdapter):
    def __init__(self, data_source_path: Optional[str] = None):
        if data_source_path:
            self.data_source_path = data_source_path
        else:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.data_source_path = os.path.join(os.path.dirname(base_dir), "sample_data", "weather.json")

    async def _fetch_open_meteo(self) -> List[dict]:
        """Fetch live meteorological telemetry from Open-Meteo API."""
        lat = settings.CITY_LATITUDE or 28.5447
        lon = settings.CITY_LONGITUDE or 77.3331
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m"
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()

        current = data.get("current", {})
        if not current:
            return []

        temp = current.get("temperature_2m", 25.0)
        humidity = current.get("relative_humidity_2m", 50)
        precip = current.get("precipitation", 0.0)
        code = current.get("weather_code", 0)
        wind = current.get("wind_speed_10m", 10.0)
        now_iso = datetime.now(timezone.utc).isoformat()

        # Determine condition description & severity
        if code in [95, 96, 99]:
            condition = "Severe Thunderstorm & Lightning"
            w_type = "storm_warning"
            severity = "critical"
        elif code in [65, 75, 82]:
            condition = "Heavy Torrential Rainfall"
            w_type = "heavy_rain"
            severity = "high"
        elif precip > 5.0:
            condition = f"Active Rain ({precip} mm/h)"
            w_type = "rain"
            severity = "medium"
        elif code in [45, 48]:
            condition = "Dense Fog Advisory"
            w_type = "fog"
            severity = "medium"
        elif temp >= 42.0:
            condition = f"Extreme Heat Warning ({temp}°C)"
            w_type = "heat_advisory"
            severity = "high"
        elif wind >= 45.0:
            condition = f"High Wind Warning ({wind} km/h)"
            w_type = "high_winds"
            severity = "high"
        elif code in [1, 2, 3]:
            condition = "Partly Cloudy"
            w_type = "cloudy"
            severity = "low"
        else:
            condition = "Clear Sky"
            w_type = "clear"
            severity = "low"

        events = []
        zones = settings.ACTIVE_ZONES or ["zone-1", "zone-2", "zone-3", "zone-4"]
        for idx, z in enumerate(zones):
            z_temp = round(temp + (idx * 0.4 - 0.6), 1)
            z_hum = max(10, min(100, int(humidity + (idx * 2 - 3))))
            events.append({
                "id": f"wx-live-{z}-{datetime.now(timezone.utc).strftime('%H%M')}",
                "zone": z,
                "timestamp": now_iso,
                "type": w_type,
                "severity": severity,
                "payload": {
                    "condition": condition,
                    "temperature_c": z_temp,
                    "humidity_percent": z_hum,
                    "precipitation_mm": precip,
                    "wind_kmh": wind,
                    "weather_code": code,
                    "city": settings.CITY_NAME,
                    "source_provider": "Open-Meteo Live"
                }
            })

        return events

    async def fetch_raw_data(self) -> List[dict]:
        """Fetch raw weather observations from Open-Meteo or fallback to JSON storage."""
        try:
            live_weather = await self._fetch_open_meteo()
            if live_weather:
                return live_weather
        except Exception as e:
            print(f"[WeatherAdapter] Live weather fetch warning: {e}. Falling back to sample data.")

        if os.path.exists(self.data_source_path):
            try:
                with open(self.data_source_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return data.get("events", [])
            except Exception as e:
                print(f"[WeatherAdapter] Error reading file {self.data_source_path}: {e}")
                return []
        return []

    def normalize(self, raw_record: dict) -> CivicEvent:
        """Standardize raw weather record into unified CivicEvent schema."""
        event_id = str(raw_record.get("id") or f"wx-{uuid.uuid4().hex[:8]}")
        zone = str(raw_record.get("zone", "zone-1"))
        timestamp = parse_iso_utc(raw_record.get("timestamp", datetime.now(timezone.utc).isoformat()))
        event_type = str(raw_record.get("type", "clear"))
        severity = map_severity(raw_record.get("severity", "low"))
        payload = raw_record.get("payload", {})
        
        return CivicEvent(
            id=event_id,
            zone=zone,
            timestamp=timestamp,
            source=FeedSourceEnum.WEATHER,
            type=event_type,
            severity=severity,
            payload=payload
        )

    async def ingest(self) -> List[CivicEvent]:
        """Fetch raw records, normalize, and return validated CivicEvent objects."""
        raw_events = await self.fetch_raw_data()
        return [self.normalize(e) for e in raw_events]
