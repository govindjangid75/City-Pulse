# CityPulse

**The Live Civic Health Dashboard** — built for AmiHacks (Track B: Industry / Open Innovation).

> One glance should tell a resident what's really happening in their neighborhood — and why it matters.

## What it is

CityPulse ingests multiple civic data feeds (weather alerts, transit delays, 311-style incident reports), normalizes them into a single schema, detects correlations between them in real time, and renders one glanceable dashboard with a plain-language summary per zone — e.g. *"Zone 3: possible link between an active flood alert and a spike in transit delays and resident complaints."*

Full project rationale, scope, and build plan: see [`PROJECT_DOC.md`](./PROJECT_DOC.md).
System design and data model: see [`ARCHITECTURE.md`](./ARCHITECTURE.md).
Hour-by-hour build checklist: see [`TASKS.md`](./TASKS.md).

## Quick Start

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Seed sample data
```bash
python backend/scripts/seed.py --from ../sample_data
```

The dashboard will be available at `http://localhost:5173`, backed by the API at `http://localhost:8000`.

## Project Structure
```
citypulse/
├── PROJECT_DOC.md        # Full problem/solution/scope/stack/plan/revenue doc
├── ARCHITECTURE.md        # System design, data model, component breakdown
├── TASKS.md                # Step-by-step task breakdown (hackathon checklist)
├── sample_data/
│   ├── weather.json
│   ├── transit_delays.json
│   └── incidents_311.json
├── backend/                # FastAPI service (ingestion, normalization, correlation, API/WS)
└── frontend/                # React dashboard (map, zone cards, live summary)
```

## Core Constraint We Design Around

Every correlation CityPulse shows a resident is labeled a **possible link**, never a **confirmed cause**. The goal is a fast, honest read on the neighborhood — not a source of civic misinformation.

## Status

🚧 Hackathon MVP in progress — see `TASKS.md` for current build phase.
