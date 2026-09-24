"""
reports.py — API Router for Citizen Grievance Reporting and Intelligent Clustering.
"""

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.services.report_clustering import get_all_reports, submit_citizen_report

router = APIRouter(prefix="/api/reports", tags=["Citizen Reports"])

class ReportCreatePayload(BaseModel):
    category: str
    description: str
    city: str = "Jaipur"
    area: str = "Mansarovar"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity: str = "MEDIUM"

@router.get("")
def list_reports(city: str = Query("Jaipur")):
    """
    Returns list of citizen reports with cluster associations and duplicate counts.
    """
    reps = get_all_reports(city)
    return {
        "city": city,
        "total_reports": len(reps),
        "reports": reps
    }

@router.post("")
def create_report(payload: ReportCreatePayload):
    """
    Submits a new citizen report, checks spatial deduplication, and groups into civic clusters.
    """
    res = submit_citizen_report(
        category=payload.category,
        description=payload.description,
        city=payload.city,
        area=payload.area,
        latitude=payload.latitude,
        longitude=payload.longitude,
        severity=payload.severity
    )
    return res
