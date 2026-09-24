# CityPulse — The Live Civic Health Dashboard

**Track:** Industry / Open Innovation — AmiHacks
**Tagline:** *"One glance should tell a resident what's really happening in their neighborhood — and why it matters."*

---

## 1. The Problem

### Who's affected
- **Residents** of a neighborhood or city district — the people who get stuck in a flooded underpass or caught mid-commute during a transit outage they had no warning about.
- **City ops staff** — who can't spot patterns (three outages on one block, complaints clustering near a school) until someone manually escalates.
- **Local journalists & emergency responders** — who need a fast, trustworthy read on what's unfolding.
- **Small business owners** — deciding in the morning whether it's even worth opening today.

### Why it matters
The data needed to answer *"is my neighborhood okay right now?"* already exists — traffic incidents, transit delays, air quality readings, noise complaints, power outages, weather alerts. But it's scattered across a dozen disconnected feeds, apps, and portals, each built for a narrow audience, none built to be glanced at and understood in seconds.

### What exists today
- Siloed dashboards: a transit app, a weather app, a city 311 portal, a utility outage map — none of which talk to each other.
- No correlation layer: a resident has no way of knowing a "power outage" and a "traffic light down" three blocks away are related.
- Reactive, not predictive alerts.
- Interfaces built for analysts, not the general public.

### Why it's hard (the real challenge)
Civic feeds arrive at wildly different rates and formats — a weather alert every few hours, a transit delay every few minutes, a 311 complaint at any moment — with no shared schema, identifier, or timestamp convention. Fusing that mismatch into one trustworthy "pulse" is real data-normalization work, not just a shared map view. And surfacing genuine correlations — without misleading a non-technical viewer into thinking coincidence is causation — is as much a communication problem as an engineering one.

---

## 2. The Solution

### What we're building
**CityPulse** ingests 3+ live-or-simulated civic data streams, normalizes them into a single time-indexed schema, runs a lightweight anomaly/correlation detector over a rolling window, and renders the result as one glanceable live view — a map/dashboard plus a plain-language summary line ("What's happening right now, and why it matters"), grounded strictly in the ingested data.

### Core principle
**Breadth of feeds matters less than quality of fusion.** Three well-correlated feeds beat six that are never actually connected. We optimize for correctness and clarity over feed count.

### What we leave out of the hackathon MVP
- Real city API integrations (we use public/synthetic data — no proprietary access assumed or required).
- True ML models (we ship a rolling-window statistical/rule-based detector; ML upgrade path is documented but not required).
- User accounts, auth, personalization, multi-city support.
- Mobile app — web-only, responsive.
- Push notifications to real devices (in-app alert banner only, optional).

---

## 3. MVP Scope (24-Hour Build)

### Must-have (Day-of demo depends on these)
1. **Ingestion** — 3 simulated/public feeds: weather alerts, transit delays, 311-style incident reports.
2. **Normalization** — all feeds mapped into one common schema (`zone`, `timestamp`, `type`, `severity`, `payload`).
3. **Correlation/anomaly detection** — a simple rolling-window rule (e.g., complaint density rising in the same zone as an active weather alert within a time window ⇒ flag correlation).
4. **Live dashboard/map** — zones colored by "pulse" status (calm / elevated / alert), updating on a timer or via WebSocket.
5. **Plain-language summary** — one sentence per zone: "what's happening right now and why it matters," generated from the current state (template-based, or LLM-assisted but grounded strictly in ingested data — no hallucinated causes).
6. **Graceful degradation** — if one feed is missing/delayed, the system still renders with what it has and says so.

### Nice-to-have (if time remains)
7. Threshold-based alert banner ("3+ incidents in Zone 4 in the last 30 min").
8. Historical replay — step through a simulated multi-day dataset to show pattern detection working over time.
9. True ML anomaly detection (e.g., z-score or isolation forest over feed volume) instead of static rules.
10. Agentic monitoring layer — a background agent that watches feeds continuously and proactively raises flags rather than waiting for a page refresh.

### Explicit non-goals for the MVP
- No claims of causation — every correlation is labeled "possible link," never "confirmed cause" (epistemic honesty constraint from the problem statement).
- No identification of individuals from complaint/social data (privacy constraint).
- Must be understandable by a non-technical viewer in ~10 seconds — if a feature needs a legend to explain, cut or simplify it.

---

## 4. Features

| Feature | Priority | Description |
|---|---|---|
| Multi-feed ingestion | P0 | Pull/simulate weather, transit, and 311 data on independent schedules |
| Schema normalization | P0 | Common `CivicEvent` model across all feeds |
| Rolling-window correlation engine | P0 | Rule-based detector flags co-occurring anomalies per zone |
| Live map/dashboard | P0 | Zone-level color-coded pulse (calm/elevated/alert) |
| Plain-language summary generator | P0 | One-line, data-grounded explanation per zone |
| Missing-feed graceful degradation | P0 | UI shows "feed delayed/unavailable" instead of breaking |
| Alert threshold banner | P1 | Configurable trigger for a top-of-page alert |
| Historical replay mode | P1 | Scrub through past simulated data to show detection over time |
| ML-based anomaly scoring | P2 | Statistical model replacing/augmenting static rules |
| Agentic continuous monitor | P2 | Background agent proactively raising flags between refreshes |

---

## 5. Tech Stack & Architecture

### Stack
| Layer | Choice | Why |
|---|---|---|
| Backend API | **Python + FastAPI** | Fast to scaffold, async-friendly for polling multiple feeds, great for a 24h build |
| Data store | **SQLite** (upgradeable to Postgres) | Zero-ops for a hackathon, holds normalized `CivicEvent` rows |
| Feed simulation | **Python scripts / cron-style scheduler (APScheduler)** | Generates/pulls weather, transit, and 311-style events on independent intervals |
| Real-time push | **WebSockets (FastAPI native)** | Push pulse updates to the dashboard without polling |
| Correlation engine | **Pandas rolling-window logic** | Simple, explainable, fast to implement and demo |
| Summary generation | **Template engine, optionally LLM-assisted (Claude API)** | Grounded strictly in current `CivicEvent` state — prompt includes only real ingested data, never free-generates facts |
| Frontend | **React + Vite + Tailwind** | Fast iteration, clean component model for map + cards |
| Map/visualization | **Leaflet.js (or a simple zone-grid SVG if time-constrained)** | Lightweight, no API key required for a basic tile layer |
| Deployment (demo) | **Local + ngrok, or Vercel (frontend) / Render/Fly.io (backend)** | Fastest path to a shareable demo link |

### Architecture Overview

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Weather Feed    │   │  Transit Feed    │   │  311 Incident   │
│  (simulated/API) │   │  (simulated/API) │   │  Feed (simulated)│
└────────┬─────────┘   └────────┬─────────┘   └────────┬────────┘
         │                      │                       │
         └──────────────┬───────┴───────────────────────┘
                         ▼
              ┌─────────────────────┐
              │  Ingestion Layer     │  (scheduled pollers, per-feed adapters)
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │  Normalization Layer │  → common CivicEvent schema
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │  Event Store (SQLite)│
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │ Correlation Engine   │  (rolling window, per-zone rules)
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │ Summary Generator    │  (template / LLM, grounded in DB state)
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │ FastAPI + WebSocket  │  (REST for initial load, WS for live push)
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │ React Dashboard (UI) │  map + zone cards + summary + alert banner
              └─────────────────────┘
```

See `ARCHITECTURE.md` for the full data model and component breakdown.

---

## 6. Step-by-Step Build Plan (24 Hours)

### Hour 0–2: Setup & Data Model
- Scaffold FastAPI backend + React frontend (Vite).
- Define the `CivicEvent` schema (zone, timestamp, type, severity, payload, source).
- Set up SQLite with a single `events` table.

### Hour 2–6: Feed Simulation & Ingestion
- Write 3 feed simulators (weather, transit, 311) that emit realistic, randomized-but-plausible events into fixed zones, at their own cadence.
- Build the ingestion layer: scheduled pollers that call each simulator and normalize output into `CivicEvent` rows.
- Load `sample_data/` JSON as seed/backfill so the dashboard isn't empty at first boot.

### Hour 6–10: Correlation Engine
- Implement rolling-window aggregation per zone (e.g., last 30 minutes).
- Implement the first correlation rule: complaint density rising + active weather alert in the same zone ⇒ flag "possible link."
- Compute a per-zone status: `calm` / `elevated` / `alert`.

### Hour 10–14: API + Real-Time Layer
- REST endpoint: `GET /zones` — current status of all zones.
- REST endpoint: `GET /zones/{id}/events` — recent events for a zone.
- WebSocket channel: push zone-status updates as new events land.
- Summary generator: produce one grounded sentence per zone from its current event window.

### Hour 14–19: Frontend Dashboard
- Zone map/grid view, color-coded by status.
- Zone detail panel: recent events + plain-language summary + "possible link, not confirmed cause" framing.
- Live updates via WebSocket subscription.
- Graceful-degradation UI state for a missing/delayed feed.

### Hour 19–22: Polish & Nice-to-Haves
- Alert threshold banner.
- Historical replay slider (if time allows).
- Visual pass: legends, color accessibility, responsive layout.

### Hour 22–24: Demo Prep
- Seed a compelling scenario in `sample_data/` (e.g., a storm knocking out power near a transit line, spiking 311 complaints) so the correlation engine has something dramatic to show.
- Rehearse the "10-second glance" pitch: show the dashboard, point at one alert zone, read the plain-language summary aloud.
- Record a backup demo video in case of live-demo network issues.

---

## 7. Revenue Model

*(For the pitch — framed as a realistic path beyond the hackathon, not a hackathon deliverable itself.)*

### Who pays
- **City governments & municipal ops departments** — primary customer. CityPulse becomes an internal ops tool that also powers a public-facing resident view.
- **Secondary, longer-term:** local news outlets (licensed data feed for civic reporting), insurers/risk analytics firms (aggregated, anonymized incident-pattern data), and university/urban-planning research partners.

### Pricing model
- **B2G SaaS subscription**, tiered by city population / number of zones monitored:
  - *Starter* (single district / pilot): flat low monthly fee, capped feeds.
  - *City-wide*: per-zone or per-feed pricing, unlimited residents on the public view.
  - *Enterprise/regional*: multi-city rollups, custom feed integrations, SLA-backed uptime.
- **Public resident-facing view is free** — always. Free public access is the trust/adoption driver; municipalities pay for the ops tooling, historical data, and integration work behind it.

### Cost structure
- Cloud hosting/compute (ingestion, DB, WebSocket infra) — scales with number of monitored zones/feeds, not usage per resident.
- LLM API costs for summary generation — kept low by grounding prompts tightly and caching unchanged summaries.
- Integration cost per city (connecting to their real transit/311/utility APIs) — highest cost driver, amortized via the subscription tier.
- Support & reliability (civic infra has real uptime expectations once adopted for ops use).

### How it scales
- Marginal cost per additional resident viewing the public dashboard is near-zero (static/cached reads + WebSocket fan-out).
- Marginal cost per additional city is dominated by one-time integration work, which shrinks as feed adapters become reusable (a "weather adapter" or "311 adapter" built once, reused across every city that shares a data format/vendor).
- Data network effect: more cities using CityPulse improves the correlation models over time (more historical patterns to learn from), which is a defensible moat against a single-city bespoke dashboard.

---

## 8. Sample Data

Located in `sample_data/`. Each file represents one feed, pre-seeded with a scenario designed to demonstrate a real correlation: a storm event in **Zone 3** coincides with a transit disruption and a spike in 311 complaints — exactly the kind of pattern the correlation engine should catch and explain in plain language.

| File | Feed | Contents |
|---|---|---|
| `weather.json` | Weather alerts | Storm/flood alerts across 4 zones, with severity and timestamps |
| `transit_delays.json` | Transit delays | Delay/outage events per line and zone, with cause codes |
| `incidents_311.json` | 311-style complaints | Resident-reported incidents (flooding, power, noise) per zone |

All records share: `zone` (`zone-1`…`zone-4`), `timestamp` (ISO 8601), `type`, `severity` (`low`/`medium`/`high`), and a feed-specific `payload`. This is exactly the shape the normalization layer should map every feed into.

---

## 9. Pitch-Ready One-Liner

> *"CityPulse turns a dozen disconnected city data feeds into one honest, glanceable answer to 'is my neighborhood okay right now' — and tells you why, in one sentence, without pretending correlation is causation."*
