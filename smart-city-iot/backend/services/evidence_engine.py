"""
evidence_engine.py — Structured Provenance & Evidence Engine for CityPulse.
Ensures every AI inference, anomaly, score, and event has structured, verifiable evidence.
"""

from datetime import datetime
from typing import Dict, List, Any, Optional

class EvidenceItem:
    def __init__(
        self,
        source: str,
        metric: str,
        observed_value: Any,
        baseline_value: Any,
        unit: str,
        location: str,
        city: str,
        difference_pct: Optional[float] = None,
        confidence: float = 0.85,
        data_mode: str = "LIVE",  # LIVE, SIMULATED, CACHED
        timestamp: Optional[str] = None
    ):
        self.source = source
        self.metric = metric
        self.observed_value = observed_value
        self.baseline_value = baseline_value
        self.unit = unit
        self.location = location
        self.city = city
        self.confidence = round(confidence, 2)
        self.data_mode = data_mode
        self.timestamp = timestamp or (datetime.utcnow().strftime("%H:%M:%S") + " UTC")
        
        if difference_pct is not None:
            self.difference_pct = round(difference_pct, 1)
        elif baseline_value and isinstance(observed_value, (int, float)) and isinstance(baseline_value, (int, float)) and baseline_value != 0:
            self.difference_pct = round(((observed_value - baseline_value) / abs(baseline_value)) * 100, 1)
        else:
            self.difference_pct = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "source": self.source,
            "metric": self.metric,
            "observed_value": self.observed_value,
            "baseline_value": self.baseline_value,
            "unit": self.unit,
            "difference_pct": self.difference_pct,
            "location": self.location,
            "city": self.city,
            "confidence": self.confidence,
            "data_mode": self.data_mode,
            "timestamp": self.timestamp,
            "summary": f"{self.metric.replace('_', ' ').title()}: {self.observed_value} {self.unit} (baseline {self.baseline_value} {self.unit}, {self.difference_pct:+.1f}%)"
        }

def build_evidence(
    source: str,
    metric: str,
    observed: Any,
    baseline: Any,
    unit: str,
    location: str,
    city: str,
    confidence: float = 0.85,
    data_mode: str = "LIVE"
) -> Dict[str, Any]:
    item = EvidenceItem(
        source=source,
        metric=metric,
        observed_value=observed,
        baseline_value=baseline,
        unit=unit,
        location=location,
        city=city,
        confidence=confidence,
        data_mode=data_mode
    )
    return item.to_dict()
