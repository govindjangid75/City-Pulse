# Product Requirements Document (PRD)
## CityPulse: The Live Civic Health Dashboard
**Tagline:** *"One glance should tell a resident what's really happening in their neighborhood — and why it matters."*

---

## 1. Executive Summary
Modern cities suffer from fragmented information. Municipalities maintain separate apps for public transit, localized weather warnings, 311 service tickets, and utility power outages. When an urban disruption strikes—such as a flash flood shutting down an underpass and stalling a subway line—residents only find out after they are trapped in traffic or stranded at a station.

CityPulse solves this by continuously ingesting, normalizing, and fusing civic feeds into a real-time, glanceable "pulse" of each neighborhood, surfacing cross-feed correlations in plain language.

---

## 2. Product Objectives & KPIs

### 2.1 Core Objectives
1. **Unify Siloed Data:** Correlate at least three heterogeneous civic data streams into a single source of truth.
2. **10-Second Situational Awareness:** Ensure any citizen can comprehend their neighborhood's status in under 10 seconds.
3. **Epistemic Honesty:** Prevent civic panic and misinformation by strictly labeling correlations as *possible links*, never confirmed causes.
4. **Zero-Failure Resilience:** Ensure the platform degrades gracefully when upstream feeds experience downtime.

### 2.2 Success Metrics (KPIs)
- **Time-to-Comprehension:** < 10 seconds for 90% of test users.
- **Correlation Precision:** 100% adherence to deterministic rule triggers on test scenarios.
- **System Availability:** 100% availability during simulated network dropouts of individual feeds.
- **Narrative Groundedness:** 0% hallucinated facts in plain-language summaries.

---

## 3. User Personas

### Persona A: Maya Lin (Urban Commuter & Resident)
- **Profile:** 29-year-old software engineer living in Zone 3, commutes via subway and bicycle.
- **Pain Point:** Frequently finds subway lines suspended due to localized flooding only after walking 15 minutes to the turnstile.
- **Goal:** Wants a single bookmarked mobile webpage to glance at over morning coffee to know if Zone 3 has disruptions.

### Persona B: Marcus Vance (Municipal Ops Coordinator)
- **Profile:** 44-year-old city emergency operations supervisor.
- **Pain Point:** Spends critical minutes toggling between disparate portals (National Weather Service radar, transit dispatch logs, and 311 ticket queues).
- **Goal:** Needs an early-warning correlation view that flags when multiple independent feeds show anomalies in the same neighborhood block.

### Persona C: Elena Rostova (Local Business Owner)
- **Profile:** Operates a neighborhood café and bakery in Zone 2.
- **Pain Point:** Deciding whether to call in staff during severe weather advisories or localized power fluctuations.
- **Goal:** Wants reliable neighborhood-level health status to make informed commercial decisions.

---

## 4. Key Features & Prioritization (MoSCoW)

### Must Have (P0 - Hackathon Core)
- **Multi-Feed Ingestion:** Adapters for Weather, Transit Delays, and 311 Incidents.
- **Unified Civic Schema:** `CivicEvent` model with zone, UTC timestamp, source, severity, and payload.
- **Rolling-Window Correlation Engine:** 30-minute sliding window detecting co-occurrences.
- **Status Computation:** Categorization of zones into `Calm`, `Elevated`, and `Alert`.
- **Glanceable Web Dashboard:** Clean, dark-mode visual interface with zone cards and map overview.
- **Grounded Plain-Language Summaries:** Sentence generation based strictly on active events.
- **Feed Health Monitoring:** Visual indicator when an upstream feed is delayed or missing.

### Should Have (P1 - High-Value Extensions)
- **WebSocket Streaming:** Push instant updates to connected dashboards without page reloads.
- **Alert Banner:** Prominent notification across top of view when any zone enters `Alert` status.
- **Event Drill-Down Modal:** Chronological inspection of raw and normalized events per zone.

### Could Have (P2 - Stretch Innovation)
- **Historical Replay Scrubber:** Ability to scrub through past timestamps to observe anomaly formation.
- **LLM Synthesis Mode:** Grounded LLM narrative generator with prompt fencing and template fallback.
- **Statistical Z-Score Anomaly Scoring:** Rolling-window statistical variance detection.

### Won't Have (Out of Scope for 24h MVP)
- Multi-city internationalization.
- User accounts, JWT authentication, or SMS push notifications.
- Direct write-back integrations into municipal ticketing CRM systems.

---

## 5. User Journey & Core Interaction Flow

```
[Resident opens CityPulse] 
           │
           ▼
[Glances at Metropolitan Pulse Map]
           │
           ├─► Zone 1: Green (Calm) ──► "Clear conditions, on-time transit."
           ├─► Zone 2: Amber (Elevated) ──► "Light rain advisory; minor delays."
           └─► Zone 3: Red (Alert) ──► "Possible link: Flash flood alert & Red Line suspension."
           │
           ▼
[Clicks Zone 3 Card]
           │
           ▼
[Inspects Detail Modal]
 - Correlation Trigger: rule_weather_x_transit (Possible link)
 - Raw Feed Breakdown: Weather (Flood Alert), Transit (Red Line Halted), 311 (Water pooling at underpass)
 - Feed Health: Weather (OK), Transit (OK), 311 (OK)
```

---

## 6. Regulatory & Ethical Guidelines
- **Epistemic Honesty:** System never presents speculative correlation as absolute causality.
- **PII Scrubbing:** 311 reports are stripped of personal identifiers before database insertion.
- **Data Sovereignty:** Uses publicly available datasets and synthetic simulators.
