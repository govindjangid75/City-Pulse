/**
 * dashboard.js — CityPulse: The Live Civic Health & Intelligence Platform
 * Supports complete spatial intelligence, multi-signal event fusion, transparent
 * Civic Health Scoring, Grounded AI Analyst, Operations triage, forensic replay,
 * and deterministic 16-step hackathon demo flow.
 */
"use strict";

const S = {
  country: "India",
  state: "Rajasthan",
  city: "Jaipur",
  area: "Mansarovar",
  days: 7,
  page: "overview",
  role: "citizen",
  _profileCity: "Jaipur"
};

const $ = id => document.getElementById(id);

// ── Global Leaflet Map Instance & Layer Registry ──────────────────
let cityMap = null;
let mapLayers = {
  health: null,
  clusters: null,
  floods: null,
  traffic: null,
  air: null,
  water: null,
  reports: null
};
let activeLayersState = {
  health: true,
  clusters: true,
  floods: true,
  traffic: false,
  air: false,
  water: false,
  reports: false
};

// ── UI Helpers ───────────────────────────────────────────────────
function setDisabled(id, val) {
  const el = $(id); if (!el) return;
  el.disabled = val;
  const sec = el.closest(".geo-section"); if (sec) sec.style.opacity = val ? ".4" : "1";
}
function setLoading(id, text) {
  const el = $(id); if (!el) return;
  el.innerHTML = `<option>${text}</option>`; el.classList.add("loading");
}
function doneLoading(id) { $(id)?.classList.remove("loading"); }

function updateBreadcrumb() {
  const parts = [S.country, S.state, S.city, S.area].filter(Boolean);
  $("breadcrumbText").textContent = parts.length ? parts.join(" › ") : "Select a location";
}

function profileCity() { return S._profileCity || S.city || "Jaipur"; }

function navigateTo(page) {
  const el = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (el) el.click();
}

// ── Navigation & Routing ──────────────────────────────────────────
document.querySelectorAll(".nav-item").forEach(el => {
  el.addEventListener("click", () => {
    const page = el.dataset.page; if (!page) return;
    document.querySelectorAll(".nav-item").forEach(e => e.classList.remove("active"));
    el.classList.add("active");
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    $(`page-${page}`)?.classList.add("active");
    S.page = page;
    $("pageTitle").textContent = el.textContent.trim().replace(/AI|SPATIAL|\d+/g, "").trim();
    loadPage(page);
  });
});

document.querySelectorAll(".range-tab").forEach(el => {
  el.addEventListener("click", () => {
    document.querySelectorAll(".range-tab").forEach(e => e.classList.remove("active"));
    el.classList.add("active");
    S.days = +el.dataset.days;
    loadPage(S.page);
  });
});

// Role Toggle (Citizen vs Official Command Center)
$("btnRoleCitizen")?.addEventListener("click", () => {
  S.role = "citizen";
  $("btnRoleCitizen").classList.add("active");
  $("btnRoleOfficial").classList.remove("active");
});
$("btnRoleOfficial")?.addEventListener("click", () => {
  S.role = "official";
  $("btnRoleOfficial").classList.add("active");
  $("btnRoleCitizen").classList.remove("active");
  navigateTo("operations");
});

// ── Deterministic Demo Controller ─────────────────────────────────
$("btnDemoCrisis")?.addEventListener("click", async () => {
  try {
    const res = await API.demoToggle(true, profileCity());
    alert(res.message);
    await loadPage(S.page);
    if (cityMap && S.page === "live-city") {
      updateMapData();
    }
  } catch (e) { console.error("Demo toggle:", e); }
});

$("btnDemoReset")?.addEventListener("click", async () => {
  try {
    const res = await API.demoToggle(false, profileCity());
    alert(res.message);
    await loadPage(S.page);
    if (cityMap && S.page === "live-city") {
      updateMapData();
    }
  } catch (e) { console.error("Demo reset:", e); }
});

// ── Country → State → City → Area Hierarchy ───────────────────────
async function initCountries() {
  setLoading("selCountry", "Loading countries…");
  try {
    const { countries } = await API.countries();
    const sel = $("selCountry");
    sel.innerHTML = `<option value="">— Select Country —</option>`;
    countries.forEach(c => {
      const o = document.createElement("option");
      o.value = o.textContent = c;
      sel.appendChild(o);
    });
    doneLoading("selCountry");

    // Default to India for Jaipur CityPulse presentation
    sel.value = "India";
    await onCountryChange("India");
  } catch {
    $("selCountry").innerHTML = `<option value="">Error loading countries</option>`;
  }
}

async function onCountryChange(country) {
  S.country = country; S.state = ""; S.city = ""; S.area = "";
  setDisabled("selState", true); setDisabled("selCity", true); setDisabled("selArea", true);
  $("selState").innerHTML = `<option value="">— Select State —</option>`;
  $("selCity").innerHTML = `<option value="">— Select City —</option>`;
  $("selArea").innerHTML = `<option value="">All Areas</option>`;
  if (!country) { updateBreadcrumb(); return; }

  setLoading("selState", "Loading states…"); setDisabled("selState", false);
  try {
    const { states } = await API.states(country);
    const sel = $("selState");
    sel.innerHTML = `<option value="">— Select State —</option>`;
    states.forEach(s => { const o = document.createElement("option"); o.value = o.textContent = s; sel.appendChild(o); });
    doneLoading("selState");

    const def = country === "India" ? "Rajasthan" : "New York";
    if (states.includes(def)) { sel.value = def; await onStateChange(def); }
    else if (states[0]) { sel.value = states[0]; await onStateChange(states[0]); }
  } catch {
    $("selState").innerHTML = `<option value="">No states found</option>`;
    setDisabled("selState", false);
  }
  updateBreadcrumb();
}

async function onStateChange(state) {
  S.state = state; S.city = ""; S.area = "";
  setDisabled("selCity", true); setDisabled("selArea", true);
  $("selCity").innerHTML = `<option value="">— Select City —</option>`;
  $("selArea").innerHTML = `<option value="">All Areas</option>`;
  if (!state) { updateBreadcrumb(); return; }

  setLoading("selCity", "Loading cities…"); setDisabled("selCity", false);
  try {
    const { cities } = await API.cities(S.country, state);
    const sel = $("selCity");
    sel.innerHTML = `<option value="">— Select City —</option>`;
    cities.forEach(c => { const o = document.createElement("option"); o.value = o.textContent = c; sel.appendChild(o); });
    doneLoading("selCity");

    const def = state === "Rajasthan" ? "Jaipur" : cities[0];
    if (def && cities.includes(def)) { sel.value = def; await onCityChange(def); }
    else if (cities[0]) { sel.value = cities[0]; await onCityChange(cities[0]); }
  } catch {
    $("selCity").innerHTML = `<option value="">No cities found</option>`;
    setDisabled("selCity", false);
  }
  updateBreadcrumb();
}

async function onCityChange(city) {
  S.city = city; S._profileCity = city; S.area = "";
  setDisabled("selArea", true);
  $("selArea").innerHTML = `<option value="">All Areas</option>`;
  if (!city) { updateBreadcrumb(); return; }

  setLoading("selArea", "Loading areas…"); setDisabled("selArea", false);
  try {
    const { areas } = await API.areas(city, S.state, S.country);
    const sel = $("selArea");
    sel.innerHTML = `<option value="">All Areas</option>`;
    (areas || []).forEach(a => { const o = document.createElement("option"); o.value = o.textContent = a; sel.appendChild(o); });
    doneLoading("selArea");

    // Populate Report Form Area selector
    const repAreaSel = $("repArea");
    if (repAreaSel) {
      repAreaSel.innerHTML = "";
      (areas || ["Mansarovar", "Malviya Nagar", "C-Scheme", "Vaishali Nagar", "Sitapura Industrial"]).forEach(a => {
        const o = document.createElement("option"); o.value = o.textContent = a; repAreaSel.appendChild(o);
      });
    }

    if (city === "Jaipur" && areas.includes("Mansarovar")) {
      sel.value = "Mansarovar"; S.area = "Mansarovar";
    }
  } catch {
    $("selArea").innerHTML = `<option value="">All Areas</option>`;
    setDisabled("selArea", false);
  }
  updateBreadcrumb();
  await loadPage(S.page);
  if (cityMap && S.page === "live-city") updateMapData();
}

$("selCountry")?.addEventListener("change", e => onCountryChange(e.target.value));
$("selState")?.addEventListener("change", e => onStateChange(e.target.value));
$("selCity")?.addEventListener("change", e => onCityChange(e.target.value));
$("selArea")?.addEventListener("change", e => { S.area = e.target.value; updateBreadcrumb(); loadPage(S.page); });

// ── Master Page Dispatcher ─────────────────────────────────────────
async function loadPage(page) {
  $("lastUpdated").textContent = new Date().toLocaleTimeString();
  const c = profileCity(), z = S.area;

  if (page === "overview")      await loadOverviewPage(c, z);
  if (page === "live-city")     await loadLiveCityMap(c);
  if (page === "intelligence")  await loadIntelligencePage(c);
  if (page === "correlations")  await loadCorrelationsPage(c);
  if (page === "operations")    await loadOperationsPage(c);
  if (page === "reports")       await loadReportsPage(c);
  if (page === "neighborhoods") await loadNeighborhoodsPage(c);
  if (page === "replay")        await loadReplayPage();
  if (page === "sources")       await loadSourcesPage(c);
  if (page === "forecast")      await loadForecastPage(c, z);
  if (page === "traffic")       await loadTrafficPage(c, z);
  if (page === "air")           await loadAirPage(c, z);
  if (page === "water")         await loadWaterPage(c, z);
  if (page === "energy")        await loadEnergyPage(c, z);
  if (page === "alerts")        await loadAlerts();
}

// ── 1. Overview Page Loader ────────────────────────────────────────
async function loadOverviewPage(c, z) {
  // Load Civic Health
  try {
    const ch = await API.civicHealth(c);
    $("heroScoreVal").textContent = ch.score.toFixed(0);
    $("heroStatusBadge").textContent = ch.status;
    $("heroStatusBadge").style.backgroundColor = ch.status_color;
    $("scoreRadial").style.setProperty("--score-color", ch.status_color);
    $("scoreRadial").style.setProperty("--score-pct", ch.score);

    $("fValTraffic").textContent = ch.factors.traffic.toFixed(0);
    $("fValAir").textContent = ch.factors.air_quality.toFixed(0);
    $("fValWater").textContent = ch.factors.water.toFixed(0);
    $("fValEnergy").textContent = ch.factors.energy.toFixed(0);
    $("fValWeather").textContent = ch.factors.weather.toFixed(0);
    $("fValSafety").textContent = ch.factors.safety.toFixed(0);

    $("driverPos").textContent = ch.drivers.positive.join(" · ") || "Nominal";
    $("driverNeg").textContent = ch.drivers.negative.join(" · ") || "None";
  } catch (e) { console.warn("Civic Health:", e); }

  // Load Situation Brief
  try {
    const sb = await API.situationSummary(c);
    $("briefCityPill").textContent = c.toUpperCase();
    $("briefBodyText").textContent = sb.brief_text;
  } catch (e) { console.warn("Situation brief:", e); }

  // Load Overview Active Events Strip
  try {
    const { events } = await API.events(c);
    const wrap = $("overviewEventsList");
    if (wrap) {
      wrap.innerHTML = events.slice(0, 3).map(ev => {
        const color = ev.severity === "CRITICAL" ? "#ef4444" : ev.severity === "WARNING" ? "#f59e0b" : "#3b82f6";
        return `
          <div class="card" style="border-left:4px solid ${color};cursor:pointer;" onclick="navigateTo('live-city')">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span class="chip" style="background:${color};color:#fff;font-size:10px;padding:2px 6px;">${ev.severity}</span>
              <span style="font-size:11px;font-weight:700;color:var(--text-3);">${(ev.confidence*100).toFixed(0)}% Confidence</span>
            </div>
            <div style="font-size:13px;font-weight:700;color:var(--text);">${ev.title}</div>
            <div style="font-size:11.5px;color:var(--text-3);margin-top:2px;">📍 ${ev.area} · Affected: ${ev.affected_area_km2} km²</div>
          </div>
        `;
      }).join("");
    }
  } catch (e) { console.warn("Overview events:", e); }

  // Load Weather Banner & Overview Charts
  await Promise.all([loadKPIs(), loadAlerts()]);
  try {
    const bz = await API.trafficByZone(c);
    mkBar("energyBar", bz.map(r => r.zone), [{
      label: "Avg Vehicles", data: bz.map(r => r.avg_vehicles),
      backgroundColor: ZONE_COLORS.map(cl => a(cl, 0.75)), borderColor: ZONE_COLORS, borderWidth: 1.5, borderRadius: 5
    }]);
  } catch {}
  try {
    const bz = await API.airByZone(c);
    const colors = bz.map(r => r.avg_aqi > 150 ? PAL.red : r.avg_aqi > 100 ? PAL.yellow : PAL.green);
    mkBar("aqiBar", bz.map(r => r.zone), [{
      label: "AQI", data: bz.map(r => r.avg_aqi),
      backgroundColor: colors.map(cl => a(cl, 0.75)), borderColor: colors, borderWidth: 1.5, borderRadius: 5
    }]);
  } catch {}
  initLive("liveTraffic", PAL.blue, "Vehicles/hr");
}

// AI City Analyst Interactive Q&A
$("btnAskAnalyst")?.addEventListener("click", askAnalystHandler);
$("analystInput")?.addEventListener("keydown", e => { if (e.key === "Enter") askAnalystHandler(); });

async function askAnalystHandler() {
  const input = $("analystInput");
  const query = input?.value.trim();
  if (!query) return;

  const box = $("analystResponseBox");
  box.style.display = "block";
  box.innerHTML = `<em>Querying structured evidence engine...</em>`;

  try {
    const res = await API.askAnalyst(query, profileCity());
    box.innerHTML = `
      <div style="font-weight:700;color:#93c5fd;margin-bottom:4px;">🤖 CityPulse Analyst Response:</div>
      <div style="white-space:pre-line;">${res.answer}</div>
      <div style="font-size:11px;color:#94a3b8;margin-top:6px;border-top:1px dashed rgba(255,255,255,.15);padding-top:4px;">
        📌 Grounding: ${res.grounding_evidence} (Confidence: ${(res.confidence*100).toFixed(0)}%)
      </div>
    `;
  } catch (e) {
    box.innerHTML = `<span style="color:#ef4444">Error communicating with CityPulse Analyst.</span>`;
  }
}

// ── 2. Live City Map (Leaflet Spatial Intelligence) ───────────────
async function loadLiveCityMap(c) {
  if (!cityMap) {
    const container = $("cityMap");
    if (!container) return;

    cityMap = L.map("cityMap", { zoomControl: true }).setView([26.9124, 75.7873], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors | CityPulse Spatial Layer"
    }).addTo(cityMap);

    // Bind layer toggles
    document.querySelectorAll("#mapLayerBar .layer-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const lName = btn.dataset.layer;
        activeLayersState[lName] = !activeLayersState[lName];
        btn.classList.toggle("active", activeLayersState[lName]);
        toggleMapLayer(lName);
      });
    });
  }

  // Update map coordinates based on city
  const cityCenter = c === "Jaipur" ? [26.9124, 75.7873] : [40.7128, -74.0060];
  cityMap.setView(cityCenter, 12);
  await updateMapData();
  setTimeout(() => cityMap.invalidateSize(), 300);
}

async function updateMapData() {
  if (!cityMap) return;
  const c = profileCity();

  // Clear previous layers
  Object.keys(mapLayers).forEach(k => {
    if (mapLayers[k]) cityMap.removeLayer(mapLayers[k]);
    mapLayers[k] = L.layerGroup();
  });

  try {
    const { events } = await API.events(c);
    const { neighborhoods } = await API.neighborhoods(c);
    const { reports } = await API.reports(c);

    // 1. Health Layer (Zone circles)
    neighborhoods.forEach(n => {
      const circle = L.circle([n.latitude, n.longitude], {
        color: n.status_color,
        fillColor: n.status_color,
        fillOpacity: 0.25,
        radius: 1200
      }).bindPopup(`
        <div style="font-family:Inter,sans-serif;font-size:12px;">
          <strong style="font-size:13px;">${n.name}</strong><br>
          Civic Health: <strong>${n.civic_health}/100</strong> (${n.status})<br>
          Traffic: ${n.factors.traffic} · AQI: ${n.factors.air_quality} · Water: ${n.factors.water}<br>
          Active Incidents: ${n.active_events} · Reports: ${n.citizen_reports}
        </div>
      `);
      mapLayers.health.addLayer(circle);
    });

    // 2. AI Event Clusters Layer
    events.forEach(ev => {
      const color = ev.severity === "CRITICAL" ? "#ef4444" : ev.severity === "WARNING" ? "#f59e0b" : "#3b82f6";
      const icon = L.divIcon({
        className: "custom-cluster-icon",
        html: `
          <div style="background:${color};width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:11px;box-shadow:0 0 0 4px rgba(239,68,68,.3);cursor:pointer;">
            !
          </div>
        `,
        iconSize: [24, 24]
      });

      const marker = L.marker([ev.latitude, ev.longitude], { icon })
        .on("click", () => openEventDrawer(ev));
      mapLayers.clusters.addLayer(marker);
    });

    // 3. Flooded Polygon (Hero Demo Event)
    const floodEv = events.find(e => e.category === "Urban Flooding" && e.area === "Mansarovar");
    if (floodEv) {
      const polygonCoords = [
        [floodEv.latitude + 0.012, floodEv.longitude - 0.014],
        [floodEv.latitude + 0.015, floodEv.longitude + 0.012],
        [floodEv.latitude - 0.010, floodEv.longitude + 0.018],
        [floodEv.latitude - 0.014, floodEv.longitude - 0.008]
      ];
      const floodPoly = L.polygon(polygonCoords, {
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.35,
        weight: 2,
        dashArray: "4, 4"
      }).bindTooltip(`<strong>CRITICAL: Urban Flooding Zone</strong><br>Area: 2.8 km² | 17 Reports | Shipra Path`, { sticky: true });
      mapLayers.floods.addLayer(floodPoly);
    }

    // 4. Citizen 311 Reports Layer
    (reports || []).forEach(r => {
      const repMarker = L.circleMarker([r.latitude, r.longitude], {
        radius: 5,
        color: "#8b5cf6",
        fillColor: "#8b5cf6",
        fillOpacity: 0.8
      }).bindPopup(`<strong>311 Report:</strong> ${r.category}<br>${r.description}`);
      mapLayers.reports.addLayer(repMarker);
    });

    // Add active layers to map
    Object.keys(activeLayersState).forEach(k => {
      if (activeLayersState[k] && mapLayers[k]) mapLayers[k].addTo(cityMap);
    });

  } catch (e) { console.warn("Map data update:", e); }
}

function toggleMapLayer(layerName) {
  if (!cityMap || !mapLayers[layerName]) return;
  if (activeLayersState[layerName]) {
    cityMap.addLayer(mapLayers[layerName]);
  } else {
    cityMap.removeLayer(mapLayers[layerName]);
  }
}

function openEventDrawer(ev) {
  const drawer = $("intelligenceDrawer");
  if (!drawer) return;
  drawer.classList.add("open");

  $("drawerTitle").textContent = ev.title;
  $("drawerBody").innerHTML = `
    <div class="dossier-row">
      <span class="dossier-label">Severity & Confidence</span>
      <div style="display:flex;gap:8px;align-items:center;">
        <span class="chip" style="background:${ev.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'};color:#fff;">${ev.severity}</span>
        <span class="dossier-val">${(ev.confidence*100).toFixed(0)}% Confidence</span>
      </div>
    </div>
    <div class="dossier-row">
      <span class="dossier-label">Location & Extent</span>
      <span class="dossier-val">📍 ${ev.area}, ${ev.city} (${ev.affected_area_km2} km² affected)</span>
      <span style="font-size:11.5px;color:var(--text-3);">Corridors: ${(ev.affected_roads||[]).join(", ")}</span>
    </div>
    <div class="dossier-row">
      <span class="dossier-label">Multi-Signal Deltas</span>
      <table class="signal-delta-table">
        <tr><th>Signal</th><th>Deviation</th></tr>
        ${Object.entries(ev.signals||{}).map(([k,v]) => `<tr><td>${k.replace(/_/g," ").toUpperCase()}</td><td style="font-weight:700;color:#ef4444">${v}</td></tr>`).join("")}
      </table>
    </div>
    <div class="dossier-row">
      <span class="dossier-label">Evidence Provenance</span>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${(ev.evidence||[]).map(e => `
          <div style="background:var(--bg);padding:6px 8px;border-radius:6px;font-size:11.5px;">
            <strong>${e.source}:</strong> ${e.summary} <span class="chip chip-blue" style="font-size:9.5px">${e.data_mode}</span>
          </div>
        `).join("")}
      </div>
    </div>
    <div class="dossier-row">
      <span class="dossier-label">Chronological Signal Timeline</span>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:11.5px;border-left:2px solid var(--border);padding-left:8px;">
        ${(ev.timeline||[]).map(t => `<div><strong style="color:var(--blue)">${t.time}</strong> — ${t.event}</div>`).join("")}
      </div>
    </div>
    <div class="dossier-row">
      <span class="dossier-label">Recommended Response</span>
      <ul style="padding-left:16px;font-size:12px;color:var(--text-2);">
        ${(ev.recommended_actions||[]).map(a => `<li>${a}</li>`).join("")}
      </ul>
    </div>
    <button class="locate-btn-full" style="margin-top:10px;" onclick="navigateTo('operations')">
      Open in Operations Command Center
    </button>
  `;
}

function closeDrawer() {
  $("intelligenceDrawer")?.classList.remove("open");
}

// ── 3. Intelligence & Evidence Page Loader ────────────────────────
async function loadIntelligencePage(c) {
  try {
    const { events } = await API.events(c);
    const wrap = $("intelligenceEventsContainer");
    if (!wrap) return;

    wrap.innerHTML = events.map(ev => {
      const color = ev.severity === "CRITICAL" ? "#ef4444" : ev.severity === "WARNING" ? "#f59e0b" : "#3b82f6";
      return `
        <div class="card" style="border-left:5px solid ${color};">
          <div class="card-header">
            <div>
              <span class="chip" style="background:${color};color:#fff;">${ev.severity}</span>
              <strong style="font-size:15px;margin-left:8px;color:var(--text);">${ev.title}</strong>
              <span style="font-size:12px;color:var(--text-3);margin-left:8px;">📍 ${ev.area}</span>
            </div>
            <span class="chip chip-blue">${(ev.confidence*100).toFixed(0)}% AI Confidence</span>
          </div>
          <div style="margin:12px 0;display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div>
              <span class="dossier-label">Structured Evidence Table</span>
              <table class="signal-delta-table">
                <thead><tr><th>Source</th><th>Metric</th><th>Observed</th><th>Delta</th><th>Mode</th></tr></thead>
                <tbody>
                  ${(ev.evidence||[]).map(e => `
                    <tr>
                      <td>${e.source}</td>
                      <td>${e.metric}</td>
                      <td>${e.observed_value} ${e.unit}</td>
                      <td style="color:${e.difference_pct > 0 ? '#ef4444':'#10b981'};font-weight:700;">${e.difference_pct:+}%</td>
                      <td><span class="chip ${e.data_mode==='LIVE'?'chip-green':'chip-blue'}">${e.data_mode}</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
            <div>
              <span class="dossier-label">Incident Lifecycle Timeline</span>
              <div style="display:flex;flex-direction:column;gap:6px;border-left:2px solid #cbd5e1;padding-left:10px;margin-top:6px;font-size:12px;">
                ${(ev.timeline||[]).map(t => `<div><strong style="color:var(--blue)">${t.time}</strong>: ${t.event}</div>`).join("")}
              </div>
            </div>
          </div>
          <div style="background:var(--bg);padding:8px 12px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:12px;color:var(--text-2);"><strong>Assigned:</strong> ${ev.assigned_department} (${ev.assigned_officer}) · <strong>Status:</strong> ${ev.status}</span>
            <button class="btn-ops-action btn-ops-dispatch" onclick="navigateTo('operations')">Triage in Operations</button>
          </div>
        </div>
      `;
    }).join("");
  } catch (e) { console.warn("Intelligence page:", e); }
}

// ── 4. Correlations Page Loader ────────────────────────────────────
async function loadCorrelationsPage(c) {
  try {
    const data = await API.correlations(c);
    const wrap = $("correlationMatrixWrap");
    if (!wrap) return;

    let html = `<table style="width:100%;border-collapse:collapse;font-size:12px;text-align:center;">`;
    html += `<tr><th style="text-align:left;padding:8px;background:var(--bg);">Signal</th>${data.signals.map(s => `<th style="padding:8px;background:var(--bg);">${s}</th>`).join("")}</tr>`;

    data.matrix.forEach((row, rIdx) => {
      html += `<tr><td style="text-align:left;padding:8px;font-weight:600;border-bottom:1px solid var(--border);">${data.signals[rIdx]}</td>`;
      row.forEach(val => {
        let bg = "#f1f5f9";
        let text = "#0f172a";
        if (val >= 0.7) { bg = "#fecaca"; text = "#991b1b"; }
        else if (val >= 0.4) { bg = "#fed7aa"; text = "#9a3412"; }
        else if (val <= -0.2) { bg = "#dbeafe"; text = "#1e40af"; }
        html += `<td style="padding:8px;background:${bg};color:${text};font-weight:700;border:1px solid #fff;">${val.toFixed(2)}</td>`;
      });
      html += `</tr>`;
    });
    html += `</table>`;
    wrap.innerHTML = html;

    const insightsWrap = $("correlationInsightsGrid");
    if (insightsWrap) {
      insightsWrap.innerHTML = data.key_insights.map(ki => `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <strong style="color:var(--text);font-size:13px;">${ki.pair}</strong>
            <span class="chip chip-purple">${ki.strength} (${ki.correlation})</span>
          </div>
          <div style="font-size:12px;color:var(--text-3);line-height:1.5;">${ki.interpretation}</div>
        </div>
      `).join("");
    }
  } catch (e) { console.warn("Correlations:", e); }
}

// ── 5. Operations Command Page Loader ──────────────────────────────
async function loadOperationsPage(c) {
  try {
    const data = await API.operations(c);
    const kpis = data.kpis;

    $("opsKpiRow").innerHTML = `
      <div class="factor-box"><span class="factor-name">Active Incidents</span><span class="factor-val" style="color:#ef4444">${kpis.active_incidents}</span></div>
      <div class="factor-box"><span class="factor-name">Critical Situations</span><span class="factor-val" style="color:#ef4444">${kpis.critical_events}</span></div>
      <div class="factor-box"><span class="factor-name">Warnings</span><span class="factor-val" style="color:#f59e0b">${kpis.warnings}</span></div>
      <div class="factor-box"><span class="factor-name">Teams Dispatched</span><span class="factor-val" style="color:#10b981">${kpis.assigned_teams}</span></div>
      <div class="factor-box"><span class="factor-name">Unassigned Queue</span><span class="factor-val">${kpis.unassigned_queue}</span></div>
      <div class="factor-box"><span class="factor-name">Avg Response SLA</span><span class="factor-val">${kpis.avg_response_minutes} min</span></div>
    `;

    const tbody = $("opsTableBody");
    if (!tbody) return;

    tbody.innerHTML = data.active_queue.map(ev => `
      <tr>
        <td><code>${ev.event_id}</code></td>
        <td><strong>${ev.title}</strong></td>
        <td>${ev.area}</td>
        <td><span class="chip" style="background:${ev.severity==='CRITICAL'?'#ef4444':'#f59e0b'};color:#fff;">${ev.severity}</span></td>
        <td>${(ev.confidence*100).toFixed(0)}%</td>
        <td>
          <select id="dept-${ev.event_id}" class="footer-select" style="padding:4px;font-size:11px;background:#fff">
            ${data.departments.map(d => `<option value="${d}" ${ev.assigned_department === d ? 'selected' : ''}>${d}</option>`).join("")}
          </select>
        </td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="btn-ops-action btn-ops-dispatch" onclick="assignIncident('${ev.event_id}')">Dispatch</button>
            <button class="btn-ops-action btn-ops-resolve" onclick="resolveIncident('${ev.event_id}')">Resolve</button>
          </div>
        </td>
      </tr>
    `).join("");
  } catch (e) { console.warn("Operations page:", e); }
}

window.assignIncident = async function(eventId) {
  const dept = $(`dept-${eventId}`)?.value || "State Disaster Response (SDRF)";
  try {
    await API.operationAction({
      event_id: eventId,
      status: "DISPATCHED",
      assigned_department: dept,
      assigned_officer: "Officer R. Meena (Unit 4)",
      note: `Field team dispatched from ${dept}`
    });
    alert(`Unit successfully dispatched for incident ${eventId}`);
    loadOperationsPage(profileCity());
  } catch (e) { alert("Dispatch failed: " + e.message); }
};

window.resolveIncident = async function(eventId) {
  try {
    await API.operationAction({
      event_id: eventId,
      status: "RESOLVED",
      note: "Incident mitigated and resolved by municipal field team."
    });
    alert(`Incident ${eventId} resolved.`);
    loadOperationsPage(profileCity());
  } catch (e) { alert("Resolution failed: " + e.message); }
};

// ── 6. Citizen Reports Page Loader ─────────────────────────────────
async function loadReportsPage(c) {
  try {
    const { reports } = await API.reports(c);
    $("reportsCountBadge").textContent = `${reports.length} Reports`;
    const list = $("reportsFeedList");
    if (!list) return;

    list.innerHTML = reports.map(r => `
      <div style="background:var(--bg);border-radius:8px;padding:10px 12px;border:1px solid var(--border);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <div>
            <strong style="color:var(--text);font-size:13px;">${r.category}</strong>
            <span style="font-size:11px;color:var(--text-3);margin-left:6px;">📍 ${r.area}</span>
          </div>
          <span class="chip ${r.duplicate_count > 1 ? 'chip-purple' : 'chip-blue'}">
            ${r.duplicate_count > 1 ? `Clustered (${r.duplicate_count} reports)` : 'Single Report'}
          </span>
        </div>
        <div style="font-size:12px;color:var(--text-2);margin-bottom:6px;">${r.description}</div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-4);">
          <span>ID: <code>${r.report_id}</code></span>
          <span>Logged at ${r.timestamp} · Status: <strong>${r.status}</strong></span>
        </div>
      </div>
    `).join("");
  } catch (e) { console.warn("Reports page:", e); }
}

$("reportForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const cat = $("repCategory").value;
  const area = $("repArea").value || "Mansarovar";
  const sev = $("repSeverity").value;
  const desc = $("repDescription").value.trim();

  if (!desc) { alert("Please enter incident details."); return; }

  try {
    const res = await API.submitReport({
      category: cat,
      area: area,
      city: profileCity(),
      severity: sev,
      description: desc
    });
    alert(res.message);
    $("repDescription").value = "";
    loadReportsPage(profileCity());
  } catch (err) { alert("Error submitting report: " + err.message); }
});

// ── 7. Neighborhoods Page Loader ───────────────────────────────────
async function loadNeighborhoodsPage(c) {
  try {
    const { neighborhoods } = await API.neighborhoods(c);
    const wrap = $("neighborhoodsGrid");
    if (!wrap) return;

    wrap.innerHTML = neighborhoods.map(n => `
      <div class="card" style="border-top:4px solid ${n.status_color};">
        <div class="card-header">
          <div>
            <strong style="font-size:15px;color:var(--text);">${n.name}</strong>
            <div style="font-size:11px;color:var(--text-3);">${n.city}</div>
          </div>
          <span class="chip" style="background:${n.status_color};color:#fff;font-weight:700;">
            ${n.civic_health.toFixed(0)} / 100 (${n.status})
          </span>
        </div>
        <div class="factors-row" style="margin:10px 0;grid-template-columns:repeat(3,1fr);">
          <div class="factor-box"><span class="factor-name">Traffic</span><span class="factor-val">${n.factors.traffic}</span></div>
          <div class="factor-box"><span class="factor-name">Air Quality</span><span class="factor-val">${n.factors.air_quality}</span></div>
          <div class="factor-box"><span class="factor-name">Water</span><span class="factor-val">${n.factors.water}</span></div>
        </div>
        <div style="font-size:11.5px;color:var(--text-3);margin-top:6px;">
          Active Events: <strong>${n.active_events}</strong> · 311 Complaints: <strong>${n.citizen_reports}</strong>
        </div>
        <div style="font-size:11px;color:var(--text-2);margin-top:6px;line-height:1.4;">
          ${n.why_this_score}
        </div>
      </div>
    `).join("");
  } catch (e) { console.warn("Neighborhoods page:", e); }
}

// ── 8. City Replay Page Loader ─────────────────────────────────────
let replayFrames = [];
let replayTimer = null;

async function loadReplayPage() {
  try {
    const res = await API.replay("EVT-JPR-FLOOD-001");
    replayFrames = res.frames || [];
    $("replayEventTitle").textContent = res.event_title;

    const grid = $("replayFramesGrid");
    if (grid) {
      grid.innerHTML = replayFrames.map((f, i) => `
        <div class="frame-card ${i===0?'active':''}" id="frame-card-${f.step}" onclick="setReplayStep(${f.step})">
          <div class="frame-time">${f.time}</div>
          <div class="frame-title">${f.title}</div>
        </div>
      `).join("");
    }
    setReplayStep(1);
  } catch (e) { console.warn("Replay page:", e); }
}

window.setReplayStep = function(stepNum) {
  const frame = replayFrames.find(f => f.step === stepNum);
  if (!frame) return;

  $("replaySlider").value = stepNum;
  $("replayCurrentTime").textContent = frame.time;
  $("rMetricHealth").textContent = frame.civic_health;
  $("rMetricRain").textContent = `${frame.rain_mmh} mm/h`;
  $("rMetricSpeed").textContent = `${frame.traffic_speed_kmh} km/h`;
  $("rMetricPressure").textContent = `${frame.water_pressure_bar} bar`;
  $("rMetricReports").textContent = frame.citizen_reports;
  $("rMetricState").textContent = frame.event_status;
  $("rMetricState").style.color = frame.civic_health < 60 ? "#ef4444" : "#10b981";
  $("replayDescription").innerHTML = `<strong>Step ${frame.step} (${frame.time}) — ${frame.title}:</strong> ${frame.description}`;

  document.querySelectorAll(".frame-card").forEach(c => c.classList.remove("active"));
  $(`frame-card-${stepNum}`)?.classList.add("active");
};

$("replaySlider")?.addEventListener("input", e => setReplayStep(+e.target.value));

$("btnReplayPlay")?.addEventListener("click", () => {
  const btn = $("btnReplayPlay");
  if (replayTimer) {
    clearInterval(replayTimer);
    replayTimer = null;
    btn.textContent = "▶";
  } else {
    btn.textContent = "⏸";
    replayTimer = setInterval(() => {
      let cur = +$("replaySlider").value;
      let next = cur >= 6 ? 1 : cur + 1;
      setReplayStep(next);
    }, 2000);
  }
});

// ── 9. Data Sources Health Page Loader ─────────────────────────────
async function loadSourcesPage(c) {
  try {
    const data = await API.sourcesHealth(c);
    const tbody = $("sourcesTableBody");
    if (!tbody) return;

    tbody.innerHTML = data.sources.map(s => `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.provider}</td>
        <td>${s.type}</td>
        <td><span class="chip ${s.mode==='LIVE'?'chip-green':'chip-blue'}">${s.mode}</span></td>
        <td><span class="chip chip-green">${s.status}</span></td>
        <td>${s.latency_ms} ms</td>
        <td>${s.freshness_seconds}s ago</td>
        <td><strong>${s.reliability_pct}%</strong></td>
      </tr>
    `).join("");
  } catch (e) { console.warn("Sources page:", e); }
}

// ── Preserved Original Data Loaders & Charts ───────────────────────
async function loadKPIs() {
  const c = profileCity();
  try {
    const [tr, en, aq, wt] = await Promise.all([
      API.trafficSummary("", c), API.energySummary("", c),
      API.airSummary("", c), API.waterSummary("", c)
    ]);
    const kpis = [
      { icon: "🚗", value: tr.avg_vehicles_per_hour?.toLocaleString() || "--", label: "Avg Vehicles / hr", sub: `speed ${tr.avg_speed_kmh||"--"} km/h`, badge: { text: "Live", cls: "chip-live" }, color: "" },
      { icon: "⚡", value: en.total_consumption_kwh?.toLocaleString() || "--", label: "Energy (kWh)", sub: `grid load ${en.avg_grid_load_pct||"--"}%`, badge: { text: "Live", cls: "chip-orange" }, color: "" },
      { icon: "🌫️", value: aq.avg_aqi?.toFixed(0) || "--", label: `AQI · ${aq.air_quality_category||"--"}`, sub: `PM2.5 ${aq.avg_pm25||"--"} μg/m³`, badge: { text: aq.avg_aqi > 100 ? "Caution" : "Good", cls: aq.avg_aqi > 100 ? "chip-red" : "chip-green" }, color: "" },
      { icon: "💧", value: wt.total_usage_liters?.toLocaleString() || "--", label: "Water Usage (L)", sub: `leak risk ${(wt.avg_leak_risk*100).toFixed(0)}%`, badge: { text: "Normal", cls: "chip-cyan" }, color: "" },
    ];
    $("kpiRow").innerHTML = kpis.map(k => `
      <div class="kpi-card ${k.color}">
        <div class="kpi-header"><div class="kpi-icon">${k.icon}</div><span class="kpi-badge ${k.badge.cls}">${k.badge.text}</span></div>
        <div class="kpi-value">${k.value}</div>
        <div class="kpi-label">${k.label}</div>
        <div class="kpi-sub">${k.sub}</div>
      </div>
    `).join("");
  } catch (e) { console.warn("KPIs:", e); }
}

async function loadAlerts() {
  const c = profileCity();
  try {
    const data = await API.alerts(c);
    const badge = $("alertBadge");
    if (badge) {
      if (data.total > 0) { badge.style.display = "inline-block"; badge.textContent = data.total; }
      else { badge.style.display = "none"; }
    }
  } catch (e) { console.warn("Alerts:", e); }
}

async function loadTrafficPage(c, z) {
  try {
    const bz = await API.trafficByZone(c);
    mkBar("trafficSpeedBar", bz.map(r => r.zone), [{
      label: "Avg Speed km/h", data: bz.map(r => r.avg_speed),
      backgroundColor: ZONE_COLORS.map(cl => a(cl, 0.75)), borderColor: ZONE_COLORS, borderWidth: 1.5, borderRadius: 5
    }]);
  } catch {}
  try {
    const hp = await API.trafficHourly(z, c);
    mkLine("trafficHourly", hp.hours.map(h => `${h}:00`), [{
      label: "Avg Vehicles", data: hp.values, borderColor: PAL.blue,
      backgroundColor: a(PAL.blue, 0.08), borderWidth: 2, fill: true, tension: 0.4, pointRadius: 2
    }]);
  } catch {}
  try {
    const cmp = await API.trafficCompare(z, c);
    $("trafficWowBadge").textContent = wowLabel(cmp.wow_pct);
    mkLine("trafficCompare", cmp.labels.filter((_, i) => i % 6 === 0), [
      { label: "This week", data: cmp.this_week.filter((_, i) => i % 6 === 0), borderColor: PAL.blue, backgroundColor: a(PAL.blue, 0.08), borderWidth: 2, fill: false, tension: 0.3 },
      { label: "Last week", data: cmp.last_week.filter((_, i) => i % 6 === 0), borderColor: PAL.purple, backgroundColor: "transparent", borderWidth: 2, borderDash: [5, 4], fill: false, tension: 0.3 }
    ]);
  } catch {}
  initLive("trafficLive", PAL.blue, "Vehicles/hr");
}

async function loadEnergyPage(c, z) {
  try {
    const bz = await API.energyByZone(c);
    mkBar("energyZoneBar", bz.map(r => r.zone), [{
      label: "Avg kWh", data: bz.map(r => r.avg_consumption_kwh),
      backgroundColor: ZONE_COLORS.map(cl => a(cl, 0.75)), borderColor: ZONE_COLORS, borderWidth: 1.5, borderRadius: 5
    }]);
    mkBar("solarBar", bz.map(r => r.zone), [{
      label: "Solar %", data: bz.map(r => r.solar_pct),
      backgroundColor: a(PAL.green, 0.75), borderColor: PAL.green, borderWidth: 1.5, borderRadius: 5
    }]);
  } catch {}
  try {
    const cmp = await API.energyCompare(z, c);
    $("energyWowBadge").textContent = wowLabel(cmp.wow_pct);
    mkLine("energyCompare", cmp.labels.filter((_, i) => i % 6 === 0), [
      { label: "This week", data: cmp.this_week.filter((_, i) => i % 6 === 0), borderColor: PAL.orange, backgroundColor: a(PAL.orange, 0.08), borderWidth: 2, fill: false, tension: 0.3 },
      { label: "Last week", data: cmp.last_week.filter((_, i) => i % 6 === 0), borderColor: PAL.purple, backgroundColor: "transparent", borderWidth: 2, borderDash: [5, 4], fill: false, tension: 0.3 }
    ]);
  } catch {}
  initLive("energyLive", PAL.orange, "Grid Load %");
}

async function loadAirPage(c, z) {
  try {
    const bz = await API.airByZone(c);
    const colors = bz.map(r => r.avg_aqi > 150 ? PAL.red : r.avg_aqi > 100 ? PAL.yellow : PAL.green);
    mkBar("airZoneBar", bz.map(r => r.zone), [{
      label: "AQI", data: bz.map(r => r.avg_aqi),
      backgroundColor: colors.map(cl => a(cl, 0.75)), borderColor: colors, borderWidth: 1.5, borderRadius: 5
    }]);
    mkBar("pm25Bar", bz.map(r => r.zone), [{
      label: "PM2.5 μg/m³", data: bz.map(r => r.avg_pm25),
      backgroundColor: ZONE_COLORS.map(cl => a(cl, 0.75)), borderColor: ZONE_COLORS, borderWidth: 1.5, borderRadius: 5
    }]);
  } catch {}
  try {
    const cmp = await API.airCompare(z, c);
    $("airWowBadge").textContent = wowLabel(cmp.wow_pct);
    mkLine("airCompare", cmp.labels.filter((_, i) => i % 6 === 0), [
      { label: "This week", data: cmp.this_week.filter((_, i) => i % 6 === 0), borderColor: PAL.cyan, backgroundColor: a(PAL.cyan, 0.08), borderWidth: 2, fill: false, tension: 0.3 },
      { label: "Last week", data: cmp.last_week.filter((_, i) => i % 6 === 0), borderColor: PAL.purple, backgroundColor: "transparent", borderWidth: 2, borderDash: [5, 4], fill: false, tension: 0.3 }
    ]);
  } catch {}
  initLive("airLive", PAL.cyan, "AQI");
}

async function loadWaterPage(c, z) {
  try {
    const bz = await API.waterByZone(c);
    mkBar("waterZoneBar", bz.map(r => r.zone), [{
      label: "Avg L/hr", data: bz.map(r => r.avg_usage_liters),
      backgroundColor: ZONE_COLORS.map(cl => a(cl, 0.75)), borderColor: ZONE_COLORS, borderWidth: 1.5, borderRadius: 5
    }]);
    mkBar("leakBar", bz.map(r => r.zone), [{
      label: "High Leak Risk %", data: bz.map(r => r.leak_risk_pct),
      backgroundColor: a(PAL.red, 0.75), borderColor: PAL.red, borderWidth: 1.5, borderRadius: 5
    }]);
  } catch {}
  try {
    const cmp = await API.waterCompare(z, c);
    $("waterWowBadge").textContent = wowLabel(cmp.wow_pct);
    mkLine("waterCompare", cmp.labels.filter((_, i) => i % 6 === 0), [
      { label: "This week", data: cmp.this_week.filter((_, i) => i % 6 === 0), borderColor: PAL.cyan, backgroundColor: a(PAL.cyan, 0.08), borderWidth: 2, fill: false, tension: 0.3 },
      { label: "Last week", data: cmp.last_week.filter((_, i) => i % 6 === 0), borderColor: PAL.purple, backgroundColor: "transparent", borderWidth: 2, borderDash: [5, 4], fill: false, tension: 0.3 }
    ]);
  } catch {}
  initLive("waterLive", PAL.cyan, "L/hr");
}

async function loadForecastPage(c, z) {
  try {
    const fc = await API.forecastEnergy(z, c);
    const best = fc.best_model;
    $("mapeChips").innerHTML = [
      fc.arima_mape != null ? `<span class="chip ${best==='ARIMA'?'chip-green':'chip-blue'}">ARIMA MAPE: ${fc.arima_mape}%${best==='ARIMA'?' ✓':''}</span>` : "",
      fc.prophet_mape != null ? `<span class="chip ${best==='Prophet'?'chip-green':'chip-blue'}">Prophet MAPE: ${fc.prophet_mape}%${best==='Prophet'?' ✓':''}</span>` : ""
    ].join("");
    $("badge-forecast").textContent = `Best: ${best || "N/A"}`;
    if (fc.peak_time) {
      const el = $("peakAlert");
      el.style.display = "flex";
      el.innerHTML = `⚡ Energy forecast peaks at <strong>${fc.peak_value} kWh</strong> around <strong>${fc.peak_time}</strong>`;
    }
    const labels = (fc.labels || []).map(l => l.substring(11, 16));
    const datasets = [];
    if (fc.actual) datasets.push({ label: "Actual", data: fc.actual, borderColor: PAL.blue, backgroundColor: a(PAL.blue, 0.08), borderWidth: 2, fill: true, tension: 0.4, pointRadius: 2 });
    if (fc.arima) datasets.push({ label: "ARIMA", data: fc.arima, borderColor: PAL.orange, backgroundColor: "transparent", borderWidth: 2, fill: false, tension: 0.3, pointRadius: 0, borderDash: [5, 4] });
    if (fc.prophet) datasets.push({ label: "Prophet", data: fc.prophet, borderColor: PAL.purple, backgroundColor: "transparent", borderWidth: 2, fill: false, tension: 0.3, pointRadius: 0, borderDash: [3, 3] });
    mkLine("forecastChart", labels, datasets);
  } catch (e) { console.warn("Forecast:", e); }

  try {
    const an = await API.anomalies(z, c);
    $("badge-anomaly").textContent = `${an.total_anomalies} anomalies (90d)`;
    $("anomalyMethod").textContent = `method: ${an.method}`;
    const labels = (an.labels || []).map(l => l.substring(11, 16));
    const normal = an.values.map((v, i) => an.anomaly_indices.includes(i) ? null : v);
    const anomVals = an.values.map((v, i) => an.anomaly_indices.includes(i) ? v : null);
    mkLine("anomalyChart", labels, [
      { label: "Normal", data: normal, borderColor: PAL.blue, backgroundColor: a(PAL.blue, 0.07), borderWidth: 2, fill: true, tension: 0.4, pointRadius: 0, spanGaps: true },
      { label: "Anomaly", data: anomVals, borderColor: PAL.red, backgroundColor: a(PAL.red, 0.6), borderWidth: 0, fill: false, tension: 0, pointRadius: 5, showLine: false, spanGaps: false }
    ]);
  } catch (e) { console.warn("Anomaly:", e); }
}

// ── Live Streaming Simulation ──────────────────────────────────────
let liveTimer = null;
let liveChart = null;
let liveLabels = [];
let liveValues = [];

function initLive(canvasId, color, label) {
  liveLabels = []; liveValues = []; kill(canvasId);
  const ctx = $(canvasId); if (!ctx) return;
  liveChart = new Chart(ctx, {
    type: "line",
    data: { labels: liveLabels, datasets: [{ label, data: liveValues, borderColor: color, backgroundColor: a(color, 0.08), borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4 }] },
    options: { ...BASE_OPTS, animation: false, scales: { x: { ...SCALE.x, display: false }, y: { ...SCALE.y } }, plugins: { legend: { display: false } } }
  });
  reg[canvasId] = liveChart;
}

function pushLive(val, badgeId, label) {
  const now = new Date().toLocaleTimeString();
  liveLabels.push(now); liveValues.push(val);
  if (liveLabels.length > 60) { liveLabels.shift(); liveValues.shift(); }
  if (liveChart) {
    liveChart.data.labels = [...liveLabels];
    liveChart.data.datasets[0].data = [...liveValues];
    liveChart.data.datasets[0].label = label || "Value";
    liveChart.update("none");
  }
  const el = $(badgeId); if (el) el.textContent = val?.toFixed ? val.toFixed(0) : String(val);
}

function startLiveStream() {
  clearInterval(liveTimer);
  liveTimer = setInterval(async () => {
    try {
      const tr = await API.trafficSummary("", profileCity());
      const j = tr.avg_vehicles_per_hour * (1 + (Math.random() - 0.5) * 0.12);
      pushLive(Math.round(j), "badge-ov-traffic", "Vehicles/hr");
      pushLive(Math.round(j), "badge-traffic", "Vehicles/hr");
    } catch {}
    $("lastUpdated").textContent = new Date().toLocaleTimeString();
  }, 2000);
}

// ── Application Initialization ─────────────────────────────────────
async function init() {
  const loader = $("loader");
  try {
    await initCountries();
    startLiveStream();
  } catch (e) {
    console.error("Init:", e);
  } finally {
    loader.classList.add("gone");
  }
}

init();
