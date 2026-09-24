"""
neighborhoods.py — API Router for Neighborhood/Zone Civic Health Comparison.
"""

from fastapi import APIRouter, Query
from backend.services.city_profiles import get_profile, get_zone_coordinates
from backend.services.civic_score import calculate_civic_health

router = APIRouter(prefix="/api/neighborhoods", tags=["Neighborhoods"])

@router.get("")
def list_neighborhoods(city: str = Query("Jaipur")):
    """
    Returns comparative civic scorecard for all zones/neighborhoods in a city.
    """
    profile = get_profile(city)
    zones = profile.get("zones", ["Central", "North", "South", "East", "West"])

    zone_data = []
    zone_profiles = {
        "Mansarovar": (0.75, 0.40, 75.0, 0.20, 4.0, 70.0, 3, 17),
        "Malviya Nagar": (0.68, 0.55, 82.0, 0.15, 4.1, 72.0, 1, 3),
        "C-Scheme": (0.90, 0.25, 60.0, 0.08, 4.4, 65.0, 0, 1),
        "Vaishali Nagar": (0.85, 0.30, 68.0, 0.12, 4.2, 68.0, 0, 2),
        "Sitapura Industrial": (0.78, 0.45, 178.0, 0.22, 3.8, 88.0, 1, 4)
    }

    for z in zones:
        lat, lon = get_zone_coordinates(city, z)
        p = zone_profiles.get(z, (0.82, 0.35, 70.0, 0.15, 4.1, 68.0, 0, 2))
        h = calculate_civic_health(
            traffic_speed_ratio=p[0],
            congestion_index=p[1],
            aqi_val=p[2],
            water_leak_risk=p[3],
            water_pressure_bar=p[4],
            grid_load_pct=p[5],
            city=city,
            zone=z
        )
        zone_data.append({
            "name": z,
            "city": city,
            "latitude": lat,
            "longitude": lon,
            "civic_health": h["score"],
            "status": h["status"],
            "status_color": h["status_color"],
            "factors": h["factors"],
            "active_events": p[6],
            "citizen_reports": p[7],
            "why_this_score": h["why_this_score"]
        })

    return {
        "city": city,
        "count": len(zone_data),
        "neighborhoods": sorted(zone_data, key=lambda x: x["civic_health"], reverse=True)
    }
