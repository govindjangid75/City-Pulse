"""
Plain-Language Summary Generator for CityPulse.
Synthesizes current zone state into a crisp, 1-sentence narrative:
'What's happening right now, and why it matters.'
Strictly grounded in ingested data. Avoids hallucinated causes.
"""
from typing import List
from ..models.events import CivicEvent, CorrelationFlag, ZoneStatusEnum, SeverityEnum

def generate_zone_summary(zone_id: str, status: ZoneStatusEnum, events: List[CivicEvent], flags: List[CorrelationFlag]) -> str:
    """Generate deterministic, explainable plain-language summary based on active state."""
    zone_label = zone_id.replace('-', ' ').title()
    
    if status == ZoneStatusEnum.CALM or not events:
        return f"{zone_label} is calm. Normal civic activity with no active alerts or service disruptions."
    
    flag_rules = [f.rule_id for f in flags]
    
    if "multi_feed_cascade" in flag_rules or ("weather_x_transit" in flag_rules and "weather_x_incidents" in flag_rules):
        return (
            f"{zone_label}: Possible link between active severe weather, "
            f"transit line disruptions, and a spike in localized citizen incident reports."
        )
    elif "weather_x_transit" in flag_rules:
        return (
            f"{zone_label}: Possible link between weather advisory and concurrent transit delays."
        )
    elif "weather_x_incidents" in flag_rules:
        return (
            f"{zone_label}: Possible link between active weather advisory "
            f"and an increase in localized 311 complaints."
        )
    elif "transit_x_incidents" in flag_rules:
        return (
            f"{zone_label}: Transit delays detected alongside "
            f"co-occurring neighborhood utility and traffic incident reports."
        )
        
    # If no multi-feed correlation flag fired, synthesize top event severity
    high_events = [e for e in events if e.severity == SeverityEnum.HIGH]
    if high_events:
        top_event = high_events[0]
        event_name = top_event.type.replace('_', ' ')
        return f"{zone_label}: High-priority {event_name} reported ({top_event.source.value} feed). Monitoring situation."
        
    medium_events = [e for e in events if e.severity == SeverityEnum.MEDIUM]
    if medium_events:
        top_event = medium_events[0]
        event_name = top_event.type.replace('_', ' ')
        return f"{zone_label}: Elevated activity due to active {event_name} ({top_event.source.value} feed)."
        
    return f"{zone_label}: Minor civic activity recorded ({len(events)} low-severity reports in window)."
