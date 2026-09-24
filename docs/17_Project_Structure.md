# Project Structure
## CityPulse: Comprehensive Directory & File Hierarchy

---

## 1. Directory Tree
Below is the complete file organization for CityPulse:

```
City-Pulse/
├── ARCHITECTURE.md                  # System architecture summary & data contracts
├── PROJECT_DOC.md                   # Full problem statement, scope, roadmap & pitch
├── README.md                        # Project quickstart and developer documentation
├── TASKS.md                         # Detailed step-by-step checklist
├── backend/                         # FastAPI application & ingestion pipelines
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # ASGI app initialization & routing
│   │   ├── config.py                # Environment settings & zone configurations
│   │   ├── database.py              # SQLite connection & table creation
│   │   ├── adapters/                # Data stream ingestion modules
│   │   │   ├── __init__.py
│   │   │   ├── base_adapter.py      # Abstract interface for all adapters
│   │   │   ├── weather_adapter.py   # Meteorological observations & warnings
│   │   │   ├── transit_adapter.py   # Metro / bus delays & suspensions
│   │   │   └── incidents_adapter.py # 311 citizen incident reports
│   │   ├── api/                     # External communication endpoints
│   │   │   ├── __init__.py
│   │   │   ├── routes.py            # REST endpoints (/zones, /events, /health)
│   │   │   └── websocket.py         # Real-time WebSocket connection manager
│   │   ├── models/                  # Pydantic data schemas
│   │   │   ├── __init__.py
│   │   │   └── events.py            # CivicEvent, ZoneStatus, CorrelationFlag
│   │   └── services/                # Business logic & intelligence engines
│   │       ├── __init__.py
│   │       ├── ingestion.py         # Poller orchestration
│   │       ├── normalization.py     # Schema alignment & timezone conversion
│   │       ├── correlation.py       # Sliding-window correlation rules
│   │       └── summary_generator.py # Plain-language narrative generator
│   ├── scripts/
│   │   ├── seed.py                  # Database seeder from sample_data/
│   │   └── simulate.py              # Stream emitter for real-time demonstrations
│   └── requirements.txt             # Python dependencies
├── frontend/                        # React + Vite client application
│   ├── index.html                   # HTML entrypoint
│   ├── package.json                 # Node.js dependencies & scripts
│   ├── vite.config.js               # Vite build & proxy configuration
│   └── src/
│       ├── main.jsx                 # React root render
│       ├── App.jsx                  # Main dashboard layout
│       ├── index.css                # Design system styling & CSS tokens
│       ├── components/              # Modular UI components
│       │   ├── Navbar.jsx           # Top branding bar with alive pulse beacon
│       │   ├── AlertBanner.jsx      # Top high-urgency alert notification
│       │   ├── ZoneMap.jsx          # Interactive spatial 4-zone pulse grid
│       │   ├── ZoneCard.jsx         # Glanceable status card per zone
│       │   ├── ZoneDetailModal.jsx  # Drilldown diagnostics & event timeline
│       │   └── FeedHealthIndicator.jsx # Ingestion latency & health monitor
│       └── services/                # Network communication
│           ├── api.js               # REST client
│           └── websocket.js         # WebSocket subscriber
├── docs/                            # In-depth architectural & planning specs
│   ├── 01_SRS.md
│   ├── 02_PRD.md
│   ├── 03_System_Architecture.md
│   ├── 04_Technical_Architecture.md
│   ├── 05_Database_Design.md
│   ├── 06_API_Specification.md
│   ├── 07_Security_Architecture.md
│   ├── 08_OCR_Architecture.md
│   ├── 09_ML_Architecture.md
│   ├── 10_Multithreading_Architecture.md
│   ├── 11_UI_UX_Specification.md
│   ├── 12_Testing_Strategy.md
│   ├── 13_Deployment_Setup.md
│   ├── 14_Configuration.md
│   ├── 15_Error_Handling.md
│   ├── 16_Logging_Strategy.md
│   ├── 17_Project_Structure.md
│   ├── 18_Database_Setup.md
│   ├── 19_User_Flows.md
│   ├── 20_Use_Cases.md
│   ├── 21_Future_Scope.md
│   ├── 22_Known_Limitations.md
│   └── 23_Market_Research_and_Differentiation.md
└── sample_data/                     # Synthetic test datasets
    ├── weather.json                 # Storm alerts across 4 zones
    ├── transit_delays.json          # Delay/outage events across metro lines
    └── incidents_311.json           # Resident complaints (flooding, power)
```

---

## 2. Component Responsibility Summary

- **`backend/app/adapters/`**: Strictly handles external network protocols and parses raw data into dictionary structures.
- **`backend/app/services/normalization.py`**: The boundary guard that enforces the `CivicEvent` contract.
- **`backend/app/services/correlation.py`**: Pure analytical engine operating over collections of `CivicEvent` objects.
- **`backend/app/api/`**: Transport adapter translating Python models to JSON/WebSocket packets.
- **`frontend/src/components/`**: Pure visual presentation layer rendering state and capturing user interactions.
