"""
replay_engine.py — Historical Incident Replay Simulation Service for CityPulse.
Provides time-stepped forensic frames (18:00 -> 18:50) allowing judges and operators
to scrub through and watch an emergent civic crisis unfold second-by-second.
"""

from typing import Dict, List, Any

def get_replay_frames(event_id: str = "EVT-JPR-FLOOD-001") -> Dict[str, Any]:
    """
    Returns high-resolution replay frames for the Mansarovar Flooding Incident.
    """
    frames = [
        {
            "step": 1,
            "time": "18:00",
            "title": "Baseline Conditions",
            "civic_health": 84,
            "rain_mmh": 2.1,
            "traffic_speed_kmh": 46.0,
            "water_pressure_bar": 4.2,
            "citizen_reports": 0,
            "event_status": "NONE",
            "polygon_visible": False,
            "description": "City operating normally. Precipitation minimal, traffic flowing at 46 km/h, utility pressure steady."
        },
        {
            "step": 2,
            "time": "18:10",
            "title": "Precipitation Onset",
            "civic_health": 80,
            "rain_mmh": 18.5,
            "traffic_speed_kmh": 41.0,
            "water_pressure_bar": 4.1,
            "citizen_reports": 1,
            "event_status": "MONITORING",
            "polygon_visible": False,
            "description": "Convective rain cell arrives over Mansarovar southwest quadrant. Open-Meteo radar detects sharp uptick."
        },
        {
            "step": 3,
            "time": "18:24",
            "title": "Weather Anomaly Detected",
            "civic_health": 74,
            "rain_mmh": 36.0,
            "traffic_speed_kmh": 32.0,
            "water_pressure_bar": 3.8,
            "citizen_reports": 4,
            "event_status": "WATCH",
            "polygon_visible": True,
            "polygon_intensity": "LOW",
            "description": "Rainfall anomaly triggers threshold monitor (+110% over normal). Drainage inflow approaching design limits."
        },
        {
            "step": 4,
            "time": "18:31",
            "title": "Arterial Deceleration & Water Anomaly",
            "civic_health": 67,
            "rain_mmh": 44.0,
            "traffic_speed_kmh": 22.0,
            "water_pressure_bar": 3.1,
            "citizen_reports": 9,
            "event_status": "WARNING",
            "polygon_visible": True,
            "polygon_intensity": "MEDIUM",
            "description": "Corridor speed on Shipra Path drops 48%. Stormwater backpressure detected in municipal storm main."
        },
        {
            "step": 5,
            "time": "18:42",
            "title": "Citizen Reports Surge",
            "civic_health": 58,
            "rain_mmh": 48.0,
            "traffic_speed_kmh": 18.0,
            "water_pressure_bar": 2.4,
            "citizen_reports": 17,
            "event_status": "CLUSTERING",
            "polygon_visible": True,
            "polygon_intensity": "HIGH",
            "description": "17 crowdsourced 311 reports flood into gateway within 1.2 km radius citing deep standing water."
        },
        {
            "step": 6,
            "time": "18:50",
            "title": "Event Fusion & Official Dispatch",
            "civic_health": 54,
            "rain_mmh": 48.0,
            "traffic_speed_kmh": 16.0,
            "water_pressure_bar": 2.4,
            "citizen_reports": 17,
            "event_status": "CRITICAL_DISPATCHED",
            "polygon_visible": True,
            "polygon_intensity": "CRITICAL",
            "description": "CityPulse Event Fusion Engine synthesizes multi-signal crisis: declares Possible Urban Flooding. SDRF Unit 4 deployed."
        }
    ]

    return {
        "event_id": event_id,
        "event_title": "Possible Urban Flooding & Waterlogging (Forensic Playback)",
        "location": "Mansarovar, Jaipur",
        "duration": "50 minutes (18:00 – 18:50)",
        "total_frames": len(frames),
        "frames": frames
    }
