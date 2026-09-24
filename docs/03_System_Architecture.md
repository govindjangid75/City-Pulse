# System Architecture
## CityPulse: The Live Civic Health Dashboard

---

## 1. Architectural Philosophy
CityPulse follows an **Event-Driven Micro-Pipelines** architecture. It prioritizes:
1. **Decoupled Ingestion:** Adapters run on their own schedules and contracts without impacting core storage.
2. **Schema Invariance:** All downstream correlation, summarization, and presentation modules depend exclusively on the normalized `CivicEvent` schema.
3. **Resilient Reactive Streaming:** Real-time push via WebSockets ensures immediate dashboard updates without taxing the database with continuous polling.

---

## 2. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph DataSources["Heterogeneous Civic Feeds"]
        W[Weather Feed<br/>REST API / Simulator]
        T[Transit Disruption Feed<br/>GTFS-RT / Simulator]
        C[311 Incident Feed<br/>Civic CRM / Simulator]
    end

    subgraph IngestionLayer["Ingestion & Normalization Layer"]
        WA[Weather Adapter<br/>Cadence: Hourly]
        TA[Transit Adapter<br/>Cadence: 3-5 min]
        CA[311 Adapter<br/>Cadence: Event-Driven]
        NORM[Normalization Service<br/>Timezone UTC + Spatial Zone Mapping + Severity Scale]
    end

    subgraph StorageLayer["Data Storage Layer"]
        DB[(SQLite / Postgres<br/>events table<br/>Indexed on zone, timestamp)]
    end

    subgraph EngineLayer["Intelligence & Correlation Layer"]
        CORR[Correlation Engine<br/>30-Min Sliding Window Rules]
        SUMM[Summary Generator<br/>Deterministic Template / Grounded LLM]
    end

    subgraph APILayer["FastAPI Serving Layer"]
        REST[REST API Endpoints<br/>/zones, /zones/{id}, /health]
        WS[WebSocket Manager<br/>/ws/zones Pub/Sub]
    end

    subgraph PresentationLayer["Frontend Application (React + Vite)"]
        UI_MAP[Metropolitan Pulse Map]
        UI_CARDS[Glanceable Zone Cards]
        UI_MODAL[Detailed Diagnostics Modal]
        UI_HEALTH[Feed Health Latency Monitor]
    end

    W --> WA
    T --> TA
    C --> CA

    WA --> NORM
    TA --> NORM
    CA --> NORM

    NORM --> DB
    DB --> CORR
    CORR --> SUMM
    CORR --> REST
    SUMM --> REST
    CORR --> WS

    REST --> PresentationLayer
    WS --> PresentationLayer
```

---

## 3. Component Breakdown

### 3.1 Ingestion & Normalization Layer
- **Adapters (`backend/app/adapters/`):** Autonomous python classes inheriting from `BaseAdapter`. Each handles protocol-specific handshakes, error retries, and rate limits.
- **Normalization Service (`backend/app/services/normalization.py`):**
  - Converts diverse time formats to ISO 8601 UTC.
  - Translates latitude/longitude coordinates or street addresses into discrete operational zones (`zone-1` through `zone-4`).
  - Standardizes disparate vendor severities (e.g., `Warning`, `Advisory`, `Critical`, `High`) into standard `SeverityEnum` (`low`, `medium`, `high`).

### 3.2 Storage Layer
- **Event Store (`backend/app/database.py`):**
  - Relational table `events` storing UUID, zone, UTC timestamp, source, type, severity, and payload.
  - Composite B-Tree index on `(zone, timestamp DESC)` enabling sub-millisecond sliding window range queries.

### 3.3 Correlation & Intelligence Layer
- **Correlation Engine (`backend/app/services/correlation.py`):**
  - Queries events within `NOW() - 30 minutes` per zone.
  - Applies deterministic cross-domain rules:
    - `weather_x_incidents`: Weather severity >= medium + >=2 311 complaints.
    - `weather_x_transit`: Severe weather + transit delay/halt.
    - `transit_x_incidents`: Transit disruption + utility/flooding complaints.
  - Outputs `CorrelationFlag` entities marked with `possible_link`.
- **Summary Generator (`backend/app/services/summary_generator.py`):**
  - Consumes computed status, active flags, and top events.
  - Produces a coherent, human-readable 1-sentence narrative.

### 3.4 API & Real-Time Broadcast Layer
- **FastAPI Core (`backend/app/main.py`):**
  - Asynchronous non-blocking request handlers.
  - Native WebSocket connection manager broadcasting updates to all connected browser sessions upon new event ingestion.

### 3.5 Client Presentation Layer
- **React Frontend (`frontend/src/`):**
  - Single-page application configured with clean CSS tokens and responsive layout.
  - State management handles both initial REST snapshot and subsequent WebSocket delta updates.

---

## 4. Data Flow Pipeline

```
1. Ingestion Poller fires (APScheduler / Event Hook)
2. Raw record fetched from source
3. Normalization maps raw payload to CivicEvent
4. CivicEvent persisted to SQLite events table
5. Correlation Engine evaluates sliding window for affected zone
6. Summary Generator creates updated plain-language narrative
7. Updated ZoneStatus pushed to active WebSocket clients
8. Connected browser dashboards re-render zone pulse in real-time
```

---

## 5. Architectural Quality Attributes
- **Maintainability:** Adding a new civic feed requires only creating one new adapter file adhering to `BaseAdapter`.
- **Observability:** Health check endpoints expose per-feed latency, event throughput, and last-seen timestamps.
- **Scalability:** The SQLite backend can be seamlessly upgraded to PostgreSQL with TimescaleDB without altering domain models or route handlers.
