"""
ai_analyst.py — API Router for Grounded AI City Analyst.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.ai_summary import answer_analyst_question

router = APIRouter(prefix="/api/ai", tags=["AI Analyst"])

class QuestionPayload(BaseModel):
    query: str
    city: str = "Jaipur"

@router.post("/analyze")
def ask_city_analyst(payload: QuestionPayload):
    """
    Submits a natural-language question to the CityPulse Analyst.
    Returns grounded responses backed strictly by structured evidence.
    """
    return answer_analyst_question(query=payload.query, city=payload.city)
