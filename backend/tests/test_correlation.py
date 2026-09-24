"""
Unit tests for CityPulse Correlation Engine, API, and Epistemic Honesty.
"""
import pytest
import sys
import os
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.models.events import CivicEvent, FeedSourceEnum, SeverityEnum, ZoneStatusEnum
from app.services.correlation import detect_correlations, compute_zone_status
from app.services.summary_generator import generate_zone_summary

def test_weather_x_incidents_correlation_fires():
    """Verify that severe weather + 311 complaint spike fires the expected rule."""
    events = [
        CivicEvent(
            id="wx-1",
            zone="zone-3",
            timestamp="2026-09-24T09:00:00Z",
            source=FeedSourceEnum.WEATHER,
            type="flood_alert",
            severity=SeverityEnum.HIGH,
            payload={}
        ),
        CivicEvent(
            id="inc-1",
            zone="zone-3",
            timestamp="2026-09-24T09:10:00Z",
            source=FeedSourceEnum.INCIDENTS,
            type="street_flooding",
            severity=SeverityEnum.HIGH,
            payload={}
        ),
        CivicEvent(
            id="inc-2",
            zone="zone-3",
            timestamp="2026-09-24T09:18:00Z",
            source=FeedSourceEnum.INCIDENTS,
            type="street_flooding",
            severity=SeverityEnum.MEDIUM,
            payload={}
        )
    ]
    
    flags = detect_correlations(events, "zone-3", window_minutes=30)
    rule_ids = [f.rule_id for f in flags]
    
    assert "weather_x_incidents" in rule_ids
    # Epistemic honesty assertion: Confidence MUST be possible_link
    for flag in flags:
        assert flag.confidence == "possible_link"
        assert "caused" not in flag.description.lower()
        assert "confirmed" not in flag.description.lower()

def test_epistemic_honesty_in_summaries():
    """Confirm summary never emits causal or ungrounded certainty language."""
    events = [
        CivicEvent(
            id="wx-1",
            zone="zone-3",
            timestamp="2026-09-24T09:00:00Z",
            source=FeedSourceEnum.WEATHER,
            type="flood_alert",
            severity=SeverityEnum.HIGH,
            payload={}
        ),
        CivicEvent(
            id="tr-1",
            zone="zone-3",
            timestamp="2026-09-24T09:10:00Z",
            source=FeedSourceEnum.TRANSIT,
            type="service_suspended",
            severity=SeverityEnum.HIGH,
            payload={}
        )
    ]
    flags = detect_correlations(events, "zone-3", window_minutes=30)
    status = compute_zone_status(events, "zone-3", flags)
    summary = generate_zone_summary("zone-3", status, events, flags)
    
    assert "Possible link" in summary or "possible link" in summary or "Elevated" in summary or "High-priority" in summary
    assert "caused by" not in summary.lower()
    assert "definitely because" not in summary.lower()

def test_calm_zone_status():
    """Verify that an empty or benign event list results in CALM status."""
    events = [
        CivicEvent(
            id="wx-0",
            zone="zone-1",
            timestamp="2026-09-24T08:00:00Z",
            source=FeedSourceEnum.WEATHER,
            type="clear",
            severity=SeverityEnum.LOW,
            payload={}
        )
    ]
    flags = detect_correlations(events, "zone-1", window_minutes=30)
    status = compute_zone_status(events, "zone-1", flags)
    summary = generate_zone_summary("zone-1", status, events, flags)
    
    assert status == ZoneStatusEnum.CALM
    assert len(flags) == 0
    assert "calm" in summary.lower()
