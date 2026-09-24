"""
Data models for CityPulse.
Implements CivicEvent, ZoneStatus, and CorrelationFlag models.
"""
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class SeverityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class ZoneStatusEnum(str, Enum):
    CALM = "calm"
    ELEVATED = "elevated"
    ALERT = "alert"

class FeedSourceEnum(str, Enum):
    WEATHER = "weather"
    TRANSIT = "transit"
    INCIDENTS = "311"

class FeedHealthEnum(str, Enum):
    OK = "ok"
    DELAYED = "delayed"
    MISSING = "missing"

class CivicEvent(BaseModel):
    """Normalized schema across all ingested civic feeds."""
    id: str = Field(..., description="Unique event identifier")
    zone: str = Field(..., description="Spatial unit (e.g., zone-1, zone-2)")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp")
    source: FeedSourceEnum = Field(..., description="Source feed identifier")
    type: str = Field(..., description="Specific event type (e.g. flood_alert, delay)")
    severity: SeverityEnum = Field(..., description="Normalized severity level")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Raw source fields")

class CorrelationFlag(BaseModel):
    """Represents an active co-occurrence or anomaly pattern between feeds."""
    rule_id: str = Field(..., description="Identifier of the rule that fired")
    sources_involved: List[str] = Field(..., description="Sources contributing to this correlation")
    confidence: str = Field(default="possible_link", description="Epistemic honesty: always 'possible_link' in MVP")
    window_minutes: int = Field(default=30, description="Rolling time evaluation window in minutes")
    description: str = Field(..., description="Explainable description of the correlation")

class FeedHealthStatus(BaseModel):
    """Health indicator for an individual data source."""
    status: FeedHealthEnum = FeedHealthEnum.OK
    last_seen: Optional[str] = None
    event_count_24h: int = 0

class ZoneStatus(BaseModel):
    """Glanceable computed health pulse for a specific zone."""
    zone: str
    status: ZoneStatusEnum
    active_event_count: int
    correlations: List[CorrelationFlag] = []
    summary: str
    feed_health: Dict[str, FeedHealthStatus] = {}
