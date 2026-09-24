"""
demo_scenario.py — Deterministic 16-Step Hackathon Demo Scenario Controller for CityPulse.
Provides 1-click toggling between Normal City State and the Urban Flooding Crisis Scenario.
Guarantees 100% reliable, deterministic presentation during judge evaluation.
"""

from typing import Dict, Any
from backend.services.civic_score import calculate_civic_health
from backend.services.event_fusion import get_all_events, reset_events_to_normal, _ACTIVE_EVENTS
from backend.services.report_clustering import init_seed_reports

# Global demo mode state
_DEMO_ACTIVE = False

def is_demo_active() -> bool:
    return _DEMO_ACTIVE

def set_demo_mode(active: bool = True, city: str = "Jaipur") -> Dict[str, Any]:
    """
    Activates or deactivates the deterministic Urban Flooding Crisis Scenario.
    """
    global _DEMO_ACTIVE
    _DEMO_ACTIVE = active

    if active:
        # 1. Ensure events and reports are in the active flooding crisis state
        init_seed_reports(city)
        get_all_events(city)
        
        # Calculate crisis health score: dropped from 84 down to 54
        health = calculate_civic_health(
            traffic_speed_ratio=0.42,
            congestion_index=0.88,
            aqi_val=110.0,
            water_leak_risk=0.74,
            water_pressure_bar=2.4,
            grid_load_pct=82.0,
            severe_weather=True,
            rain_rate_mmh=48.0,
            active_incidents=17,
            city=city,
            zone="Mansarovar"
        )
        return {
            "demo_active": True,
            "scenario": "CRITICAL_URBAN_FLOODING_MANSAROVAR",
            "message": "⚡ Urban Flooding Scenario ACTIVATED. Heavy rain telemetry injected (+186%), arterial speed dropped (-42%), water pressure fell to 2.4 bar, 17 citizen reports clustered.",
            "civic_health": health,
            "step_guide": [
                "1. Observe Civic Health drop to 54 (Warning)",
                "2. Live Map displays pulsating 2.8 km² flooding polygon in Mansarovar",
                "3. Click event marker to view timeline & structured evidence",
                "4. Check AI grounded explanation",
                "5. Open Operations Center to assign SDRF Unit 4 and resolve"
            ]
        }
    else:
        # Reset to pristine baseline
        reset_events_to_normal(city)
        init_seed_reports(city)
        
        normal_health = calculate_civic_health(
            traffic_speed_ratio=0.88,
            congestion_index=0.25,
            aqi_val=55.0,
            water_leak_risk=0.10,
            water_pressure_bar=4.2,
            grid_load_pct=62.0,
            severe_weather=False,
            rain_rate_mmh=0.0,
            active_incidents=0,
            city=city
        )
        return {
            "demo_active": False,
            "scenario": "NORMAL_BASELINE",
            "message": "🔄 Demo scenario RESET. All systems operating at nominal baseline (Civic Health 84 / Healthy).",
            "civic_health": normal_health
        }
