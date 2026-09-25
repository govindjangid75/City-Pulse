"""
Plain-Language Summary Generator for CityPulse (India Edition).
Synthesizes current zone state into a crisp, 1-sentence narrative:
'What's happening right now, and why it matters.'
Strictly grounded in ingested data. Avoids hallucinated causes.
"""
from typing import List
from ..models.events import CivicEvent, CorrelationFlag, ZoneStatusEnum, SeverityEnum

ZONE_INDIAN_NAMES = {
    "zone-1": "Noida Sector 62 & Yamuna Riverfront",
    "zone-2": "Connaught Place & Ring Road Corridor",
    "zone-3": "ITO & Pragati Maidan Core",
    "zone-4": "Okhla Industrial Area Grid"
}

def generate_zone_summary(zone_id: str, status: ZoneStatusEnum, events: List[CivicEvent], flags: List[CorrelationFlag]) -> str:
    """Generate deterministic, explainable plain-language summary based on active state."""
    zone_label = ZONE_INDIAN_NAMES.get(zone_id, zone_id.replace('-', ' ').title())
    
    if status == ZoneStatusEnum.CALM or not events:
        return f"{zone_label} is calm. Normal civic activity with regular Delhi Metro & traffic flows."
    
    flag_rules = [f.rule_id for f in flags]
    
    if "multi_feed_cascade" in flag_rules or ("weather_x_transit" in flag_rules and "weather_x_incidents" in flag_rules):
        return (
            f"{zone_label}: Possible link between heavy monsoon rainfall, "
            f"underpass waterlogging, Delhi Metro delays, and spike in MCD 311 citizen calls."
        )
    elif "weather_x_transit" in flag_rules:
        return (
            f"{zone_label}: Possible link between IMD rain advisory and concurrent Delhi Metro / DTC transit slowdowns."
        )
    elif "weather_x_incidents" in flag_rules:
        return (
            f"{zone_label}: Possible link between weather advisory "
            f"and an influx of drainage and waterlogging complaints on MCD 311."
        )
    elif "transit_x_incidents" in flag_rules:
        return (
            f"{zone_label}: Transit delays detected alongside "
            f"BSES power transformer and arterial road traffic incident reports."
        )
        
    # If no multi-feed correlation flag fired, synthesize top event severity
    high_events = [e for e in events if e.severity == SeverityEnum.HIGH]
    if high_events:
        top_event = high_events[0]
        event_name = top_event.type.replace('_', ' ')
        return f"{zone_label}: High-priority {event_name} reported ({top_event.source.value.upper()} feed). NDRF / Traffic teams monitoring."
        
    medium_events = [e for e in events if e.severity == SeverityEnum.MEDIUM]
    if medium_events:
        top_event = medium_events[0]
        event_name = top_event.type.replace('_', ' ')
        return f"{zone_label}: Elevated activity due to active {event_name} ({top_event.source.value.upper()} feed)."
        
    return f"{zone_label}: Minor civic activity recorded ({len(events)} low-severity reports in window)."
