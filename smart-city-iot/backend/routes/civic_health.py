"""
civic_health.py — API Router for Transparent Civic Health Scoring.
"""

from fastapi import APIRouter, Query
from backend.services.civic_score import calculate_civic_health
from backend.services.demo_scenario import is_demo_active

router = APIRouter(prefix="/api/civic-health", tags=["Civic Health"])

@router.get("")
def get_civic_health(city: str = Query("Jaipur")):
    """
    Returns the comprehensive, transparent 0-100 Civic Health Score for a city.
    """
    if is_demo_active() and city.lower() == "jaipur":
        return calculate_civic_health(
            traffic_speed_ratio=0.42,
            congestion_index=0.88,
            aqi_val=110.0,
            water_leak_risk=0.74,
            water_pressure_bar=2.4,
            grid_load_pct=82.0,
            severe_weather=True,
            rain_rate_mmh=48.0,
            active_incidents=17,
            city="Jaipur",
            zone="Mansarovar"
        )
    return calculate_civic_health(city=city)

@router.get("/{area}")
def get_area_civic_health(area: str, city: str = Query("Jaipur")):
    """
    Returns localized civic health score for a specific neighborhood/zone.
    """
    if is_demo_active() and area.lower() == "mansarovar":
        return calculate_civic_health(
            traffic_speed_ratio=0.38,
            congestion_index=0.92,
            aqi_val=115.0,
            water_leak_risk=0.82,
            water_pressure_bar=2.2,
            grid_load_pct=85.0,
            severe_weather=True,
            rain_rate_mmh=52.0,
            active_incidents=17,
            city=city,
            zone=area
        )
    # Different zones have realistic variances
    zone_offsets = {
        "Mansarovar": (0.75, 0.40, 75.0, 0.20, 4.0, 70.0),
        "Malviya Nagar": (0.68, 0.55, 82.0, 0.15, 4.1, 72.0),
        "C-Scheme": (0.90, 0.25, 60.0, 0.08, 4.4, 65.0),
        "Vaishali Nagar": (0.85, 0.30, 68.0, 0.12, 4.2, 68.0),
        "Sitapura Industrial": (0.78, 0.45, 178.0, 0.22, 3.8, 88.0)
    }
    params = zone_offsets.get(area, (0.82, 0.35, 70.0, 0.15, 4.1, 68.0))
    return calculate_civic_health(
        traffic_speed_ratio=params[0],
        congestion_index=params[1],
        aqi_val=params[2],
        water_leak_risk=params[3],
        water_pressure_bar=params[4],
        grid_load_pct=params[5],
        city=city,
        zone=area
    )
