# User Flows
## CityPulse: Citizen 10-Second Glance, Municipal Drill-Down, and Alert Investigation

---

## 1. User Flow 1: Resident 10-Second Morning Glance

**Actor:** Maya (Resident of Zone 3)  
**Goal:** Determine if her morning commute is disrupted before leaving her apartment.

```mermaid
sequenceDiagram
    autonumber
    actor Maya as Resident
    participant UI as CityPulse Web App
    participant API as FastAPI Backend
    participant WS as WebSocket Hub

    Maya->>UI: Opens citypulse.app on smartphone
    UI->>API: GET /api/v1/zones
    API-->>UI: Returns ZoneStatus list for all 4 zones
    UI->>WS: Connects to /ws/zones
    WS-->>UI: Connection confirmed (Live heartbeat green)
    UI-->>Maya: Renders Metropolitan Pulse Map + Cards (Elapsed: 1.2s)
    
    Note over Maya,UI: Maya glances at Zone 3 (Red Badge: ALERT)<br/>Reads: "Zone 3: Possible link between severe weather alert,<br/>major transit suspensions, and multiple resident flooding reports."
    
    Maya->>UI: Taps Zone 3 Card (Elapsed: 4s)
    UI-->>Maya: Displays Diagnostics Modal with Red Line suspension notice
    
    Note over Maya,UI: Maya decides to work from home today.<br/>Total Time Elapsed: 8.5 seconds.
```

---

## 2. User Flow 2: Municipal Operator Pattern Detection

**Actor:** Marcus (City Operations Staff)  
**Goal:** Identify multi-department incidents before 311 escalation queues overflow.

```mermaid
sequenceDiagram
    autonumber
    actor Marcus as City Ops Coordinator
    participant UI as Command Center Display
    participant WS as WebSocket Stream
    participant Engine as Correlation Engine

    Note over Engine: Heavy rain hits Zone 3.<br/>Weather alert ingested.<br/>Subway underpass flooding reported.
    Engine->>Engine: Evaluates 30m window: rule_weather_x_transit fires
    Engine->>WS: Broadcasts updated ZoneStatus (ALERT)
    WS-->>UI: Pushes live payload to connected display
    
    UI-->>Marcus: Alert Banner flashes: "ALERT: High-activity anomalies in Zone 3"
    Marcus->>UI: Clicks "Investigate Zone 3"
    UI-->>Marcus: Opens timeline showing: Flash Flood (09:00), Red Line Halt (09:25), Flooding 311 (09:18)
    Marcus->>Marcus: Dispatches drainage maintenance crew directly to 5th & Main underpass before citizen calls peak.
```

---

## 3. User Flow 3: Graceful Feed Degradation Flow

**Actor:** Public Viewer  
**Scenario:** Upstream GTFS-RT Transit server goes offline.

1. **Detection:** Transit adapter encounters 3 consecutive HTTP 504 Gateway Timeouts.
2. **Health Update:** Ingestion manager flips `feed_health.transit.status = "delayed"`.
3. **Engine Evaluation:** Correlation engine ignores the stale transit stream, continuing evaluation on weather and 311 complaints.
4. **User Feedback:**
   - The dashboard remains fully operational.
   - The Feed Health widget shows an amber badge: `"Transit Alerts: Delayed"`.
   - The user is notified honestly without false alarms or crashes.
