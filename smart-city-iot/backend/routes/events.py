"""
events.py — API Router for Normalized Civic Events & Intelligence Dossiers.
"""

from fastapi import APIRouter, HTTPException, Query
from backend.services.event_fusion import get_all_events, get_event_by_id

router = APIRouter(prefix="/api/events", tags=["Civic Events"])

@router.get("")
def list_events(city: str = Query("Jaipur")):
    """
    Returns all active and emerging civic events for a city with full evidence metadata.
    """
    return {
        "city": city,
        "count": len(get_all_events(city)),
        "events": get_all_events(city)
    }

@router.get("/{event_id}")
def get_event_detail(event_id: str):
    """
    Returns complete intelligence dossier for a specific civic event.
    """
    ev = get_event_by_id(event_id)
    if not ev:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found.")
    return ev
