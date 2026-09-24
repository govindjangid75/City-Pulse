# Technical Architecture
## CityPulse: Technology Stack, Interfaces, and Module Specifications

---

## 1. Technology Stack Specification

| Tier | Technology | Version | Rationale |
|---|---|---|---|
| **Backend Runtime** | Python | 3.10+ | Native asynchronous support (`asyncio`), robust data ecosystem, rapid iteration. |
| **Web Framework** | FastAPI | 0.110+ | High performance (Starlette), automatic OpenAPI docs, native WebSocket support, Pydantic v2 validation. |
| **ASGI Server** | Uvicorn | 0.28+ | Lightning-fast async web server using `uvloop` and `httptools`. |
| **Database** | SQLite 3 | Embedded | Zero-ops setup, high read performance via WAL mode, perfect for 24h hackathon MVP. |
| **Scheduler** | APScheduler | 3.10+ | In-process background scheduling for feed ingestion cadences. |
| **Frontend Framework**| React | 18.2+ | Declarative component model, robust hooks ecosystem (`useEffect`, `useState`). |
| **Build Tool** | Vite | 5.1+ | Instant HMR (Hot Module Replacement) and fast production bundling. |
| **Icons & Design** | Lucide React / Custom CSS | Modern | Lightweight SVGs, polished dark-mode palette, no bulky dependencies. |

---

## 2. Directory & Module Architecture

```
City-Pulse/
├── backend/
│   ├── app/
│   │   ├── adapters/          # Ingestion adapters for each feed
│   │   │   ├── base_adapter.py
│   │   │   ├── weather_adapter.py
│   │   │   ├── transit_adapter.py
│   │   │   └── incidents_adapter.py
│   │   ├── api/               # API routers and WebSocket handlers
│   │   │   ├── routes.py
│   │   │   └── websocket.py
│   │   ├── models/            # Pydantic schemas and enums
│   │   │   └── events.py
│   │   ├── services/          # Core business logic
│   │   │   ├── normalization.py
│   │   │   ├── correlation.py
│   │   │   ├── summary_generator.py
│   │   │   └── ingestion.py
│   │   ├── config.py          # Environment settings
│   │   ├── database.py        # SQLite connection and migrations
│   │   └── main.py            # FastAPI app initialization
│   ├── scripts/               # Utility scripts (seed, simulator)
│   │   ├── seed.py
│   │   └── simulate.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI widgets
│   │   │   ├── Navbar.jsx
│   │   │   ├── AlertBanner.jsx
│   │   │   ├── ZoneMap.jsx
│   │   │   ├── ZoneCard.jsx
│   │   │   ├── ZoneDetailModal.jsx
│   │   │   └── FeedHealthIndicator.jsx
│   │   ├── services/          # API & WebSocket client layers
│   │   │   ├── api.js
│   │   │   └── websocket.js
│   │   ├── App.jsx            # Main dashboard container
│   │   ├── index.css          # Design system CSS tokens
│   │   └── main.jsx           # React DOM mount point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docs/                      # Comprehensive technical documentation
├── sample_data/               # Pre-seeded test scenarios
│   ├── weather.json
│   ├── transit_delays.json
│   └── incidents_311.json
├── ARCHITECTURE.md
├── PROJECT_DOC.md
├── README.md
└── TASKS.md
```

---

## 3. Core Interface Contracts

### 3.1 Base Adapter Contract (`BaseAdapter`)
```python
class BaseAdapter(ABC):
    @abstractmethod
    async def fetch_raw_data(self) -> List[dict]:
        """Polls external HTTP API or local synthetic stream."""
        pass

    @abstractmethod
    def normalize(self, raw_record: dict) -> CivicEvent:
        """Transforms vendor-specific record into normalized CivicEvent."""
        pass

    @abstractmethod
    async def ingest(self) -> List[CivicEvent]:
        """Orchestrates fetch and normalization."""
        pass
```

### 3.2 Correlation Engine Contract
```python
def detect_correlations(
    events: List[CivicEvent], 
    zone_id: str, 
    window_minutes: int = 30
) -> List[CorrelationFlag]:
    """Evaluates multi-feed co-occurrence rules across sliding time windows."""
    pass
```

### 3.3 Summary Generator Contract
```python
def generate_zone_summary(
    zone_id: str, 
    status: ZoneStatusEnum, 
    events: List[CivicEvent], 
    flags: List[CorrelationFlag]
) -> str:
    """Generates a plain-language, data-grounded 1-sentence narrative."""
    pass
```

---

## 4. Concurrency & Async Model
- **Non-blocking Event Loop:** All I/O operations (fetching upstream feeds, database transactions, WebSocket messaging) utilize Python's `asyncio` loop.
- **Background Ingestion Scheduler:** APScheduler executes inside the ASGI process loop, dispatching adapter polling coroutines without blocking HTTP request workers.
- **Connection Isolation:** WebSocket connections are stored in memory within `ConnectionManager`. Stale or broken client connections are cleaned up automatically upon disconnect exceptions.

---

## 5. Security & Isolation Considerations
- **CORS Policy:** Configured for development flexibility, with production tightening to allow only authorized frontend origins.
- **Database Thread Safety:** SQLite configured with `check_same_thread=False` and WAL (Write-Ahead Logging) mode to allow concurrent readers alongside scheduled writer coroutines.
