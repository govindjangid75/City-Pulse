# CityPulse — Task Breakdown

Checklist form, grouped by build phase. Designed to be worked through top-to-bottom in Antigravity — each task is scoped to be independently completable and verifiable.

## Phase 0 — Setup (Hour 0–2)
- [x] Scaffold FastAPI backend project (`backend/app/main.py`, `requirements.txt`)
- [x] Scaffold React + Vite + Tailwind frontend (`frontend/`)
- [x] Define `CivicEvent` model (Pydantic) per `ARCHITECTURE.md` §2
- [x] Set up SQLite DB + `events` table, indexed on `(zone, timestamp)`
- [x] Define zone list (`zone-1` … `zone-4`) as a shared config used by both backend and simulators

## Phase 1 — Feed Simulation & Ingestion (Hour 2–6)
- [x] Build `weather_adapter.py` — emits alert events with severity, zone, timestamp
- [x] Build `transit_adapter.py` — emits delay/outage events with line, zone, timestamp
- [x] Build `incidents_adapter.py` — emits 311-style complaint events with type, zone, timestamp
- [x] Build normalization functions: `raw -> CivicEvent` for each adapter
- [x] Wire up scheduled polling (APScheduler & asyncio background worker) at feed-appropriate cadence
- [x] Write `scripts/seed.py` to load `sample_data/*.json` into the DB on startup
- [x] Verify: querying `events` table shows normalized rows from all 3 sources

## Phase 2 — Correlation Engine (Hour 6–10)
- [x] Implement rolling-window query per zone (default 30 min)
- [x] Implement rule `weather_x_incidents`
- [x] Implement rule `weather_x_transit`
- [x] Implement rule `transit_x_incidents`
- [x] Compute per-zone `status` (`calm` / `elevated` / `alert`) from active events + fired rules
- [x] Unit test: feed a known synthetic sequence, assert the expected rule fires
- [x] Confirm no rule or code path ever emits "confirmed"/causal language — only "possible link"

## Phase 3 — API + Real-Time Layer (Hour 10–14)
- [x] `GET /zones` — returns all `ZoneStatus`
- [x] `GET /zones/{id}` — returns one zone's detail
- [x] `GET /zones/{id}/events?window=30m` — raw recent events
- [x] `WS /ws/zones` — pushes updated status on new events
- [x] Build summary generator (deterministic, data-grounded plain-language synthesis)
- [x] Verify: hitting `/zones` after seeding shows `alert` zone from seeded storm scenario

## Phase 4 — Frontend Dashboard (Hour 14–19)
- [x] `ZoneMap` component — interactive spatial map with radar scanline & pulse indicators
- [x] `ZoneCard` component — status badge + summary line + feed-health note + correlation counters
- [x] `ZoneDetailModal` — recent events + correlation flags, "possible link" framing visible in UI copy
- [x] WebSocket subscription hook — live-updates zone cards without refresh
- [x] Graceful-degradation UI state for delayed/missing feed
- [x] Verify: killing one adapter mid-demo doesn't crash the UI, shows a "data delayed" note instead

## Phase 5 — Polish & Nice-to-Haves (Hour 19–22)
- [x] `AlertBanner` for threshold-crossing zones
- [x] Historical replay slider & scrubber mode (interactive scrubbing + timeline step player)
- [x] Interactive Demo & Crisis Simulation Drawer (Trigger Storm, Transit Delay, Heat Wave, Custom Events)
- [x] 1-Click Feed Degradation Testing Toggles (OK / Delay / Drop)
- [x] Epistemic Honesty Guarantee banner & color-blind accessible badge indicators
- [x] Responsive layout check across mobile, tablet, and desktop

## Phase 6 — Demo Prep (Hour 22–24)
- [x] Confirm `sample_data/` tells a clear story (storm → transit delay → complaint spike in same zone)
- [x] Rehearse the "10-second glance" pitch: open dashboard → point at alert zone → read summary aloud
- [x] Record a backup demo video / browser interaction recording
- [x] Verified full test suite (`pytest tests` -> 9 passing unit & integration tests)

---

**Definition of done for the MVP (must all be true before demo):**
1. [x] Three feeds are ingesting and normalizing into one schema.
2. [x] At least one correlation rule reliably fires on the seeded scenario.
3. [x] The dashboard updates live and reads clearly to someone seeing it for the first time.
4. [x] Every correlation shown says "possible link," never "cause."
5. [x] Killing one feed doesn't break the UI.
