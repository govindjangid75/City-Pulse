"""
Normalization Service.
Aligns timestamps to UTC ISO 8601, maps spatial points to zone identifiers,
and converts heterogeneous severity scales to low/medium/high.
"""
from datetime import datetime, timezone
from typing import Dict, Any
from ..models.events import CivicEvent, SeverityEnum

def parse_iso_utc(timestamp_str: str) -> str:
    """Ensure timestamp is strictly in UTC ISO 8601 format."""
    try:
        dt = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
        return dt.astimezone(timezone.utc).isoformat()
    except Exception:
        return datetime.now(timezone.utc).isoformat()

def map_severity(feed_severity: str) -> SeverityEnum:
    """Normalize source severity string to system standard."""
    s = str(feed_severity).lower()
    if s in ["high", "critical", "severe", "emergency", "red"]:
        return SeverityEnum.HIGH
    elif s in ["medium", "moderate", "warning", "yellow"]:
        return SeverityEnum.MEDIUM
    return SeverityEnum.LOW
