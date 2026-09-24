"""
intelligence.py — API Router for Grounded Situation Briefs and Cross-Signal Correlation.
"""

from fastapi import APIRouter, Query
from backend.services.ai_summary import generate_city_situation_brief
from backend.services.correlation_engine import compute_correlation_matrix

router = APIRouter(prefix="/api/intelligence", tags=["Intelligence"])

@router.get("/summary")
def get_situation_summary(city: str = Query("Jaipur")):
    """
    Returns the plain-language executive City Situation Brief grounded in live telemetry.
    """
    return generate_city_situation_brief(city=city)

@router.get("/correlations")
def get_signal_correlations(city: str = Query("Jaipur")):
    """
    Returns Pearson correlation matrix across heterogeneous civic streams with epistemic caveats.
    """
    return compute_correlation_matrix(city=city)
