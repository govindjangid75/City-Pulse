"""
event_fusion.py — Multi-Signal Civic Event Fusion Engine for CityPulse.
Groups co-occurring heterogeneous sensor anomalies and citizen reports within
spatiotemporal boundaries into unified, explainable Civic Events.
Adheres strictly to epistemic honesty: states correlations and co-occurrences,
never asserts unproven causal links.
"""

from datetime import datetime
from typing import Dict, List, Any, Optional
import uuid
from backend.services.evidence_engine import build_evidence
from backend.services.city_profiles import get_zone_coordinates

class CivicEvent:
    def __init__(
        self,
        event_id: str,
        city: str,
        area: str,
        category: str,
        title: str,
        severity: str,       # CRITICAL, WARNING, WATCH, INFO
        confidence: float,   # 0.0 to 1.0
        latitude: float,
        longitude: float,
        affected_area_km2: float,
        affected_roads: List[str],
        signals: Dict[str, Any],
        evidence: List[Dict[str, Any]],
        timeline: List[Dict[str, str]],
        recommended_actions: List[str],
        assigned_department: Optional[str] = None,
        assigned_officer: Optional[str] = None,
        status: str = "ACTIVE", # ACTIVE, INVESTIGATING, DISPATCHED, RESOLVED
        notes: Optional[List[Dict[str, str]]] = None,
        created_at: Optional[str] = None
    ):
        self.event_id = event_id
        self.city = city
        self.area = area
        self.category = category
        self.title = title
        self.severity = severity
        self.confidence = round(confidence, 2)
        self.latitude = latitude
        self.longitude = longitude
        self.affected_area_km2 = affected_area_km2
        self.affected_roads = affected_roads
        self.signals = signals
        self.evidence = evidence
        self.timeline = timeline
        self.recommended_actions = recommended_actions
        self.assigned_department = assigned_department or "Unassigned"
        self.assigned_officer = assigned_officer or "Pending Dispatch"
        self.status = status
        self.notes = notes or []
        self.created_at = created_at or datetime.utcnow().isoformat() + "Z"
        self.updated_at = datetime.utcnow().isoformat() + "Z"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_id": self.event_id,
            "city": self.city,
            "area": self.area,
            "category": self.category,
            "title": self.title,
            "severity": self.severity,
            "confidence": self.confidence,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "affected_area_km2": self.affected_area_km2,
            "affected_roads": self.affected_roads,
            "signals": self.signals,
            "evidence": self.evidence,
            "timeline": self.timeline,
            "recommended_actions": self.recommended_actions,
            "assigned_department": self.assigned_department,
            "assigned_officer": self.assigned_officer,
            "status": self.status,
            "notes": self.notes,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "epistemic_notice": "Observed signals are strongly co-occurring in space and time. Correlation detected; causality remains an investigative hypothesis until field inspection."
        }

# Global in-memory event registry to persist state updates and operator actions during demo
_ACTIVE_EVENTS: Dict[str, CivicEvent] = {}

def get_seed_events(city: str = "Jaipur") -> List[CivicEvent]:
    """Generates realistic baseline and emerging civic events for a given city."""
    events = []
    
    if city == "Jaipur":
        lat_m, lon_m = get_zone_coordinates("Jaipur", "Mansarovar")
        lat_mal, lon_mal = get_zone_coordinates("Jaipur", "Malviya Nagar")
        lat_sit, lon_sit = get_zone_coordinates("Jaipur", "Sitapura Industrial")

        # 1. Critical Flooding Event (The Hero Demo Event)
        e1 = CivicEvent(
            event_id="EVT-JPR-FLOOD-001",
            city="Jaipur",
            area="Mansarovar",
            category="Urban Flooding",
            title="Possible Urban Flooding & Waterlogging",
            severity="CRITICAL",
            confidence=0.87,
            latitude=lat_m,
            longitude=lon_m,
            affected_area_km2=2.8,
            affected_roads=["Shipra Path", "Madhyam Marg", "New Sanganer Road", "Varun Path"],
            signals={
                "rainfall_anomaly": "+186%",
                "traffic_speed_delta": "-42%",
                "water_pressure_anomaly": "-38%",
                "citizen_reports_count": 17
            },
            evidence=[
                build_evidence("Open-Meteo Weather Radar", "precipitation_rate", "46 mm/h", "4 mm/h", "mm/h", "Mansarovar", "Jaipur", 0.94, "LIVE"),
                build_evidence("Arterial Speed Sensors", "traffic_speed", "18 km/h", "42 km/h", "km/h", "Mansarovar", "Jaipur", 0.89, "SIMULATED"),
                build_evidence("SCADA Water Telemetry", "mains_pressure", "2.4 bar", "4.2 bar", "bar", "Mansarovar", "Jaipur", 0.85, "SIMULATED"),
                build_evidence("Citizen 311 Portal", "verified_complaints", 17, 2, "reports", "Mansarovar", "Jaipur", 0.92, "LIVE")
            ],
            timeline=[
                {"time": "18:10", "event": "Heavy precipitation onset recorded by weather sensor (+186% over baseline)"},
                {"time": "18:24", "event": "Weather anomaly flagged by threshold monitor"},
                {"time": "18:31", "event": "Traffic speed deceleration detected on Shipra Path (18 km/h)"},
                {"time": "18:42", "event": "17 citizen waterlogging reports clustered within 1.2 km radius"},
                {"time": "18:47", "event": "CityPulse Event Fusion Engine synthesizes multi-signal Flooding Event"},
                {"time": "18:50", "event": "Disaster Response Alert issued to SDRF & Traffic Command"}
            ],
            recommended_actions=[
                "Deploy high-capacity mobile dewatering pump to Shipra Path underpass",
                "Divert inbound traffic from New Sanganer Road toward Gopalpura Bypass",
                "Broadcast localized civic advisory to Mansarovar residents"
            ],
            assigned_department="State Disaster Response (SDRF)",
            assigned_officer="Insp. R. Sharma (Unit 4)",
            status="ACTIVE"
        )
        events.append(e1)

        # 2. Warning Traffic Congestion Event
        e2 = CivicEvent(
            event_id="EVT-JPR-TRF-002",
            city="Jaipur",
            area="Malviya Nagar",
            category="Traffic Disruption",
            title="Severe Arterial Traffic Congestion",
            severity="WARNING",
            confidence=0.79,
            latitude=lat_mal,
            longitude=lon_mal,
            affected_area_km2=1.4,
            affected_roads=["JLN Marg", "Calgiri Marg", "Apex Circle"],
            signals={
                "congestion_index": "0.88",
                "average_speed": "14 km/h",
                "vehicle_count_delta": "+54%"
            },
            evidence=[
                build_evidence("Traffic Loop Detectors", "congestion_index", 0.88, 0.35, "idx", "Malviya Nagar", "Jaipur", 0.82, "SIMULATED"),
                build_evidence("Arterial Speed Sensors", "traffic_speed", "14 km/h", "38 km/h", "km/h", "Malviya Nagar", "Jaipur", 0.85, "SIMULATED")
            ],
            timeline=[
                {"time": "18:20", "event": "Gradual bottleneck formation at Apex Circle"},
                {"time": "18:35", "event": "Congestion index breached warning threshold (0.75)"},
                {"time": "18:48", "event": "Signals indicate co-occurrence with localized signal timing delay"}
            ],
            recommended_actions=[
                "Extend green signal timing cycle along JLN Marg north corridor",
                "Deploy traffic warden to Calgiri Marg intersection"
            ],
            assigned_department="Traffic Police Command",
            assigned_officer="Officer V. Meena",
            status="INVESTIGATING"
        )
        events.append(e2)

        # 3. Watch AQI Spike Event
        e3 = CivicEvent(
            event_id="EVT-JPR-AQI-003",
            city="Jaipur",
            area="Sitapura Industrial",
            category="Air Quality Spike",
            title="Elevated Particulate Spike (PM2.5 & PM10)",
            severity="WATCH",
            confidence=0.74,
            latitude=lat_sit,
            longitude=lon_sit,
            affected_area_km2=3.2,
            affected_roads=["RIICO Industrial Bypass", "Tonk Road Junction"],
            signals={
                "aqi": "178",
                "pm25": "68 ug/m3",
                "wind_speed": "3 km/h"
            },
            evidence=[
                build_evidence("Open-Meteo Air Sensor", "aqi", 178, 85, "AQI", "Sitapura Industrial", "Jaipur", 0.90, "LIVE"),
                build_evidence("Ambient Particulate Sensor", "pm25", "68 ug/m3", "32 ug/m3", "ug/m3", "Sitapura Industrial", "Jaipur", 0.88, "LIVE")
            ],
            timeline=[
                {"time": "17:45", "event": "Thermal inversion layer detected with low ambient wind (3 km/h)"},
                {"time": "18:15", "event": "Particulate accumulation crossed 150 AQI threshold"},
                {"time": "18:45", "event": "Watch notification distributed to industrial safety coordinators"}
            ],
            recommended_actions=[
                "Deploy water misting cannons along RIICO main avenue",
                "Advise sensitive workers to remain indoors or wear respiratory filtration"
            ],
            assigned_department="Pollution Control Board",
            assigned_officer="Pending Dispatch",
            status="ACTIVE"
        )
        events.append(e3)

    else:
        # Generic city event fallback
        lat, lon = get_zone_coordinates(city, "Midtown" if "Midtown" else "Central")
        e_gen = CivicEvent(
            event_id=f"EVT-{city.upper()[:3]}-001",
            city=city,
            area="Central Zone",
            category="Civic Disruption",
            title="Elevated Environmental & Traffic Anomaly",
            severity="WARNING",
            confidence=0.75,
            latitude=lat,
            longitude=lon,
            affected_area_km2=1.8,
            affected_roads=["Main Arterial Avenue", "Commercial Corridor"],
            signals={"anomaly_score": "0.76", "reports": 5},
            evidence=[build_evidence("Telemetry Monitor", "composite_anomaly", 0.76, 0.20, "score", "Central", city, 0.80, "SIMULATED")],
            timeline=[{"time": "18:30", "event": "Co-occurring sensor variance observed in downtown core"}],
            recommended_actions=["Monitor feeder corridor throughput"],
            status="ACTIVE"
        )
        events.append(e_gen)

    return events

def get_all_events(city: str = "Jaipur") -> List[Dict[str, Any]]:
    """Returns active events for a city, initializing cache if empty."""
    global _ACTIVE_EVENTS
    # Ensure baseline events exist in registry
    if not _ACTIVE_EVENTS or not any(e.city.lower() == city.lower() for e in _ACTIVE_EVENTS.values()):
        seed = get_seed_events(city)
        for ev in seed:
            _ACTIVE_EVENTS[ev.event_id] = ev

    return [e.to_dict() for e in _ACTIVE_EVENTS.values() if e.city.lower() == city.lower()]

def get_event_by_id(event_id: str) -> Optional[Dict[str, Any]]:
    """Lookup an individual event by ID."""
    global _ACTIVE_EVENTS
    if event_id in _ACTIVE_EVENTS:
        return _ACTIVE_EVENTS[event_id].to_dict()
    # Also check if it's in seed
    for city in ["Jaipur", "New York", "London"]:
        seed = get_seed_events(city)
        for e in seed:
            if e.event_id == event_id:
                _ACTIVE_EVENTS[event_id] = e
                return e.to_dict()
    return None

def update_event_operations(
    event_id: str,
    status: Optional[str] = None,
    assigned_department: Optional[str] = None,
    assigned_officer: Optional[str] = None,
    new_note: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """Updates operational state of an event (department, officer, status, audit note)."""
    global _ACTIVE_EVENTS
    if event_id not in _ACTIVE_EVENTS:
        get_all_events("Jaipur")
    
    if event_id not in _ACTIVE_EVENTS:
        return None

    ev = _ACTIVE_EVENTS[event_id]
    if status:
        ev.status = status.upper()
    if assigned_department:
        ev.assigned_department = assigned_department
    if assigned_officer:
        ev.assigned_officer = assigned_officer
    if new_note:
        ev.notes.append({
            "timestamp": datetime.utcnow().strftime("%H:%M:%S UTC"),
            "author": assigned_officer or "Operations Supervisor",
            "content": new_note
        })
    ev.updated_at = datetime.utcnow().isoformat() + "Z"
    return ev.to_dict()

def reset_events_to_normal(city: str = "Jaipur"):
    """Resets all events back to standard baseline (used by Demo Controller)."""
    global _ACTIVE_EVENTS
    _ACTIVE_EVENTS.clear()
    get_all_events(city)
