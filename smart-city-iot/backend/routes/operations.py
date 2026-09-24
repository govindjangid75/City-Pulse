"""
operations.py — API Router for Official Municipal Command Center & Incident Triage.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from backend.services.event_fusion import get_all_events, update_event_operations

router = APIRouter(prefix="/api/operations", tags=["Operations Command"])

class OperationActionPayload(BaseModel):
    event_id: str
    status: Optional[str] = None
    assigned_department: Optional[str] = None
    assigned_officer: Optional[str] = None
    note: Optional[str] = None

@router.get("")
def get_operations_dashboard(city: str = Query("Jaipur")):
    """
    Returns high-level operational statistics and incident queue for city operators.
    """
    events = get_all_events(city)
    active_count = len(events)
    critical_count = sum(1 for e in events if e.get("severity") == "CRITICAL")
    warning_count = sum(1 for e in events if e.get("severity") == "WARNING")
    
    assigned_count = sum(1 for e in events if e.get("status") in ["INVESTIGATING", "DISPATCHED", "RESOLVED"] and e.get("assigned_department") != "Unassigned")
    unassigned_count = active_count - assigned_count

    return {
        "city": city,
        "kpis": {
            "active_incidents": active_count,
            "critical_events": critical_count,
            "warnings": warning_count,
            "assigned_teams": assigned_count,
            "unassigned_queue": max(0, unassigned_count),
            "resolved_today": 27,
            "avg_response_minutes": 18.2
        },
        "departments": [
            "State Disaster Response Force (SDRF)",
            "Traffic Police Command",
            "Public Health Engineering Dept (PHED)",
            "Pollution Control Board",
            "Jaipur Municipal Corporation (JMC)"
        ],
        "active_queue": events
    }

@router.post("/action")
def perform_operator_action(payload: OperationActionPayload):
    """
    Updates event operational state: assigns department, assigns officer, resolves or adds notes.
    """
    res = update_event_operations(
        event_id=payload.event_id,
        status=payload.status,
        assigned_department=payload.assigned_department,
        assigned_officer=payload.assigned_officer,
        new_note=payload.note
    )
    if not res:
        raise HTTPException(status_code=404, detail=f"Event {payload.event_id} not found in active registry.")
    return {
        "status": "success",
        "message": f"Operational status updated for {payload.event_id}.",
        "event": res
    }
