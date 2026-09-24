# Use Cases
## CityPulse: Core Scenarios & Multi-Feed Correlation Analysis

---

## 1. Use Case 1: The Underpass Flash Flood Cascade (Zone 3 Scenario)

### Context & Narrative
A sudden torrential rainstorm drops 31mm/hr over the central transit district (Zone 3). A major road and subway underpass at 5th & Main begins flooding.

### Feed Ingestion Timeline
1. **08:30 UTC (Weather):** Flood watch issued for Zone 3 (`severity: medium`).
2. **09:00 UTC (Weather):** Upgraded to Flash flood alert (`severity: high`, affected area: 5th & Main underpass).
3. **09:05 UTC (Transit):** Red Line reports track section flooding (`delay: 12 min`, `severity: medium`).
4. **09:10 UTC (311 Incident):** Resident reports water pooling at 5th & Main underpass (`severity: medium`).
5. **09:18 UTC (311 Incident):** Resident reports underpass impassable, car stalled (`severity: high`).
6. **09:22 UTC (311 Incident):** Resident reports power flickering near Main St station (`severity: medium`).
7. **09:25 UTC (Transit):** Red Line service suspended, bus bridge requested (`severity: high`).

### CityPulse System Response
- **Window Evaluation (09:00 - 09:30):**
  - Weather: 1 high severity alert.
  - Transit: 1 high severity suspension + 1 medium delay.
  - 311 Complaints: 4 reports (flooding, power flickering, transit).
- **Correlation Fired:**
  - `rule_weather_x_transit`: Severe weather co-occurring with transit line suspension.
  - `rule_weather_x_incidents`: Severe weather co-occurring with flooding complaints spike.
- **Computed Status:** `ALERT` (Red).
- **Generated Narrative:**
  > *"Zone 3: Possible link between severe weather alert, major transit suspensions, and multiple resident flooding reports."*
- **Outcome:** Non-technical resident glances at phone, immediately understands the situation, avoids the station, and avoids getting trapped in the flooded underpass.

---

## 2. Use Case 2: Wind Advisory & Localized Downed Power Line (Zone 4)

### Context & Narrative
Zone 4 experiences high gusty winds (42 kph). A tree branch falls on a local power feeder line.

### Feed Ingestion Timeline
1. **09:05 UTC (Weather):** Wind advisory issued for Zone 4 (`severity: low`).
2. **09:10 UTC (Transit):** Yellow Line minor delay due to speed restrictions (`delay: 3 min`, `severity: low`).

### CityPulse System Response
- **Window Evaluation:** Low severity wind advisory + minor transit delay.
- **Correlation Fired:** None (thresholds not crossed).
- **Computed Status:** `CALM` / `ELEVATED` (Normal urban baseline).
- **Generated Narrative:**
  > *"Zone 4 is calm. Normal civic activity with minor wind advisory."*
- **Outcome:** Avoids false panic; residents are not alarmed unnecessarily.

---

## 3. Use Case 3: False Alarm / Uncorrelated Coincidence Prevention

### Context & Narrative
In Zone 1, a construction crew creates excessive noise at 08:20 UTC. A subway train experiences a scheduled maintenance check at 08:10 UTC.

### CityPulse System Response
- Even though both feeds registered an event, the correlation engine recognizes that a noise complaint and routine subway maintenance share no causal or logical link.
- **Computed Status:** `CALM` (Green).
- **Outcome:** Epistemic honesty upheld; no false correlations are manufactured.
