# Known Limitations
## CityPulse: Technical Constraints, Boundary Conditions, and Epistemic Limits

---

## 1. Hackathon Scope Constraints

### 1.1 Synthetic & Pre-Seeded Datasets
- **Constraint:** Due to the 24-hour hackathon timeframe and rate-limited public APIs, default live operations utilize pre-seeded, high-fidelity synthetic scenario datasets in `sample_data/`.
- **Mitigation:** Ingestion adapters are architected with standardized `BaseAdapter` contracts; swapping from `sample_data` to a live REST/GTFS-RT endpoint requires updating only the `fetch_raw_data()` method without altering downstream schemas.

### 1.2 Fixed Spatial Resolution (Coarse Zones)
- **Constraint:** The current MVP partitions the metropolitan area into 4 discrete macro-zones (`zone-1` through `zone-4`).
- **Limitation:** Very localized hyper-local incidents (e.g., a broken water pipe affecting only a 20-meter stretch of a side alley) may elevate the status of an entire quadrant.
- **Future Plan:** Integration of polygon GeoJSON bounding boxes and H3 hexagonal geospatial indexing (Uber H3, Resolution 8/9).

---

## 2. Analytical & Statistical Boundaries

### 2.1 Correlation vs. Causation
- **Epistemic Limit:** Co-occurrence does not equal causation. If a flash flood and a subway halt occur in Zone 3 at 09:20 UTC, they may be physically related or entirely coincidental.
- **System Safeguard:** CityPulse explicitly disclaims causality in all outputs, mandating the copy `"possible link"` across all UI cards, API responses, and generated narratives.

### 2.2 Cold Start on New Zones
- Without historical baseline data, rolling Z-score anomaly models require an initial calibration period (minimum 24 hours of streaming events) before accurately calculating standard deviation bounds.

---

## 3. Infrastructure & Scale Limits
- **Single-Node SQLite:** While SQLite WAL mode easily handles thousands of reads per second, high-frequency concurrent writes from hundreds of asynchronous IoT devices require migration to PostgreSQL/TimescaleDB.
- **Local WebSocket Memory Footprint:** The embedded connection manager retains client WebSocket references in memory; distributed multi-server scale requires a Redis Pub/Sub adapter.
