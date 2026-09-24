"""
replay.py — API Router for Historical Incident Playback Simulation.
"""

from fastapi import APIRouter
from backend.services.replay_engine import get_replay_frames

router = APIRouter(prefix="/api/replay", tags=["Historical Replay"])

@router.get("/{event_id}")
def get_event_replay(event_id: str):
    """
    Returns step-by-step forensic replay frames for interactive scrubbing.
    """
    return get_replay_frames(event_id)
