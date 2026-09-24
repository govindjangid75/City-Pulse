# Error Handling & Resilience
## CityPulse: Failure Modes, Graceful Degradation, and Circuit Breakers

---

## 1. Resilience Philosophy
In civic systems, **partial data is always superior to a broken interface**. If the transit authority API goes offline due to a network glitch, citizens still need access to weather warnings and 311 flood reports. CityPulse is engineered to degrade gracefully under any single or multi-source failure.

---

## 2. Failure Matrix & System Behavior

| Failure Scenario | Immediate Detection Mechanism | Fallback / System Behavior | User Interface Impact |
|---|---|---|---|
| **Transit Feed Unreachable** (HTTP 500 / Timeout) | Adapter catches `httpx.TimeoutException` or connection error after 3 retries. | Marks `feed_health.transit.status = "delayed"`. Ingestion continues for remaining feeds. Zone status computes with weather & 311. | UI displays `"Transit data delayed"` badge in feed health panel. Dashboard does not crash. |
| **Weather Feed Unavailable** | Ingestion poller logs warning; retains last known observation. | Re-uses previous hour's observation until expiration (up to 3 hours). | Feed health status switches to `"delayed"`. |
| **311 Complaint Feed Stalled** | Inactivity threshold detected (> 2x normal inter-arrival time). | Retains historical window; logs diagnostic note. | Zone status evaluates with 0 active 311 events. |
| **No Correlation Rules Fire** | Correlation engine runs over empty or non-matching event list. | Returns empty list of `CorrelationFlag` objects. Status resolves to `calm` or `elevated`. | Plain-language summary displays: *"Zone is calm. Normal civic activity with no active alerts."* |
| **LLM Generation Timeout / Failure** | Circuit breaker catches API timeout (> 400ms) or rate limit (HTTP 429). | Automatically switches to deterministic template generator in `summary_generator.py`. | User receives instant template narrative; no visual disruption. |
| **Database File Lock (SQLite)** | SQLite driver raises `OperationalError: database is locked`. | Exponential backoff retry (up to 5 attempts, jittered 50-200ms). | Transparent to end user. |
| **WebSocket Connection Drops** | Browser client catches `onclose` or `onerror` event. | Client initiates exponential reconnect (1s, 2s, 4s, up to 15s max). | Brief indicator shows reconnecting, then resumes live stream. |

---

## 3. Circuit Breaker & Retry Strategy
External HTTP requests within adapters implement standard retry policies with exponential backoff:

```python
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type((httpx.RequestError, httpx.TimeoutException))
)
async def fetch_feed_with_retry(client: httpx.AsyncClient, url: str) -> dict:
    response = await client.get(url, timeout=5.0)
    response.raise_for_status()
    return response.json()
```

---

## 4. Epistemic Guardrail Fail-Safe
To avoid publishing false alarms or misleading the public:
- If all three feeds go missing simultaneously, the zone status shifts to `unknown / offline` with an honest message: *"Insufficient data streams active to compute civic pulse."*
- The system will **never** invent synthetic events in a production mode to fill gaps.
