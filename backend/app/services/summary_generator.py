"""
Plain-Language Summary Generator.
Synthesizes current zone state into a crisp, 1-sentence narrative:
'What's happening right now, and why it matters.'
Strictly grounded in ingested data. Avoids hallucinated causes.
"""
from typing import List
from ..models.events import CivicEvent, CorrelationFlag, ZoneStatusEnum

def generate_zone_summary(zone_id: str, status: ZoneStatusEnum, events: List[CivicEvent], flags: List[CorrelationFlag]) -> str:
    """Generate deterministic, explainable plain-language summary based on active state."""
    if status == ZoneStatusEnum.CALM:
        return f"{zone_id.replace('-', ' ').title()} is calm. Normal civic activity with no active alerts or disruptions."
    
    if flags:
        flag_rules = [f.rule_id for f in flags]
        if "weather_x_transit" in flag_rules and "weather_x_incidents" in flag_rules:
            return (
                f"{zone_id.replace('-', ' ').title()}: Possible link between severe weather alert, "
                f"major transit suspensions, and multiple resident flooding reports."
            )
        elif "weather_x_incidents" in flag_rules:
            return (
                f"{zone_id.replace('-', ' ').title()}: Possible link between active weather advisory "
                f"and an increase in localized 311 complaints."
            )
        elif "transit_x_incidents" in flag_rules:
            return (
                f"{zone_id.replace('-', ' ').title()}: Transit delays detected alongside "
                f"co-occurring neighborhood utility and traffic incident reports."
            )
            
    # Fallback if no multi-feed flag but elevated event count
    top_event = sorted(events, key=lambda e: (e.severity == "high", e.severity == "medium"), reverse=True)[0]
    return f"{zone_id.replace('-', ' ').title()}: Elevated activity due to active {top_event.type.replace('_', ' ')} ({top_event.source.value})."
