"""
demo.py — API Router for Deterministic 16-Step Hackathon Demo Controller.
"""

from fastapi import APIRouter, Query
from pydantic import BaseModel
from backend.services.demo_scenario import set_demo_mode, is_demo_active

router = APIRouter(prefix="/api/demo", tags=["Demo Controller"])

class DemoTogglePayload(BaseModel):
    active: bool
    city: str = "Jaipur"

@router.get("/status")
def get_demo_status():
    """
    Returns whether the deterministic Flooding Crisis demo mode is currently active.
    """
    return {
        "demo_active": is_demo_active(),
        "current_scenario": "CRITICAL_URBAN_FLOODING_MANSAROVAR" if is_demo_active() else "NORMAL_BASELINE"
    }

@router.post("/toggle")
def toggle_demo_mode(payload: DemoTogglePayload):
    """
    Enables or disables the deterministic flooding scenario.
    """
    res = set_demo_mode(active=payload.active, city=payload.city)
    return res
