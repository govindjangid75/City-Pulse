# API Specification
## CityPulse: RESTful Endpoints and WebSocket Real-Time Protocols

**Base URL:** `http://localhost:8000/api/v1`  
**WebSocket URL:** `ws://localhost:8000/ws/zones`  
**Protocol:** HTTP/1.1 & HTTP/2, WebSocket (RFC 6455)  
**Content-Type:** `application/json`

---

## 1. REST Endpoints

### 1.1 `GET /zones`
Returns the real-time computed pulse for all active city zones.

**Response Status:** `200 OK`  
**Response Body:**
```json
[
  {
    "zone": "zone-1",
    "status": "calm",
    "active_event_count": 2,
    "correlations": [],
    "summary": "Zone 1 is calm. Normal civic activity with no active alerts or disruptions.",
    "feed_health": {
      "weather": { "status": "ok", "last_seen": "2026-09-24T09:00:00Z", "event_count_24h": 12 },
      "transit": { "status": "ok", "last_seen": "2026-09-24T09:10:00Z", "event_count_24h": 48 },
      "311": { "status": "ok", "last_seen": "2026-09-24T08:50:00Z", "event_count_24h": 15 }
    }
  },
  {
    "zone": "zone-3",
    "status": "alert",
    "active_event_count": 6,
    "correlations": [
      {
        "rule_id": "weather_x_transit",
        "sources_involved": ["weather", "transit"],
        "confidence": "possible_link",
        "window_minutes": 30,
        "description": "Severe weather alert coincides with transit delays and line disruptions."
      },
      {
        "rule_id": "weather_x_incidents",
        "sources_involved": ["weather", "311"],
        "confidence": "possible_link",
        "window_minutes": 30,
        "description": "Active severe weather alert coincides with a spike in 311 citizen incident reports."
      }
    ],
    "summary": "Zone 3: Possible link between severe weather alert, major transit suspensions, and multiple resident flooding reports.",
    "feed_health": {
      "weather": { "status": "ok", "last_seen": "2026-09-24T09:20:00Z", "event_count_24h": 14 },
      "transit": { "status": "ok", "last_seen": "2026-09-24T09:25:00Z", "event_count_24h": 50 },
      "311": { "status": "ok", "last_seen": "2026-09-24T09:30:00Z", "event_count_24h": 19 }
    }
  }
]
```

---

### 1.2 `GET /zones/{zone_id}`
Returns granular telemetry and active correlations for a single zone.

**Parameters:**
- `zone_id` (path, required, string): e.g. `zone-3`

**Response Status:** `200 OK`  
**Error Statuses:** `404 Not Found` if zone does not exist.

---

### 1.3 `GET /zones/{zone_id}/events`
Returns raw, chronological normalized events within the sliding time window.

**Parameters:**
- `zone_id` (path, required, string): e.g. `zone-3`
- `window_minutes` (query, optional, integer, default: 30): Rolling time evaluation range.

**Response Status:** `200 OK`  
**Response Body:**
```json
[
  {
    "id": "inc-0003",
    "zone": "zone-3",
    "timestamp": "2026-09-24T09:18:00Z",
    "source": "311",
    "type": "street_flooding",
    "severity": "high",
    "payload": {
      "category": "Flooding",
      "description": "Underpass impassable, vehicle stalled"
    }
  },
  {
    "id": "tr-0004",
    "zone": "zone-3",
    "timestamp": "2026-09-24T09:25:00Z",
    "source": "transit",
    "type": "service_suspended",
    "severity": "high",
    "payload": {
      "line": "Red Line",
      "cause": "flooded underpass at 5th & Main"
    }
  }
]
```

---

### 1.4 `GET /health`
System health check and feed latency monitor.

**Response Status:** `200 OK`  
**Response Body:**
```json
{
  "status": "ok",
  "database": "connected",
  "active_ws_clients": 4,
  "feeds": {
    "weather": "ok",
    "transit": "ok",
    "311": "ok"
  }
}
```

---

## 2. WebSocket Real-Time Protocol

### 2.1 Connection Handshake
Client initiates connection to:  
`ws://localhost:8000/ws/zones`

Upon successful connection, the server sends an initial state snapshot, followed by streaming push updates whenever any adapter ingests new records or a correlation rule state changes.

### 2.2 Event Message Schema (Server -> Client)
```json
{
  "type": "ZONE_UPDATE",
  "timestamp": "2026-09-24T09:31:00Z",
  "data": {
    "zone": "zone-3",
    "status": "alert",
    "active_event_count": 6,
    "correlations": [
      {
        "rule_id": "weather_x_transit",
        "sources_involved": ["weather", "transit"],
        "confidence": "possible_link",
        "window_minutes": 30,
        "description": "Severe weather alert coincides with transit delays and line disruptions."
      }
    ],
    "summary": "Zone 3: Possible link between severe weather alert and transit line suspension at 5th & Main."
  }
}
```
