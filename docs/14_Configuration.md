# Configuration Specification
## CityPulse: Environment Variables, Feature Flags, and System Parameters

---

## 1. Overview
CityPulse adheres to the **Twelve-Factor App** methodology for configuration. Configuration values are loaded from environment variables or a `.env` file via Pydantic's `BaseSettings` class in `backend/app/config.py`.

---

## 2. Environment Variables Reference

| Variable Name | Type | Default Value | Description |
|---|---|---|---|
| `PROJECT_NAME` | string | `CityPulse` | Display name of the application |
| `ENVIRONMENT` | string | `development` | Deployment tier: `development`, `staging`, `production` |
| `API_V1_STR` | string | `/api/v1` | URL prefix for REST API endpoints |
| `DATABASE_URL` | string | `sqlite:///./citypulse.db` | Connection string for SQLite or PostgreSQL database |
| `ACTIVE_ZONES` | list[str] | `["zone-1","zone-2","zone-3","zone-4"]` | List of monitored metropolitan zones |
| `ROLLING_WINDOW_MINUTES`| int | `30` | Sliding window duration for correlation evaluation |
| `CORRELATION_THRESHOLD_COUNT` | int | `3` | Minimum events required to trigger incident correlation |
| `POLL_WEATHER_SECONDS` | int | `3600` | Ingestion poller interval for weather feeds |
| `POLL_TRANSIT_SECONDS` | int | `180` | Ingestion poller interval for transit delay feeds |
| `POLL_311_SECONDS` | int | `60` | Ingestion poller interval for 311 incident feeds |
| `USE_LLM_SUMMARY` | bool | `False` | Feature flag to enable LLM-assisted narrative generation |
| `LLM_API_KEY` | string | `""` | API key for external LLM provider (Claude / OpenAI) |
| `CORS_ORIGINS` | list[str] | `["*"]` | Allowed origins for cross-origin requests |

---

## 3. Sample `.env` File
```ini
# Environment
ENVIRONMENT=development
PROJECT_NAME="CityPulse"

# Database
DATABASE_URL="sqlite:///./citypulse.db"

# Sliding Window & Correlation Tuning
ROLLING_WINDOW_MINUTES=30
CORRELATION_THRESHOLD_COUNT=2

# Polling Schedules (in seconds)
POLL_WEATHER_SECONDS=3600
POLL_TRANSIT_SECONDS=180
POLL_311_SECONDS=60

# LLM Feature Flag
USE_LLM_SUMMARY=false
LLM_API_KEY=""

# Security
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
```

---

## 4. Zone Mapping Configuration
Zones represent the discrete spatial units over which CityPulse computes civic health. In `backend/app/config.py`, zones can be customized or bound to specific municipal GIS shapefiles or bounding boxes:

```python
ZONE_DEFINITIONS = {
    "zone-1": {"name": "North District", "neighborhoods": ["Uptown", "Highland Park"]},
    "zone-2": {"name": "East Corridor", "neighborhoods": ["Riverfront", "Tech Quarter"]},
    "zone-3": {"name": "Metro Core & Station", "neighborhoods": ["Downtown", "5th & Main"]},
    "zone-4": {"name": "South Valley", "neighborhoods": ["Suburbs", "Industrial Park"]}
}
```
