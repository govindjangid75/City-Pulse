# Testing Strategy
## CityPulse: Unit, Integration, Synthetic Scenario, and Degraded-Mode Test Suites

---

## 1. Testing Philosophy
In a civic health platform, software failures can misinform the public or mask critical infrastructure emergencies. Testing prioritizes:
1. **Normalization Correctness:** Ensuring heterogeneous raw timestamps, coordinates, and severity scales map accurately to `CivicEvent`.
2. **Correlation Determinism:** Verifying that known multi-feed patterns (e.g. storm + subway halt + flooded road complaints) trigger the expected correlation flags.
3. **Epistemic Honesty Verification:** Asserting that no rule or narrative output contains causal words (e.g., "caused", "resulted in").
4. **Resilience & Degraded Mode Testing:** Verifying that cutting off any single data source does not crash the API or frontend.

---

## 2. Testing Levels & Matrix

| Level | Scope | Tools | Execution Cadence |
|---|---|---|---|
| **Unit Testing** | Individual adapters, normalization functions, and correlation rules. | `pytest`, `pytest-asyncio` | Pre-commit / CI on every push |
| **Integration Testing** | SQLite database operations, FastAPI endpoints, WebSocket message broadcast. | `pytest`, `httpx.AsyncClient` | CI on PR merge |
| **Scenario Testing** | End-to-end replay of synthetic storm/disruption scenarios from `sample_data/`. | Automated Python test runner | Nightly & Demo dry-run |
| **UI Component Testing**| React component rendering, status badge color mapping, modal opening. | Vitest / Jest / RTL | Frontend build pipeline |

---

## 3. Key Test Cases

### 3.1 Unit Tests (`backend/tests/test_normalization.py`)
- `test_timestamp_utc_conversion()`: Verifies that localized strings (e.g. `2026-09-24T05:00:00-04:00`) normalize to ISO UTC format.
- `test_severity_mapping()`: Asserts that vendor strings (`Advisory`, `Critical`, `Red`) map to `low`, `medium`, and `high` respectively.
- `test_pii_redaction()`: Ensures phone numbers and personal emails in 311 payloads are replaced with redaction tokens.

### 3.2 Correlation Engine Tests (`backend/tests/test_correlation.py`)
- `test_weather_x_incidents_rule_triggers()`:
  - Input: 1 high severity weather alert + 3 flood complaints in Zone 3 within 20 minutes.
  - Expected: Flag `weather_x_incidents` is emitted with confidence `possible_link`.
- `test_no_false_positive_when_calm()`:
  - Input: Low severity weather alert + 0 transit delays + 1 minor noise complaint.
  - Expected: Zone status is `calm`, zero correlation flags generated.
- `test_epistemic_honesty_text_assertion()`:
  - Inspects all generated summaries and flag descriptions for forbidden words: `caused by`, `due to the fault of`, `directly resulting from`. Fails if any forbidden phrase is found.

### 3.3 Degraded Mode Tests (`backend/tests/test_degraded_mode.py`)
- `test_transit_feed_outage_resilience()`:
  - Setup: Simulate transit adapter throwing `TimeoutException`.
  - Expected: `feed_health.transit.status == "delayed"`, API returns HTTP 200, Zone status computes normally based on weather and 311 data.

---

## 4. Test Execution Command Guide
```bash
# Run full backend test suite
cd backend
pytest -v

# Run with coverage report
pytest --cov=app tests/

# Execute scenario replay verification
python scripts/seed.py --from-dir sample_data
curl http://localhost:8000/api/v1/zones/zone-3
```
