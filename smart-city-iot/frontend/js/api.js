/** api.js — SmartCity Global API client */
const BASE = "http://localhost:8000/api";
const API = {
  async get(path) {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
    return res.json();
  },
  enc: v => encodeURIComponent(v),

  // ── Geo hierarchy (Country → State → City → Area) ──────────────
  countries:   ()               => API.get(`/geo/countries`),
  states:      (country)        => API.get(`/geo/states?country=${API.enc(country)}`),
  cities:      (country, state) => API.get(`/geo/cities?country=${API.enc(country)}&state=${API.enc(state)}`),
  areas:       (city, state, country) => API.get(`/geo/areas?city=${API.enc(city)}&state=${API.enc(state)}&country=${API.enc(country)}`),
  geocode:     (city, state, country) => API.get(`/geo/geocode?city=${API.enc(city)}&state=${API.enc(state||"")}&country=${API.enc(country||"")}`),

  // ── City (weather + profile) ───────────────────────────────────
  cityData:    (city)     => API.get(`/city/${API.enc(city)}`),
  nearestCity: (lat, lon) => API.get(`/city/nearest?lat=${lat}&lon=${lon}`),
  zones:       (city)     => API.get(`/traffic/zones?city=${API.enc(city)}`),

  // ── Traffic ───────────────────────────────────────────────────
  trafficSummary:  (z, c) => API.get(`/traffic/summary?zone=${API.enc(z)}&city=${API.enc(c)}`),
  trafficByZone:   (c)    => API.get(`/traffic/by-zone?city=${API.enc(c)}`),
  trafficHourly:   (z, c) => API.get(`/traffic/hourly-pattern?zone=${API.enc(z)}&city=${API.enc(c)}`),
  trafficCompare:  (z, c) => API.get(`/traffic/compare?zone=${API.enc(z)}&city=${API.enc(c)}`),

  // ── Energy ────────────────────────────────────────────────────
  energySummary:   (z, c) => API.get(`/energy/summary?zone=${API.enc(z)}&city=${API.enc(c)}`),
  energyByZone:    (c)    => API.get(`/energy/by-zone?city=${API.enc(c)}`),
  energyCompare:   (z, c) => API.get(`/energy/compare?zone=${API.enc(z)}&city=${API.enc(c)}`),

  // ── Air Quality ───────────────────────────────────────────────
  airSummary:      (z, c) => API.get(`/air-quality/summary?zone=${API.enc(z)}&city=${API.enc(c)}`),
  airByZone:       (c)    => API.get(`/air-quality/by-zone?city=${API.enc(c)}`),
  airCompare:      (z, c) => API.get(`/air-quality/compare?zone=${API.enc(z)}&city=${API.enc(c)}`),

  // ── Water ──────────────────────────────────────────────────────
  waterSummary:    (z, c) => API.get(`/water/summary?zone=${API.enc(z)}&city=${API.enc(c)}`),
  waterByZone:     (c)    => API.get(`/water/by-zone?city=${API.enc(c)}`),
  waterCompare:    (z, c) => API.get(`/water/compare?zone=${API.enc(z)}&city=${API.enc(c)}`),

  // ── Forecast + Anomaly ────────────────────────────────────────
  forecastEnergy:  (z, c) => API.get(`/forecast/energy?zone=${API.enc(z)}&steps=24&city=${API.enc(c)}`),
  anomalies:       (z, c) => API.get(`/forecast/anomalies?zone=${API.enc(z)}&city=${API.enc(c)}`),

  async post(path, body) {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
    return res.json();
  },

  // ── Alerts ────────────────────────────────────────────────────
  alerts:          (c)    => API.get(`/alerts?city=${API.enc(c)}`),

  // ── CityPulse Civic Intelligence Layer ────────────────────────
  civicHealth:     (c)    => API.get(`/civic-health?city=${API.enc(c)}`),
  areaCivicHealth: (a, c) => API.get(`/civic-health/${API.enc(a)}?city=${API.enc(c)}`),
  events:          (c)    => API.get(`/events?city=${API.enc(c)}`),
  eventDetail:     (id)   => API.get(`/events/${API.enc(id)}`),
  situationSummary:(c)    => API.get(`/intelligence/summary?city=${API.enc(c)}`),
  correlations:    (c)    => API.get(`/intelligence/correlations?city=${API.enc(c)}`),
  reports:         (c)    => API.get(`/reports?city=${API.enc(c)}`),
  submitReport:    (data) => API.post(`/reports`, data),
  operations:      (c)    => API.get(`/operations?city=${API.enc(c)}`),
  operationAction: (data) => API.post(`/operations/action`, data),
  neighborhoods:   (c)    => API.get(`/neighborhoods?city=${API.enc(c)}`),
  sourcesHealth:   (c)    => API.get(`/sources/health?city=${API.enc(c)}`),
  replay:          (id)   => API.get(`/replay/${API.enc(id)}`),
  askAnalyst:      (q, c) => API.post(`/ai/analyze`, { query: q, city: c }),
  demoStatus:      ()     => API.get(`/demo/status`),
  demoToggle:      (act, c)=> API.post(`/demo/toggle`, { active: act, city: c }),
};

