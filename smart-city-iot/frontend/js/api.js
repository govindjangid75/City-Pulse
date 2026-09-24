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

  // ── Alerts ────────────────────────────────────────────────────
  alerts:          (c)    => API.get(`/alerts?city=${API.enc(c)}`),
};
