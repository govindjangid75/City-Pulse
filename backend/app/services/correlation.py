"""
Correlation Engine for CityPulse.
Evaluates multi-feed co-occurrence rules across sliding time windows per zone.
CRITICAL CONSTRAINT: Always frames findings as 'possible_link', never 'confirmed cause'.
"""
from typing import List
from ..models.events import CivicEvent, CorrelationFlag, ZoneStatusEnum, FeedSourceEnum, SeverityEnum

def detect_correlations(events: List[CivicEvent], zone_id: str, window_minutes: int = 30) -> List[CorrelationFlag]:
    """Detect spatial and temporal multi-feed correlations within rolling window."""
    flags: List[CorrelationFlag] = []
    
    weather_events = [e for e in events if e.source == FeedSourceEnum.WEATHER]
    transit_events = [e for e in events if e.source == FeedSourceEnum.TRANSIT]
    incident_events = [e for e in events if e.source == FeedSourceEnum.INCIDENTS]
    
    has_severe_weather = any(e.severity in [SeverityEnum.MEDIUM, SeverityEnum.HIGH] for e in weather_events)
    has_transit_disruption = any(e.severity in [SeverityEnum.MEDIUM, SeverityEnum.HIGH] for e in transit_events)
    high_complaint_volume = len(incident_events) >= 2
    
    # Rule 1: Weather alert + 311 complaint spike
    if has_severe_weather and high_complaint_volume:
        flags.append(CorrelationFlag(
            rule_id="weather_x_incidents",
            sources_involved=["weather", "311"],
            confidence="possible_link",
            window_minutes=window_minutes,
            description="Active severe weather alert coincides with a spike in 311 citizen incident reports."
        ))
        
    # Rule 2: Transit disruption + Weather event
    if has_severe_weather and has_transit_disruption:
        flags.append(CorrelationFlag(
            rule_id="weather_x_transit",
            sources_involved=["weather", "transit"],
            confidence="possible_link",
            window_minutes=window_minutes,
            description="Severe weather alert coincides with transit delays and line disruptions."
        ))

    # Rule 3: Transit delay + 311 utility/flooding complaints
    if has_transit_disruption and high_complaint_volume:
        flags.append(CorrelationFlag(
            rule_id="transit_x_incidents",
            sources_involved=["transit", "311"],
            confidence="possible_link",
            window_minutes=window_minutes,
            description="Transit disruption coincides with clustering 311 complaints in the same corridor."
        ))
        
    # Rule 4: Cascading infrastructure risk across all 3 feeds
    if has_severe_weather and has_transit_disruption and high_complaint_volume:
        flags.append(CorrelationFlag(
            rule_id="multi_feed_cascade",
            sources_involved=["weather", "transit", "311"],
            confidence="possible_link",
            window_minutes=window_minutes,
            description="Compound civic pressure detected: concurrent meteorological alerts, transit suspensions, and rising citizen complaints."
        ))
        
    return flags

def compute_zone_status(events: List[CivicEvent], zone_id: str, flags: List[CorrelationFlag]) -> ZoneStatusEnum:
    """Determine zone health pulse (calm, elevated, alert)."""
    if len(flags) >= 2 or any(e.severity == SeverityEnum.HIGH for e in events):
        return ZoneStatusEnum.ALERT
    elif len(flags) >= 1 or len(events) >= 3 or any(e.severity == SeverityEnum.MEDIUM for e in events):
        return ZoneStatusEnum.ELEVATED
    return ZoneStatusEnum.CALM
