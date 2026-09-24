"""
alerts.py — Smart threshold-based alerts with natural language descriptions.
INFO / WARNING / CRITICAL tiers. Deduped and ranked by severity.
"""

from fastapi import APIRouter
from datetime import datetime
import numpy as np
from backend.services.data_loader import load_traffic, load_energy, load_air_quality, load_water, get_zones

router = APIRouter()

RULES = [
    # (dataset, column, operator, threshold, severity, short_label, message_template)
    ("air",     "aqi",              ">",  200, "critical", "Hazardous Air",
     "AQI is {val} in {zone} — hazardous. Stay indoors, wear N95 mask."),
    ("air",     "aqi",              ">",  150, "critical", "Unhealthy Air",
     "AQI is {val} in {zone} — unhealthy. Everyone should limit outdoor activity."),
    ("air",     "aqi",              ">",  100, "warning",  "Moderate Air Quality",
     "AQI is {val} in {zone}. Sensitive groups should reduce outdoor exertion."),
    ("air",     "pm25",             ">",   55, "critical", "High PM2.5",
     "PM2.5 is {val} μg/m³ in {zone} — well above safe limits (35 μg/m³)."),
    ("air",     "pm25",             ">",   35, "warning",  "Elevated PM2.5",
     "PM2.5 is {val} μg/m³ in {zone} — above WHO guideline of 15 μg/m³."),
    ("traffic", "congestion_index", ">", 0.90, "critical", "Severe Congestion",
     "Congestion index {val} in {zone} — roads at capacity. Expect major delays."),
    ("traffic", "congestion_index", ">", 0.70, "warning",  "High Congestion",
     "Congestion index {val} in {zone} — significant slowdowns expected."),
    ("water",   "pipe_leak_risk",   ">", 0.85, "critical", "Critical Leak Risk",
     "Pipe leak risk {val} in {zone} — maintenance crew dispatch recommended."),
    ("water",   "pipe_leak_risk",   ">", 0.70, "warning",  "Elevated Leak Risk",
     "Pipe leak risk {val} in {zone} — monitor pressure closely."),
    ("water",   "pressure_bar",     "<",  3.0, "critical", "Low Water Pressure",
     "Water pressure dropped to {val} bar in {zone} — possible main break."),
    ("energy",  "grid_load_pct",    ">",   95, "critical", "Grid Overload",
     "Grid load is {val}% in {zone} — overload risk. Demand response needed."),
    ("energy",  "grid_load_pct",    ">",   80, "warning",  "High Grid Load",
     "Grid load is {val}% in {zone} — approaching capacity limits."),
]

def _load(dataset, city):
    if dataset == "air":     return load_air_quality(city)
    if dataset == "traffic": return load_traffic(city)
    if dataset == "water":   return load_water(city)
    if dataset == "energy":  return load_energy(city)

def _check(df, col, op, threshold, severity, label, msg_tpl, zones):
    alerts = []
    # Use last 3 hours (recent readings)
    recent = df.sort_values("timestamp").groupby("zone").tail(3)
    for zone in zones:
        zd = recent[recent["zone"] == zone]
        if col not in zd.columns or zd.empty: continue
        avg_val = zd[col].mean()
        breached = avg_val > threshold if op == ">" else avg_val < threshold
        if breached:
            alerts.append({
                "severity": severity,
                "label": label,
                "zone": zone,
                "value": round(float(avg_val), 3),
                "threshold": threshold,
                "metric": col,
                "message": msg_tpl.format(val=round(float(avg_val), 2), zone=zone),
                "time": str(df["timestamp"].max()),
            })
    return alerts

@router.get("")
def get_alerts(city: str = "New York"):
    zones = get_zones(city)
    loaders = {
        "air":     _load("air",     city),
        "traffic": _load("traffic", city),
        "water":   _load("water",   city),
        "energy":  _load("energy",  city),
    }

    all_alerts = []
    for (dataset, col, op, thr, sev, label, msg) in RULES:
        try:
            df = loaders[dataset]
            all_alerts += _check(df, col, op, thr, sev, label, msg, zones)
        except Exception:
            pass

    # Deduplicate: keep most severe per (label, zone)
    seen = {}
    sev_rank = {"critical": 0, "warning": 1, "info": 2}
    for a in all_alerts:
        key = (a["label"], a["zone"])
        if key not in seen or sev_rank[a["severity"]] < sev_rank[seen[key]["severity"]]:
            seen[key] = a

    final = sorted(seen.values(), key=lambda x: (sev_rank[x["severity"]], x["zone"]))

    return {
        "alerts": final,
        "critical_count": sum(1 for a in final if a["severity"] == "critical"),
        "warning_count":  sum(1 for a in final if a["severity"] == "warning"),
        "total": len(final),
        "city": city,
        "all_clear": len(final) == 0,
        "checked_at": datetime.utcnow().isoformat() + "Z",
    }
