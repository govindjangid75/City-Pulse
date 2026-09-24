# Software Requirements Specification (SRS)
## CityPulse: The Live Civic Health Dashboard
**Hackathon:** AmiHacks 2026 | **Track B:** Industry / Open Innovation

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for **CityPulse**, a real-time civic health monitoring platform that ingests, normalizes, correlates, and visualizes disparate civic data streams (weather advisories, transit delays, and 311 citizen incident reports). The primary objective is to enable non-technical urban residents to understand neighborhood health in a 10-second glance while providing municipal operators with cross-feed correlation insights.

### 1.2 Scope
CityPulse addresses urban data fragmentation. It bridges the gap between siloed civic systems by:
- Ingesting three distinct data streams (weather, transit, 311 complaints) on asynchronous cadences.
- Normalizing diverse schemas into a standardized `CivicEvent` model.
- Applying a spatial-temporal rolling-window correlation engine.
- Generating plain-language, grounded status summaries.
- Displaying a glanceable, color-coded health dashboard with graceful degradation upon source outages.

### 1.3 Definitions, Acronyms, and Abbreviations
- **311:** Municipal non-emergency public service reporting system.
- **CivicEvent:** Unified normalized data structure representing any civic event.
- **ZoneStatus:** Aggregated health metric for a geographical zone (`calm`, `elevated`, `alert`).
- **Epistemic Honesty:** Design principle requiring all correlations to be framed as *possible links* rather than confirmed causal relationships.
- **Degraded Mode:** System operation state where missing feeds do not halt platform operations.

---

## 2. Overall Description

### 2.1 Product Perspective
CityPulse acts as an intelligence abstraction layer situated between raw municipal data sources and citizen/operator interfaces. It does not replace municipal transactional databases; rather, it performs real-time fusion and correlation.

```
[Weather Alerts]   [Transit Delays]   [311 Incident Reports]
       │                  │                      │
       └──────────────────┼──────────────────────┘
                          ▼
             [CityPulse Ingestion & Normalization]
                          ▼
            [SQLite / Time-Indexed Event Store]
                          ▼
               [Correlation & Summary Engine]
                          ▼
           [FastAPI REST & WebSocket Broadcast]
                          ▼
             [React Glanceable Dashboard]
```

### 2.2 User Classes and Characteristics
1. **Urban Residents (Primary):** Need rapid situational awareness before leaving home, commuting, or operating daily routines. Require zero-jargon plain language.
2. **City Operations Staff (Secondary):** Need early indicators of multi-system incidents (e.g., flooding causing transit delays and power flickers) before formal escalation.
3. **Local Journalists & Community Leads:** Seek verified event timelines and co-occurrence patterns without sensationalism.

### 2.3 Operating Environment
- **Server:** Python 3.10+, FastAPI, SQLite 3, APScheduler, Uvicorn.
- **Client:** Modern web browsers (Chromium, Firefox, Safari, Edge) on desktop and mobile viewports.
- **Communication:** HTTP/2 REST APIs and WebSocket (RFC 6455).

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### FR-01: Multi-Feed Ingestion
- FR-01.1: System shall ingest weather data (conditions, advisories, precipitation rates).
- FR-01.2: System shall ingest transit delay and line disruption feeds.
- FR-01.3: System shall ingest 311 citizen incident reports (flooding, utility, noise, roads).
- FR-01.4: Ingestion adapters shall run asynchronously on independent schedules.

#### FR-02: Normalization Layer
- FR-02.1: System shall convert all timestamps to UTC ISO 8601 strings.
- FR-02.2: System shall map raw geographic inputs to predefined zones (`zone-1` through `zone-4`).
- FR-02.3: System shall map feed-specific severity metrics to normalized levels (`low`, `medium`, `high`).
- FR-02.4: System shall preserve raw vendor payloads in a JSON field for auditability.

#### FR-03: Correlation & Anomaly Engine
- FR-03.1: System shall evaluate events within a configurable sliding window (default: 30 minutes).
- FR-03.2: Rule `weather_x_incidents`: High/medium weather event + >=2 localized 311 incidents triggers a correlation flag.
- FR-03.3: Rule `weather_x_transit`: Severe weather event + transit delay/suspension triggers a correlation flag.
- FR-03.4: Rule `transit_x_incidents`: Transit disruption + related 311 complaints in the same corridor triggers a correlation flag.
- FR-03.5: All correlation outputs shall explicitly declare confidence as `possible_link`.

#### FR-04: Grounded Plain-Language Summarizer
- FR-04.1: System shall produce a 1-sentence narrative per zone explaining current state and significance.
- FR-04.2: Summary generation must be deterministic or constrained strictly to verified database facts (zero hallucinations).

#### FR-05: Real-Time Visualization & Dashboard
- FR-05.1: Zone map/grid shall render status badges: `calm` (emerald), `elevated` (amber), `alert` (red).
- FR-05.2: UI shall update in real time via WebSocket broadcasts upon event arrival.
- FR-05.3: UI shall present a drill-down modal showing active correlations and chronological event logs.

#### FR-06: Graceful Degradation
- FR-06.1: If any single feed is delayed or unreachable, the system shall continue computing zone status using remaining feeds.
- FR-06.2: UI shall display a clear feed health badge indicating latency without breaking the user view.

### 3.2 Non-Functional Requirements

- **NFR-01: Glanceability:** A first-time user must comprehend overall city health within 10 seconds.
- **NFR-02: Latency:** REST API queries for `/zones` shall respond in under 80ms. WebSocket push latency shall remain under 150ms.
- **NFR-03: Data Privacy:** No Personally Identifiable Information (PII) such as caller phone numbers, names, or exact residential addresses shall be stored or rendered.
- **NFR-04: Reliability:** Platform shall maintain 99.9% uptime during operational demonstrations with automated SQLite reconnection.
- **NFR-05: Accessibility:** Dashboard status indicators shall not rely on color alone; each status must include distinct typography, icons, and text labels (WCAG 2.1 AA compliant).
