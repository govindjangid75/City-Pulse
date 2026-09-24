# Logging & Observability Strategy
## CityPulse: Structured Logging, Correlation Tracing, and Audit Trails

---

## 1. Overview
CityPulse implements **Structured JSON Logging** across all ingestion adapters, normalization routines, correlation engines, and API endpoints. This enables rapid triage during development and continuous operational monitoring in production.

---

## 2. Structured Log Format
Logs are emitted to `stdout` in JSON format with consistent context fields:

```json
{
  "timestamp": "2026-09-24T09:25:01.102Z",
  "level": "INFO",
  "logger": "citypulse.correlation",
  "event": "correlation_rule_fired",
  "rule_id": "weather_x_transit",
  "zone": "zone-3",
  "sources": ["weather", "transit"],
  "confidence": "possible_link",
  "window_minutes": 30,
  "execution_time_ms": 4.2
}
```

---

## 3. Log Levels & Hierarchy

| Log Level | Intended Usage | Examples in CityPulse |
|---|---|---|
| `DEBUG` | Granular adapter diagnostics, HTTP request payloads, raw polling cycles. | Individual adapter fetch results, SQL statement execution time. |
| `INFO` | State transitions, correlation rule triggers, client connections. | Zone status change (`calm` -> `alert`), client WebSocket connect/disconnect. |
| `WARNING` | Recoverable issues, delayed upstream feeds, degraded mode activation. | Transit API timeout (using cached state), PII filter triggered. |
| `ERROR` | Unhandled adapter exceptions, database query errors, corrupt payloads. | SQLite disk write failure, unexpected JSON syntax in seed file. |
| `CRITICAL` | Complete system failures preventing civic monitoring. | Database connection pool permanently exhausted, all adapters unreachable. |

---

## 4. Key Observable Metrics
CityPulse tracks three primary operational metrics:
1. **Ingestion Latency & Health:** Time elapsed per adapter sweep; time since last valid record per source (`feed_health`).
2. **Correlation Engine Execution Duration:** Milliseconds taken to evaluate sliding window rules for all zones (target: $< 15\text{ms}$).
3. **WebSocket Client Concurrency:** Active client count connected to `/ws/zones`.

---

## 5. Audit Logging for Municipal Trust
Because municipal decisions and emergency notifications rely on event records:
- The `events` table serves as an immutable write-only audit log.
- Raw JSON payloads from source feeds are preserved verbatim in `payload` to enable post-incident reviews by municipal staff.
