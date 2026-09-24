"""
civic_score.py — Transparent, Deterministic Civic Health Score Engine for CityPulse.
Calculates 0-100 composite score with explicit factor breakdowns, positive/negative drivers,
and explainable provenance. Never generates arbitrary numbers.
"""

from typing import Dict, Any, List, Optional
import numpy as np

def calculate_civic_health(
    traffic_speed_ratio: float = 0.85,    # current speed / speed limit (0.0 to 1.0+)
    congestion_index: float = 0.35,       # 0.0 (free) to 1.0 (gridlock)
    aqi_val: float = 65.0,                # 0 to 500
    water_leak_risk: float = 0.15,        # 0.0 to 1.0
    water_pressure_bar: float = 4.2,      # normal ~3.5 to 5.0 bar
    grid_load_pct: float = 68.0,          # 0 to 100%
    solar_pct: float = 28.0,              # 0 to 100%
    severe_weather: bool = False,
    rain_rate_mmh: float = 2.0,           # mm/hour
    active_incidents: int = 1,
    city: str = "Jaipur",
    zone: Optional[str] = None
) -> Dict[str, Any]:
    """
    Computes a transparent 0-100 Civic Health Score based on actual sensor streams.
    """
    # 1. Traffic Factor (0-100)
    # Penalized by congestion index and speed deficit
    speed_factor = min(1.0, max(0.2, traffic_speed_ratio))
    congestion_penalty = min(1.0, max(0.0, congestion_index))
    traffic_score = round(max(10.0, min(100.0, (speed_factor * 0.6 + (1.0 - congestion_penalty) * 0.4) * 100)), 1)

    # 2. Air Quality Factor (0-100)
    # AQI: 0-50 -> 100-90, 51-100 -> 89-70, 101-150 -> 69-50, 151-200 -> 49-30, 200+ -> <30
    if aqi_val <= 50:
        air_score = 100.0 - (aqi_val / 50.0) * 10.0
    elif aqi_val <= 100:
        air_score = 90.0 - ((aqi_val - 50.0) / 50.0) * 20.0
    elif aqi_val <= 150:
        air_score = 70.0 - ((aqi_val - 100.0) / 50.0) * 20.0
    elif aqi_val <= 200:
        air_score = 50.0 - ((aqi_val - 150.0) / 50.0) * 20.0
    else:
        air_score = max(10.0, 30.0 - ((aqi_val - 200.0) / 100.0) * 20.0)
    air_score = round(air_score, 1)

    # 3. Water Utility Factor (0-100)
    # Pressure ideal between 3.5 and 5.0 bar; high leak risk penalizes heavily
    pressure_health = 1.0 if (3.2 <= water_pressure_bar <= 5.2) else max(0.3, 1.0 - abs(water_pressure_bar - 4.0) * 0.25)
    leak_health = max(0.2, 1.0 - water_leak_risk)
    water_score = round((pressure_health * 0.5 + leak_health * 0.5) * 100, 1)

    # 4. Energy Factor (0-100)
    # Grid load ideal < 75%, solar adds resilience bonus
    grid_health = max(0.2, (100.0 - grid_load_pct) / 60.0) if grid_load_pct > 40 else 1.0
    grid_health = min(1.0, grid_health)
    solar_bonus = min(10.0, (solar_pct / 100.0) * 10.0)
    energy_score = round(min(100.0, (grid_health * 90.0) + solar_bonus), 1)

    # 5. Weather Stability Factor (0-100)
    if severe_weather:
        weather_score = 35.0
    elif rain_rate_mmh > 25.0:
        weather_score = 45.0
    elif rain_rate_mmh > 10.0:
        weather_score = 65.0
    elif rain_rate_mmh > 2.0:
        weather_score = 80.0
    else:
        weather_score = 95.0
    weather_score = round(weather_score, 1)

    # 6. Safety & Incident Factor (0-100)
    safety_score = round(max(20.0, 100.0 - (active_incidents * 4.5)), 1)

    # Weighted Composite Score
    weights = {
        "traffic": 0.25,
        "air": 0.20,
        "water": 0.20,
        "energy": 0.15,
        "weather": 0.10,
        "safety": 0.10
    }
    overall = (
        traffic_score * weights["traffic"] +
        air_score * weights["air"] +
        water_score * weights["water"] +
        energy_score * weights["energy"] +
        weather_score * weights["weather"] +
        safety_score * weights["safety"]
    )
    overall_score = round(overall, 1)

    # Determine Status Tier
    if overall_score >= 75.0:
        status = "HEALTHY"
        status_color = "#10b981"  # Emerald
    elif overall_score >= 60.0:
        status = "WATCH"
        status_color = "#3b82f6"  # Blue
    elif overall_score >= 45.0:
        status = "WARNING"
        status_color = "#f59e0b"  # Amber
    else:
        status = "CRITICAL"
        status_color = "#ef4444"  # Red

    # Transparent Drivers: Positive vs Negative Contributions
    # Standard baseline is 75 for each sub-domain
    baseline = 75.0
    drivers_pos = []
    drivers_neg = []

    sub_metrics = [
        ("Water utility stability", water_score, 0.20),
        ("Energy grid stability", energy_score, 0.15),
        ("Traffic flow efficiency", traffic_score, 0.25),
        ("Air quality index", air_score, 0.20),
        ("Weather stability", weather_score, 0.10),
        ("Civic safety & low reports", safety_score, 0.10)
    ]

    for label, val, w in sub_metrics:
        delta = round((val - baseline) * w, 1)
        if delta >= 1.0:
            drivers_pos.append(f"{label} (+{delta})")
        elif delta <= -1.0:
            drivers_neg.append(f"{label} ({delta})")

    if not drivers_pos:
        drivers_pos.append("All signals within standard operational baselines")
    if not drivers_neg:
        drivers_neg.append("No critical anomalies currently penalizing score")

    return {
        "city": city,
        "zone": zone or "City-Wide",
        "score": overall_score,
        "status": status,
        "status_color": status_color,
        "factors": {
            "traffic": traffic_score,
            "air_quality": air_score,
            "water": water_score,
            "energy": energy_score,
            "weather": weather_score,
            "safety": safety_score
        },
        "weights": weights,
        "drivers": {
            "positive": drivers_pos[:3],
            "negative": drivers_neg[:3]
        },
        "why_this_score": f"Civic Health is {overall_score}/100 ({status}). Major headwinds: {', '.join(drivers_neg[:2])}. Supporting factors: {', '.join(drivers_pos[:2])}."
    }
