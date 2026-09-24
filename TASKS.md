# CityPulse — Task Breakdown

Checklist form, grouped by build phase. Designed to be worked through top-to-bottom in Antigravity — each task is scoped to be independently completable and verifiable.

## Phase 0 — Setup (Hour 0–2)
- [ ] Scaffold FastAPI backend project (`backend/app/main.py`, `requirements.txt`)
- [ ] Scaffold React + Vite + Tailwind frontend (`frontend/`)
- [ ] Define `CivicEvent` model (Pydantic) per `ARCHITECTURE.md` §2
- [ ] Set up SQLite DB + `events` table, indexed on `(zone, timestamp)`
- [ ] Define zone list (`zone-1` … `zone-4`) as a shared config used by both backend and simulators

## Phase 1 — Feed Simulation & Ingestion (Hour 2–6)
- [ ] Build `weather_adapter.py` — emits alert events with severity, zone, timestamp
- [ ] Build `transit_adapter.py` — emits delay/outage events with line, zone, timestamp
- [ ] Build `incidents_adapter.py` — emits 311-style complaint events with type, zone, timestamp
- [ ] Build normalization functions: `raw -> CivicEvent` for each adapter
- [ ] Wire up scheduled polling (APScheduler) at feed-appropriate cadence
- [ ] Write `scripts/seed.py` to load `sample_data/*.json` into the DB on startup
- [ ] Verify: querying `events` table shows normalized rows from all 3 sources

## Phase 2 — Correlation Engine (Hour 6–10)
- [ ] Implement rolling-window query per zone (default 30 min)
- [ ] Implement rule `weather_x_incidents`
- [ ] Implement rule `transit_x_incidents`
- [ ] Compute per-zone `status` (`calm` / `elevated` / `alert`) from active events + fired rules
- [ ] Unit test: feed a known synthetic sequence, assert the expected rule fires
- [ ] Confirm no rule or code path ever emits "confirmed"/causal language — only "possible link"

## Phase 3 — API + Real-Time Layer (Hour 10–14)
- [ ] `GET /zones` — returns all `ZoneStatus`
- [ ] `GET /zones/{id}` — returns one zone's detail
- [ ] `GET /zones/{id}/events?window=30m` — raw recent events
- [ ] `WS /ws/zones` — pushes updated status on new events
- [ ] Build summary generator (template mode first — ship this before attempting LLM mode)
- [ ] (Optional) Wire LLM-assisted summary mode with a grounding-only system prompt; add automatic fallback to template mode on failure
- [ ] Verify: hitting `/zones` after seeding shows at least one `elevated`/`alert` zone from the seeded storm scenario

## Phase 4 — Frontend Dashboard (Hour 14–19)
- [ ] `ZoneMap` component — grid or Leaflet, colored by status
- [ ] `ZoneCard` component — status badge + summary line + feed-health note
- [ ] `ZoneDetailPanel` — recent events + correlation flags, "possible link" framing visible in UI copy
- [ ] WebSocket subscription hook — live-updates zone cards without refresh
- [ ] Graceful-degradation UI state for delayed/missing feed
- [ ] Verify: killing one adapter mid-demo doesn't crash the UI, shows a "data delayed" note instead

## Phase 5 — Polish & Nice-to-Haves (Hour 19–22)
- [ ] `AlertBanner` for threshold-crossing zones
- [ ] Historical replay slider (stretch)
- [ ] ML-based anomaly scoring as an alternate/additional signal (stretch)
- [ ] Agentic background monitor that proactively raises flags (stretch)
- [ ] Accessibility pass: color choices readable for color-blind users, not color-only status signal (add icon/label too)
- [ ] Responsive layout check (demo may be on a laptop projector — verify readability)

## Phase 6 — Demo Prep (Hour 22–24)
- [ ] Confirm `sample_data/` tells a clear story (storm → transit delay → complaint spike in same zone)
- [ ] Rehearse the "10-second glance" pitch: open dashboard → point at alert zone → read summary aloud
- [ ] Record a backup demo video
- [ ] Prepare 1-slide pitch recap: problem → solution → what's live → revenue model (see `PROJECT_DOC.md` §7 and §9)
- [ ] Push final build, tag a `v1-demo` commit/release

---

**Definition of done for the MVP (must all be true before demo):**
1. Three feeds are ingesting and normalizing into one schema.
2. At least one correlation rule reliably fires on the seeded scenario.
3. The dashboard updates live and reads clearly to someone seeing it for the first time.
4. Every correlation shown says "possible link," never "cause."
5. Killing one feed doesn't break the UI.
