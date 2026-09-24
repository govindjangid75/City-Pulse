# Security Architecture
## CityPulse: Privacy, Data Integrity, and Threat Mitigation

---

## 1. Security Philosophy
Civic health platforms interact with public municipal data, citizen complaints, and potentially sensitive urban infrastructure telemetry. CityPulse implements a **Privacy by Design** and **Least Privilege** security model.

---

## 2. Threat Modeling & Mitigation (STRIDE)

| Threat Category | Potential Risk | CityPulse Mitigation Strategy |
|---|---|---|
| **Spoofing** | Malicious injection of fake 311 or transit incidents to cause panic. | Ingestion adapters validate cryptographic source headers (HMAC) and rate-limit untrusted inputs. Only authorized municipal feeds are processed. |
| **Tampering** | Modification of rolling-window event logs in transit. | TLS 1.3 enforced for all client-server and inter-service HTTP/WebSocket communication. Parameterized SQL queries eliminate SQL injection. |
| **Repudiation** | Dispute over origin or timing of an emergency alert. | Events are immutably logged with normalized UTC timestamps, source identifiers, and raw vendor payloads retained for auditability. |
| **Information Disclosure** | Exposure of citizen PII (phone numbers, caller names) from 311 logs. | Mandatory PII redaction pipeline in `normalization.py`. No citizen identities are ever saved to the database. |
| **Denial of Service (DoS)** | Volumetric flood on `/api/v1/zones` or WebSocket exhaustion. | Connection rate limiting (SlowAPI), WebSocket client caps per IP, and in-memory caching of computed zone status. |
| **Elevation of Privilege** | Unauthorized access to internal administrative/simulated triggers. | Public endpoints are read-only (`GET`). Admin routes (e.g., seeding, simulation controls) are bound to loopback (`127.0.0.1`) or gated by API keys. |

---

## 3. Privacy & PII Scrubbing Pipeline

When ingesting 311 citizen incident feeds, raw complaint payloads may contain sensitive personal data. The normalization layer applies regular expression and entity filters prior to database writes:

```
[Raw 311 Feed] ──► [Regex Phone & Email Scrubber] ──► [Address Generalizer] ──► [Sanitized CivicEvent]
```

- **Phone Numbers:** Redacted to `[REDACTED_PHONE]`.
- **Email Addresses:** Redacted to `[REDACTED_EMAIL]`.
- **Street Numbers:** Generalized to block level (e.g., *"452 Elm Street, Apt 4B"* becomes *"Elm Street Corridor"*).
- **Names:** Any detected caller name fields are stripped completely.

---

## 4. Epistemic Security & Anti-Panic Safeguards
A critical non-technical threat to civic dashboards is **civic misinformation and panic generation**.
- **Confidence Restriction:** CityPulse strictly forbids the system from outputting terms like "Caused By," "Directly Resulting From," or "Confirmed Fault."
- **Mandatory Disclaimers:** All correlation outputs are explicitly typed as `possible_link` with explanatory confidence tags.
- **Graceful Failure Transparency:** If transit data drops out, the UI states *"Transit feed delayed"* rather than presenting an artificially calm or artificially alarmed score.

---

## 5. Network & Transport Security
- **Strict HTTPS/WSS:** HTTP Strict Transport Security (HSTS) headers enabled.
- **CORS Restrictions:** Access restricted to explicitly registered dashboard domains in staging/production environments.
- **Content Security Policy (CSP):** Prevents cross-site scripting (XSS) by disabling unsafe inline scripts and restricting frame ancestry.
