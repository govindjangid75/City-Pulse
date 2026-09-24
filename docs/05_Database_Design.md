# Database Design
## CityPulse: Schema, Indexing, and Time-Series Query Optimization

---

## 1. Storage Strategy
CityPulse stores normalized civic events in a time-indexed relational database. For the hackathon MVP, SQLite 3 is utilized with Write-Ahead Logging (WAL) enabled. The schema is designed for 100% compatibility with PostgreSQL / TimescaleDB for enterprise production deployment.

---

## 2. Relational Schema Specification

### 2.1 Table: `events`
Stores normalized `CivicEvent` records ingested across all data streams.

```sql
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,               -- UUID or source-prefixed unique ID (e.g. wx-0001)
    zone TEXT NOT NULL,                -- Spatial zone identifier (e.g. zone-1, zone-2)
    timestamp TEXT NOT NULL,           -- ISO 8601 UTC timestamp (e.g. 2026-09-24T09:00:00Z)
    source TEXT NOT NULL,              -- Feed source ('weather', 'transit', '311')
    type TEXT NOT NULL,                -- Granular event type (e.g. 'flood_alert', 'delay')
    severity TEXT NOT NULL,            -- Normalized severity ('low', 'medium', 'high')
    payload TEXT NOT NULL              -- JSON serialized raw vendor attributes
);
```

### 2.2 Column Data Dictionary

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Unique identifier per event |
| `zone` | TEXT | NOT NULL | Geographic zone identifier |
| `timestamp` | TEXT | NOT NULL | UTC time of occurrence formatted as ISO 8601 |
| `source` | TEXT | NOT NULL | Data source enum: `weather`, `transit`, `311` |
| `type` | TEXT | NOT NULL | Specific event categorization string |
| `severity` | TEXT | NOT NULL | Normalized triage level: `low`, `medium`, `high` |
| `payload` | TEXT | NOT NULL | JSON payload preserving vendor-specific attributes |

---

## 3. Indexing Strategy

Temporal and spatial queries form the core workload of CityPulse. The correlation engine continuously evaluates sliding time windows (e.g., last 30 minutes) restricted to specific zones.

```sql
-- Composite index for fast rolling-window queries per zone
CREATE INDEX IF NOT EXISTS idx_events_zone_timestamp 
ON events (zone, timestamp DESC);

-- Index for source-based diagnostics and feed health checks
CREATE INDEX IF NOT EXISTS idx_events_source_timestamp 
ON events (source, timestamp DESC);
```

### Index Performance Analysis:
- Without Index: Full table scan of all events — $O(N)$ query complexity.
- With Composite Index `(zone, timestamp DESC)`: B-Tree index seek on `zone` followed by a range scan on `timestamp` — $O(\log N + K)$ query complexity where $K$ is the number of events in the rolling window.

---

## 4. Query Patterns

### 4.1 Rolling-Window Retrieval per Zone
```sql
SELECT id, zone, timestamp, source, type, severity, payload
FROM events
WHERE zone = :zone_id
  AND timestamp >= datetime('now', '-30 minutes')
ORDER BY timestamp DESC;
```

### 4.2 Multi-Feed Correlation Aggregation
```sql
SELECT 
    source, 
    severity, 
    COUNT(*) as count
FROM events
WHERE zone = :zone_id
  AND timestamp >= datetime('now', '-30 minutes')
GROUP BY source, severity;
```

### 4.3 Feed Health / Last-Seen Query
```sql
SELECT 
    source, 
    MAX(timestamp) as last_seen, 
    COUNT(*) as event_count_24h
FROM events
WHERE timestamp >= datetime('now', '-24 hours')
GROUP BY source;
```

---

## 5. Production Upgrade Path (PostgreSQL + TimescaleDB)
For production deployments handling millions of civic IoT events daily:
1. Replace SQLite with PostgreSQL 16+.
2. Enable the TimescaleDB extension:
   ```sql
   SELECT create_hypertable('events', 'timestamp');
   ```
3. Implement automated retention policies:
   ```sql
   SELECT add_retention_policy('events', INTERVAL '90 days');
   ```
4. Utilize continuous aggregates for real-time statistical anomaly calculation.
