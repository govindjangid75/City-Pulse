"""
report_clustering.py — Citizen Incident Reporting & Intelligent Clustering Engine.
Accepts public 311-style incident reports, calculates geographic & temporal proximity,
detects semantic/category duplicates, and groups repetitive complaints into clustered civic events.
"""

from datetime import datetime
from typing import Dict, List, Any, Optional
import math
import uuid
from backend.services.city_profiles import get_zone_coordinates

class CitizenReport:
    def __init__(
        self,
        report_id: str,
        category: str,
        description: str,
        city: str,
        area: str,
        latitude: float,
        longitude: float,
        severity: str = "MEDIUM",
        status: str = "OPEN",
        cluster_id: Optional[str] = None,
        duplicate_count: int = 1,
        timestamp: Optional[str] = None,
        upvotes: int = 0
    ):
        self.report_id = report_id
        self.category = category
        self.description = description
        self.city = city
        self.area = area
        self.latitude = latitude
        self.longitude = longitude
        self.severity = severity
        self.status = status
        self.cluster_id = cluster_id or f"CLUS-{area.upper()[:4]}-{category.upper()[:3]}"
        self.duplicate_count = duplicate_count
        self.timestamp = timestamp or datetime.utcnow().strftime("%H:%M:%S UTC")
        self.upvotes = upvotes

    def to_dict(self) -> Dict[str, Any]:
        return {
            "report_id": self.report_id,
            "category": self.category,
            "description": self.description,
            "city": self.city,
            "area": self.area,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "severity": self.severity,
            "status": self.status,
            "cluster_id": self.cluster_id,
            "duplicate_count": self.duplicate_count,
            "timestamp": self.timestamp,
            "upvotes": self.upvotes
        }

# Global in-memory reports repository
_REPORTS_STORE: List[CitizenReport] = []

def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def init_seed_reports(city: str = "Jaipur"):
    """Populates realistic seed reports including an active cluster in Mansarovar."""
    global _REPORTS_STORE
    _REPORTS_STORE.clear()

    lat_m, lon_m = get_zone_coordinates("Jaipur", "Mansarovar")
    lat_mal, lon_mal = get_zone_coordinates("Jaipur", "Malviya Nagar")
    lat_c, lon_c = get_zone_coordinates("Jaipur", "C-Scheme")

    # Clustered Flooding Reports in Mansarovar
    for i in range(1, 18):
        offset_lat = (i % 5 - 2) * 0.002
        offset_lon = (i % 3 - 1) * 0.002
        rep = CitizenReport(
            report_id=f"REP-JPR-FLD-{i:03d}",
            category="Urban Flooding",
            description=f"Water accumulation near Shipra Path / Sector {i % 6 + 1}. Underpass impassable for two-wheelers.",
            city="Jaipur",
            area="Mansarovar",
            latitude=round(lat_m + offset_lat, 5),
            longitude=round(lon_m + offset_lon, 5),
            severity="CRITICAL" if i <= 5 else "HIGH",
            status="VERIFIED" if i <= 10 else "OPEN",
            cluster_id="CLUS-MANS-FLOOD",
            duplicate_count=17,
            timestamp=f"18:{40 - (i % 25):02d} UTC",
            upvotes=i * 3
        )
        _REPORTS_STORE.append(rep)

    # Road damage report in Malviya Nagar
    _REPORTS_STORE.append(CitizenReport(
        report_id="REP-JPR-RD-019",
        category="Road Damage",
        description="Deep crater pothole outside World Trade Park north entrance.",
        city="Jaipur",
        area="Malviya Nagar",
        latitude=lat_mal,
        longitude=lon_mal,
        severity="MEDIUM",
        status="OPEN",
        cluster_id="CLUS-MALV-ROAD",
        duplicate_count=3,
        timestamp="17:50:00 UTC",
        upvotes=8
    ))

    # Streetlight fault in C-Scheme
    _REPORTS_STORE.append(CitizenReport(
        report_id="REP-JPR-LGT-020",
        category="Streetlight",
        description="Series of 4 streetlights dark along Central Avenue.",
        city="Jaipur",
        area="C-Scheme",
        latitude=lat_c,
        longitude=lon_c,
        severity="LOW",
        status="RESOLVED",
        cluster_id="CLUS-CSCH-LGT",
        duplicate_count=1,
        timestamp="16:30:00 UTC",
        upvotes=2
    ))

def get_all_reports(city: str = "Jaipur") -> List[Dict[str, Any]]:
    global _REPORTS_STORE
    if not _REPORTS_STORE:
        init_seed_reports(city)
    return [r.to_dict() for r in _REPORTS_STORE if r.city.lower() == city.lower()]

def submit_citizen_report(
    category: str,
    description: str,
    city: str,
    area: str,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    severity: str = "MEDIUM"
) -> Dict[str, Any]:
    """
    Submits a report, checks proximity to existing reports, and clusters duplicates.
    """
    global _REPORTS_STORE
    if not _REPORTS_STORE:
        init_seed_reports(city)

    # Fallback to zone coordinates if not supplied
    if latitude is None or longitude is None:
        latitude, longitude = get_zone_coordinates(city, area)

    # Check for duplicate cluster match within 1.5 km and same category
    matched_cluster_id = None
    cluster_size = 1

    for r in _REPORTS_STORE:
        if r.city.lower() == city.lower() and r.category.lower() == category.lower():
            dist = _haversine_km(latitude, longitude, r.latitude, r.longitude)
            if dist <= 1.5:  # within 1.5 km
                matched_cluster_id = r.cluster_id
                r.duplicate_count += 1
                cluster_size = r.duplicate_count
                break

    if not matched_cluster_id:
        matched_cluster_id = f"CLUS-{area.upper()[:4]}-{category.upper()[:3]}"

    report_id = f"REP-{city.upper()[:3]}-{uuid.uuid4().hex[:6].upper()}"
    new_report = CitizenReport(
        report_id=report_id,
        category=category,
        description=description,
        city=city,
        area=area,
        latitude=latitude,
        longitude=longitude,
        severity=severity,
        status="OPEN",
        cluster_id=matched_cluster_id,
        duplicate_count=cluster_size,
        timestamp=datetime.utcnow().strftime("%H:%M:%S UTC"),
        upvotes=1
    )
    _REPORTS_STORE.insert(0, new_report)

    return {
        "status": "success",
        "report": new_report.to_dict(),
        "is_clustered": cluster_size > 1,
        "cluster_id": matched_cluster_id,
        "cluster_total_reports": cluster_size,
        "message": f"Report submitted. Grouped into civic cluster '{matched_cluster_id}' with {cluster_size} total reports." if cluster_size > 1 else "Report registered as new civic signal."
    }
