"""
sources.py — API Router for Ingestion Source Health & Latency Transparency.
"""

from fastapi import APIRouter, Query
from backend.services.source_monitor import get_data_sources_health

router = APIRouter(prefix="/api/sources", tags=["Data Sources"])

@router.get("/health")
def get_source_health(city: str = Query("Jaipur")):
    """
    Returns live latency, status, freshness, and failure fallback modes for all data sources.
    """
    return get_data_sources_health(city=city)
