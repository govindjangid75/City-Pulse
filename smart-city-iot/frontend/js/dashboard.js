/** dashboard.js — SmartCity Global v3 — 4-level geo hierarchy */
"use strict";

const S = { country:"", state:"", city:"New York", area:"", days:7, page:"overview", _profileCity:"New York" };
const $ = id => document.getElementById(id);

// ── Helpers ──────────────────────────────────────────────────────
function setDisabled(id, val) {
  const el=$(id); if(!el) return;
  el.disabled=val;
  const sec=el.closest(".geo-section"); if(sec) sec.style.opacity=val?".4":"1";
}
function setLoading(id, text) {
  const el=$(id); if(!el) return;
  el.innerHTML=`<option>${text}</option>`; el.classList.add("loading");
}
function doneLoading(id){ $(id)?.classList.remove("loading"); }
function updateBreadcrumb(){
  const parts=[S.country,S.state,S.city,S.area].filter(Boolean);
  $("breadcrumbText").textContent=parts.length?parts.join(" › "):"Select a location";
}
function profileCity(){ return S._profileCity||"New York"; }

// ── Nav routing ───────────────────────────────────────────────────
document.querySelectorAll(".nav-item").forEach(el=>{
  el.addEventListener("click",()=>{
    const page=el.dataset.page; if(!page) return;
    document.querySelectorAll(".nav-item").forEach(e=>e.classList.remove("active"));
    el.classList.add("active");
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    $(`page-${page}`)?.classList.add("active");
    S.page=page;
    $("pageTitle").textContent=el.textContent.trim().replace(/AI|\d+/g,"").trim();
    loadPage(page);
  });
});
document.querySelectorAll(".range-tab").forEach(el=>{
  el.addEventListener("click",()=>{
    document.querySelectorAll(".range-tab").forEach(e=>e.classList.remove("active"));
    el.classList.add("active"); S.days=+el.dataset.days; loadPage(S.page);
  });
});

// ── Country → State → City → Area ────────────────────────────────
async function initCountries(){
  setLoading("selCountry","Loading countries…");
  try {
    const {countries}=await API.countries();
    const sel=$("selCountry");
    sel.innerHTML=`<option value="">— Select Country —</option>`;
    countries.forEach(c=>{ const o=document.createElement("option"); o.value=o.textContent=c; sel.appendChild(o); });
    doneLoading("selCountry");
    sel.value="United States"; await onCountryChange("United States");
  } catch { $("selCountry").innerHTML=`<option value="">Error loading countries</option>`; }
}

async function onCountryChange(country){
  S.country=country; S.state=""; S.city=""; S.area="";
  setDisabled("selState",true); setDisabled("selCity",true); setDisabled("selArea",true);
  $("selState").innerHTML=`<option value="">— Select State —</option>`;
  $("selCity").innerHTML=`<option value="">— Select City —</option>`;
  $("selArea").innerHTML=`<option value="">All Areas</option>`;
  if(!country){ updateBreadcrumb(); return; }
  setLoading("selState","Loading states…"); setDisabled("selState",false);
  try {
    const {states}=await API.states(country);
    const sel=$("selState");
    sel.innerHTML=`<option value="">— Select State —</option>`;
    states.forEach(s=>{ const o=document.createElement("option"); o.value=o.textContent=s; sel.appendChild(o); });
    doneLoading("selState");
    const defaults={"United States":"New York","India":"Maharashtra","China":"Beijing","United Kingdom":"England"};
    const def=defaults[country];
    if(def&&states.includes(def)){ sel.value=def; await onStateChange(def); }
  } catch { $("selState").innerHTML=`<option value="">No states found</option>`; setDisabled("selState",false); }
  updateBreadcrumb();
}

async function onStateChange(state){
  S.state=state; S.city=""; S.area="";
  setDisabled("selCity",true); setDisabled("selArea",true);
  $("selCity").innerHTML=`<option value="">— Select City —</option>`;
  $("selArea").innerHTML=`<option value="">All Areas</option>`;
  if(!state){ updateBreadcrumb(); return; }
  setLoading("selCity","Loading cities…"); setDisabled("selCity",false);
  try {
    const {cities}=await API.cities(S.country,state);
    const sel=$("selCity");
    sel.innerHTML=`<option value="">— Select City —</option>`;
    cities.forEach(c=>{ const o=document.createElement("option"); o.value=o.textContent=c; sel.appendChild(o); });
    doneLoading("selCity");
    const defaults={"New York":"New York City","Maharashtra":"Mumbai","Karnataka":"Bangalore",
                    "California":"Los Angeles","Texas":"Houston","England":"London"};
    const def=defaults[state]||cities[0];
    if(def&&cities.includes(def)){ sel.value=def; await onCityChange(def); }
    else if(cities[0]){ sel.value=cities[0]; await onCityChange(cities[0]); }
  } catch { $("selCity").innerHTML=`<option value="">No cities found</option>`; setDisabled("selCity",false); }
  updateBreadcrumb();
}

async function onCityChange(city){
  S.city=city; S.area="";
  setDisabled("selArea",true);
  $("selArea").innerHTML=`<option value="">All Areas</option>`;
  if(!city){ updateBreadcrumb(); return; }

  // Geocode → nearest IoT profile
  try {
    const geo=await API.geocode(city,S.state,S.country);
    const nearest=await API.nearestCity(geo.lat,geo.lon);
    S._profileCity=nearest.city;
  } catch { S._profileCity="New York"; }

  loadWeather(city);

  // Load areas via Nominatim
  setLoading("selArea","Loading areas…"); setDisabled("selArea",false);
  try {
    const {areas}=await API.areas(city,S.state,S.country);
    const sel=$("selArea");
    sel.innerHTML=`<option value="">All Areas</option>`;
    areas.forEach(a=>{ const o=document.createElement("option"); o.value=o.textContent=a; sel.appendChild(o); });
    doneLoading("selArea");
  } catch { $("selArea").innerHTML=`<option value="">All Areas</option>`; setDisabled("selArea",false); }

  updateBreadcrumb();
  loadPage(S.page);
  loadAlerts();
}

function onAreaChange(area){ S.area=area; updateBreadcrumb(); loadPage(S.page); }

// Wire up
$("selCountry").addEventListener("change",e=>onCountryChange(e.target.value));
$("selState"  ).addEventListener("change",e=>onStateChange(e.target.value));
$("selCity"   ).addEventListener("change",e=>onCityChange(e.target.value));
$("selArea"   ).addEventListener("change",e=>onAreaChange(e.target.value));

// ── Locate Me ─────────────────────────────────────────────────────
$("locateBtn").addEventListener("click",async()=>{
  const btn=$("locateBtn");
  btn.disabled=true;
  btn.innerHTML=`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin .75s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Detecting…`;
  if(!navigator.geolocation){ btn.disabled=false; return; }
  navigator.geolocation.getCurrentPosition(async pos=>{
    try {
      const {latitude:lat,longitude:lon}=pos.coords;
      const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {headers:{"User-Agent":"SmartCityIoT/3.0"}});
      const d=await r.json(); const addr=d.address||{};
      const country=addr.country||"";
      const state=addr.state||addr.region||addr.county||"";
      const city=addr.city||addr.town||addr.village||addr.municipality||"";
      if(country){ $("selCountry").value=country; await onCountryChange(country); await sleep(400);
        if(state){ const m=findOption("selState",state); if(m){ $("selState").value=m; await onStateChange(m); await sleep(400); } }
        if(city){ const m=findOption("selCity",city); if(m){ $("selCity").value=m; await onCityChange(m); } }
      }
    } catch(e){ console.warn("Locate:",e); }
    resetLocateBtn(btn);
  },()=>resetLocateBtn(btn),{timeout:10000});
});
function findOption(selId,val){
  const opts=[...($(selId)||{options:[]}).options].map(o=>o.value);
  return opts.find(s=>s.toLowerCase()===val.toLowerCase())||opts.find(s=>s.toLowerCase().includes(val.toLowerCase().split(" ")[0]))||null;
}
function resetLocateBtn(btn){
  btn.disabled=false;
  btn.innerHTML=`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg> Detect My Location`;
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// ── Weather Banner ────────────────────────────────────────────────
async function loadWeather(city){
  try {
    const d=await API.cityData(city);
    const w=d.weather,aq=d.air_quality;
    $("wbCity").textContent=`${city}${S.state?", "+S.state:""} — ${w.description}`;
    $("wbDesc").textContent=`${d.region||S.country||""} · Live via Open-Meteo`;
    $("wbEmoji").textContent=w.emoji||"🌡️";
    $("wbTemp").textContent=w.temp_f!=null?Math.round(w.temp_f):"--";
    $("wbHum").textContent=w.humidity??"--";
    $("wbWind").textContent=w.wind_mph!=null?Math.round(w.wind_mph):"--";
    $("wbUV").textContent=w.uv_index??"--";
    const aqEl=$("wbAqi"),aqi=aq.aqi??"--";
    aqEl.textContent=aqi; aqEl.className="wb-val aqi-val";
    if(typeof aqi==="number"){ if(aqi>150)aqEl.classList.add("aqi-bad"); else if(aqi>100)aqEl.classList.add("aqi-warn"); }
    $("wbAqiCat").textContent=aq.category||"--";
    $("wbPm25").textContent=aq.pm25??"--";
    $("wbAdvice").textContent=aq.advice||"";
  } catch { $("wbCity").textContent=city; $("wbDesc").textContent="Weather unavailable"; }
}

// ── Alerts ────────────────────────────────────────────────────────
async function loadAlerts(){
  try {
    const data=await API.alerts(profileCity());
    const badge=$("alertBadge");
    if(data.total>0){ badge.textContent=data.total; badge.style.display="inline-flex";
      data.critical_count>0?badge.classList.add("badge-crit"):badge.classList.remove("badge-crit");
    } else badge.style.display="none";
    const bar=$("alertBar");
    if(bar) bar.innerHTML=data.all_clear
      ?`<span class="alert-pill pill-ok">✅ All systems normal — ${S.city||"city"}</span>`
      :[data.critical_count?`<span class="alert-pill pill-bad">🔴 ${data.critical_count} Critical</span>`:"",
        data.warning_count?`<span class="alert-pill pill-warn">🟡 ${data.warning_count} Warning</span>`:""].join("");
    const panel=$("alertPanel"),header=$("alertsHeader");
    if(panel&&header){
      header.innerHTML=`
        <div class="alert-summary-card asc-critical"><div class="asc-num">${data.critical_count}</div><div class="asc-label">Critical</div></div>
        <div class="alert-summary-card asc-warning"><div class="asc-num">${data.warning_count}</div><div class="asc-label">Warning</div></div>
        <div class="alert-summary-card asc-ok"><div class="asc-num">${data.all_clear?"✓":"0"}</div><div class="asc-label">${data.all_clear?"All Clear":"OK"}</div></div>`;
      const SEV={critical:{cls:"alert-critical",emoji:"🔴"},warning:{cls:"alert-warning",emoji:"🟡"}};
      panel.innerHTML=data.all_clear
        ?`<div class="alert-item alert-ok"><span class="alert-sev">✅</span><div class="alert-body"><div class="alert-label">All Clear</div><div class="alert-message">No threshold breaches across all zones.</div></div></div>`
        :data.alerts.map(a=>{ const s=SEV[a.severity]||{cls:"",emoji:"ℹ️"};
            return `<div class="alert-item ${s.cls}"><span class="alert-sev">${s.emoji}</span><div class="alert-body"><div class="alert-label">${a.label} — ${a.zone}</div><div class="alert-message">${a.message}</div><div class="alert-meta">${a.metric}: ${a.value} (threshold: ${a.threshold}) · ${(a.time||"").substring(0,19)}</div></div></div>`;
          }).join("");
    }
  } catch {}
}

// ── KPI Row ───────────────────────────────────────────────────────
async function loadKPIs(){
  const row=$("kpiRow"); if(!row) return;
  try {
    const pc=profileCity();
    const [tr,en,aq,wa]=await Promise.all([API.trafficSummary("",pc),API.energySummary("",pc),API.airSummary("",pc),API.waterSummary("",pc)]);
    const kpis=[
      {color:"blue",icon:"🚦",label:"Avg Vehicles/hr",value:tr.avg_vehicles_per_hour?.toLocaleString()??"--",sub:`Peak: ${tr.peak_vehicles?.toLocaleString()??"--"} · ${tr.total_anomalies??0} anomalies`,badge:tr.avg_congestion_index>0.7?{text:"High Congestion",cls:"badge-down"}:tr.avg_congestion_index>0.4?{text:"Moderate",cls:"badge-warn"}:{text:"Normal",cls:"badge-up"}},
      {color:"yellow",icon:"⚡",label:"Grid Load",value:`${(en.avg_grid_load_pct??0).toFixed(1)}%`,sub:`Solar: ${en.solar_pct??0}% of demand`,badge:en.avg_grid_load_pct>90?{text:"Critical",cls:"badge-down"}:en.avg_grid_load_pct>75?{text:"High Load",cls:"badge-warn"}:{text:"Normal",cls:"badge-up"}},
      {color:aq.avg_aqi>150?"red":aq.avg_aqi>100?"yellow":"green",icon:"💨",label:"City AQI",value:aq.avg_aqi??"--",sub:`PM2.5: ${aq.avg_pm25??"--"} μg/m³ · ${aq.unhealthy_pct??0}% unhealthy hrs`,badge:{text:aq.category||"--",cls:aq.avg_aqi>150?"badge-down":aq.avg_aqi>100?"badge-warn":"badge-up"}},
      {color:"purple",icon:"💧",label:"Water Usage/hr",value:`${(wa.avg_usage_per_hour??0).toFixed(0)}L`,sub:`Pressure: ${wa.avg_pressure_bar??"--"} bar · Leak: ${wa.high_leak_risk_pct??0}%`,badge:wa.high_leak_risk_pct>20?{text:"⚠️ Leak Risk",cls:"badge-down"}:wa.avg_pressure_bar<3.5?{text:"Low Pressure",cls:"badge-warn"}:{text:"Normal",cls:"badge-up"}},
    ];
    row.innerHTML=kpis.map(k=>`<div class="kpi-card ${k.color}"><div class="kpi-header"><div class="kpi-icon">${k.icon}</div><span class="kpi-badge ${k.badge.cls}">${k.badge.text}</span></div><div class="kpi-value">${k.value}</div><div class="kpi-label">${k.label}</div><div class="kpi-sub">${k.sub}</div></div>`).join("");
  } catch {}
}

// ── Live Stream ───────────────────────────────────────────────────
let liveChart=null,liveLabels=[],liveValues=[];
function initLive(canvasId,color,label){
  liveLabels=[];liveValues=[];kill(canvasId);
  const ctx=$(canvasId); if(!ctx) return;
  liveChart=new Chart(ctx,{type:"line",data:{labels:liveLabels,datasets:[{label,data:liveValues,borderColor:color,backgroundColor:a(color,0.08),borderWidth:2,pointRadius:0,fill:true,tension:0.4}]},
    options:{...BASE_OPTS,animation:false,scales:{x:{...SCALE.x,display:false},y:{...SCALE.y}},plugins:{legend:{display:false}}}});
  reg[canvasId]=liveChart;
}
function pushLive(val,badgeId,label){
  const now=new Date().toLocaleTimeString();
  liveLabels.push(now);liveValues.push(val);
  if(liveLabels.length>60){liveLabels.shift();liveValues.shift();}
  if(liveChart){liveChart.data.labels=[...liveLabels];liveChart.data.datasets[0].data=[...liveValues];liveChart.data.datasets[0].label=label||"Value";liveChart.update("none");}
  const el=$(badgeId); if(el) el.textContent=val?.toFixed?val.toFixed(0):String(val);
}

// ── Page Loaders ──────────────────────────────────────────────────
async function loadPage(page){
  $("lastUpdated").textContent=new Date().toLocaleTimeString();
  const c=profileCity(),z=S.area;
  if(page==="overview")  await loadOverview(c,z);
  if(page==="traffic")   await loadTrafficPage(c,z);
  if(page==="energy")    await loadEnergyPage(c,z);
  if(page==="air")       await loadAirPage(c,z);
  if(page==="water")     await loadWaterPage(c,z);
  if(page==="forecast")  await loadForecastPage(c,z);
  if(page==="alerts")    await loadAlerts();
}

async function loadOverview(c,z){
  await Promise.all([loadKPIs(),loadAlerts()]);
  try { const bz=await API.trafficByZone(c); mkBar("energyBar",bz.map(r=>r.zone),[{label:"Avg Vehicles",data:bz.map(r=>r.avg_vehicles),backgroundColor:ZONE_COLORS.map(cl=>a(cl,0.75)),borderColor:ZONE_COLORS,borderWidth:1.5,borderRadius:5}]); } catch {}
  try { const bz=await API.airByZone(c); const colors=bz.map(r=>r.avg_aqi>150?PAL.red:r.avg_aqi>100?PAL.yellow:PAL.green); mkBar("aqiBar",bz.map(r=>r.zone),[{label:"AQI",data:bz.map(r=>r.avg_aqi),backgroundColor:colors.map(cl=>a(cl,0.75)),borderColor:colors,borderWidth:1.5,borderRadius:5}]); } catch {}
  initLive("liveTraffic",PAL.blue,"Vehicles/hr");
}
async function loadTrafficPage(c,z){
  try { const bz=await API.trafficByZone(c); mkBar("trafficSpeedBar",bz.map(r=>r.zone),[{label:"Avg Speed km/h",data:bz.map(r=>r.avg_speed),backgroundColor:ZONE_COLORS.map(cl=>a(cl,0.75)),borderColor:ZONE_COLORS,borderWidth:1.5,borderRadius:5}]); } catch {}
  try { const hp=await API.trafficHourly(z,c); mkLine("trafficHourly",hp.hours.map(h=>`${h}:00`),[{label:"Avg Vehicles",data:hp.values,borderColor:PAL.blue,backgroundColor:a(PAL.blue,0.08),borderWidth:2,fill:true,tension:0.4,pointRadius:2}]); } catch {}
  try { const cmp=await API.trafficCompare(z,c); $("trafficWowBadge").textContent=wowLabel(cmp.wow_pct); mkLine("trafficCompare",cmp.labels.filter((_,i)=>i%6===0),[{label:"This week",data:cmp.this_week.filter((_,i)=>i%6===0),borderColor:PAL.blue,backgroundColor:a(PAL.blue,0.08),borderWidth:2,fill:false,tension:0.3},{label:"Last week",data:cmp.last_week.filter((_,i)=>i%6===0),borderColor:PAL.purple,backgroundColor:"transparent",borderWidth:2,borderDash:[5,4],fill:false,tension:0.3}]); } catch {}
  initLive("trafficLive",PAL.blue,"Vehicles/hr");
}
async function loadEnergyPage(c,z){
  try { const bz=await API.energyByZone(c); mkBar("energyZoneBar",bz.map(r=>r.zone),[{label:"Avg kWh",data:bz.map(r=>r.avg_consumption_kwh),backgroundColor:ZONE_COLORS.map(cl=>a(cl,0.75)),borderColor:ZONE_COLORS,borderWidth:1.5,borderRadius:5}]); mkBar("solarBar",bz.map(r=>r.zone),[{label:"Solar %",data:bz.map(r=>r.solar_pct),backgroundColor:a(PAL.green,0.75),borderColor:PAL.green,borderWidth:1.5,borderRadius:5}]); } catch {}
  try { const cmp=await API.energyCompare(z,c); $("energyWowBadge").textContent=wowLabel(cmp.wow_pct); mkLine("energyCompare",cmp.labels.filter((_,i)=>i%6===0),[{label:"This week",data:cmp.this_week.filter((_,i)=>i%6===0),borderColor:PAL.orange,backgroundColor:a(PAL.orange,0.08),borderWidth:2,fill:false,tension:0.3},{label:"Last week",data:cmp.last_week.filter((_,i)=>i%6===0),borderColor:PAL.purple,backgroundColor:"transparent",borderWidth:2,borderDash:[5,4],fill:false,tension:0.3}]); } catch {}
  initLive("energyLive",PAL.orange,"Grid Load %");
}
async function loadAirPage(c,z){
  try { const bz=await API.airByZone(c); const colors=bz.map(r=>r.avg_aqi>150?PAL.red:r.avg_aqi>100?PAL.yellow:PAL.green); mkBar("airZoneBar",bz.map(r=>r.zone),[{label:"AQI",data:bz.map(r=>r.avg_aqi),backgroundColor:colors.map(cl=>a(cl,0.75)),borderColor:colors,borderWidth:1.5,borderRadius:5}]); mkBar("pm25Bar",bz.map(r=>r.zone),[{label:"PM2.5 μg/m³",data:bz.map(r=>r.avg_pm25),backgroundColor:ZONE_COLORS.map(cl=>a(cl,0.75)),borderColor:ZONE_COLORS,borderWidth:1.5,borderRadius:5}]); } catch {}
  try { const cmp=await API.airCompare(z,c); $("airWowBadge").textContent=wowLabel(cmp.wow_pct); mkLine("airCompare",cmp.labels.filter((_,i)=>i%6===0),[{label:"This week",data:cmp.this_week.filter((_,i)=>i%6===0),borderColor:PAL.cyan,backgroundColor:a(PAL.cyan,0.08),borderWidth:2,fill:false,tension:0.3},{label:"Last week",data:cmp.last_week.filter((_,i)=>i%6===0),borderColor:PAL.purple,backgroundColor:"transparent",borderWidth:2,borderDash:[5,4],fill:false,tension:0.3}]); } catch {}
  initLive("airLive",PAL.cyan,"AQI");
}
async function loadWaterPage(c,z){
  try { const bz=await API.waterByZone(c); mkBar("waterZoneBar",bz.map(r=>r.zone),[{label:"Avg L/hr",data:bz.map(r=>r.avg_usage_liters),backgroundColor:ZONE_COLORS.map(cl=>a(cl,0.75)),borderColor:ZONE_COLORS,borderWidth:1.5,borderRadius:5}]); mkBar("leakBar",bz.map(r=>r.zone),[{label:"High Leak Risk %",data:bz.map(r=>r.leak_risk_pct),backgroundColor:a(PAL.red,0.75),borderColor:PAL.red,borderWidth:1.5,borderRadius:5}]); } catch {}
  try { const cmp=await API.waterCompare(z,c); $("waterWowBadge").textContent=wowLabel(cmp.wow_pct); mkLine("waterCompare",cmp.labels.filter((_,i)=>i%6===0),[{label:"This week",data:cmp.this_week.filter((_,i)=>i%6===0),borderColor:PAL.cyan,backgroundColor:a(PAL.cyan,0.08),borderWidth:2,fill:false,tension:0.3},{label:"Last week",data:cmp.last_week.filter((_,i)=>i%6===0),borderColor:PAL.purple,backgroundColor:"transparent",borderWidth:2,borderDash:[5,4],fill:false,tension:0.3}]); } catch {}
  initLive("waterLive",PAL.cyan,"L/hr");
}
async function loadForecastPage(c,z){
  try {
    const fc=await API.forecastEnergy(z,c); const best=fc.best_model;
    $("mapeChips").innerHTML=[fc.arima_mape!=null?`<span class="chip ${best==="ARIMA"?"chip-green":"chip-blue"}">ARIMA MAPE: ${fc.arima_mape}%${best==="ARIMA"?" ✓":""}</span>`:"",fc.prophet_mape!=null?`<span class="chip ${best==="Prophet"?"chip-green":"chip-blue"}">Prophet MAPE: ${fc.prophet_mape}%${best==="Prophet"?" ✓":""}</span>`:""].join("");
    $("badge-forecast").textContent=`Best: ${best||"N/A"}`;
    if(fc.peak_time){ const el=$("peakAlert"); el.style.display="flex"; el.innerHTML=`⚡ Energy forecast peaks at <strong>${fc.peak_value} kWh</strong> around <strong>${fc.peak_time}</strong>`; }
    const labels=(fc.labels||[]).map(l=>l.substring(11,16));
    const datasets=[];
    if(fc.actual)  datasets.push({label:"Actual", data:fc.actual, borderColor:PAL.blue,  backgroundColor:a(PAL.blue,0.08), borderWidth:2,fill:true, tension:0.4,pointRadius:2});
    if(fc.arima)   datasets.push({label:"ARIMA",  data:fc.arima,  borderColor:PAL.orange,backgroundColor:"transparent",     borderWidth:2,fill:false,tension:0.3,pointRadius:0,borderDash:[5,4]});
    if(fc.prophet) datasets.push({label:"Prophet",data:fc.prophet,borderColor:PAL.purple,backgroundColor:"transparent",     borderWidth:2,fill:false,tension:0.3,pointRadius:0,borderDash:[3,3]});
    mkLine("forecastChart",labels,datasets);
  } catch(e){ console.warn("Forecast:",e); }
  try {
    const an=await API.anomalies(z,c);
    $("badge-anomaly").textContent=`${an.total_anomalies} anomalies (90d)`;
    $("anomalyMethod").textContent=`method: ${an.method}`;
    const labels=(an.labels||[]).map(l=>l.substring(11,16));
    const normal=an.values.map((v,i)=>an.anomaly_indices.includes(i)?null:v);
    const anomVals=an.values.map((v,i)=>an.anomaly_indices.includes(i)?v:null);
    mkLine("anomalyChart",labels,[{label:"Normal",data:normal,borderColor:PAL.blue,backgroundColor:a(PAL.blue,0.07),borderWidth:2,fill:true,tension:0.4,pointRadius:0,spanGaps:true},{label:"Anomaly",data:anomVals,borderColor:PAL.red,backgroundColor:a(PAL.red,0.6),borderWidth:0,fill:false,tension:0,pointRadius:5,showLine:false,spanGaps:false}]);
  } catch(e){ console.warn("Anomaly:",e); }
}

// ── Live Streaming ────────────────────────────────────────────────
let liveTimer=null;
function startLiveStream(){
  clearInterval(liveTimer);
  liveTimer=setInterval(async()=>{
    try { const tr=await API.trafficSummary("",profileCity()); const j=tr.avg_vehicles_per_hour*(1+(Math.random()-.5)*0.12); pushLive(Math.round(j),"badge-ov-traffic","Vehicles/hr"); pushLive(Math.round(j),"badge-traffic","Vehicles/hr"); } catch {}
    $("lastUpdated").textContent=new Date().toLocaleTimeString();
  },2000);
}

// ── Init ──────────────────────────────────────────────────────────
async function init(){
  const loader=$("loader");
  try { await initCountries(); startLiveStream(); }
  catch(e){ console.error("Init:",e); }
  finally { loader.classList.add("gone"); }
}
init();
