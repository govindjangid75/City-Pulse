from fastapi import APIRouter
from typing import Optional
import pandas as pd
from backend.services.data_loader import load_traffic, get_zones

router = APIRouter()

@router.get("/summary")
def summary(zone: Optional[str] = None, city: str = "New York"):
    df = load_traffic(city)
    if zone: df = df[df["zone"] == zone]
    return {
        "avg_vehicles_per_hour": round(df["vehicle_count"].mean(), 1),
        "peak_vehicles": int(df["vehicle_count"].max()),
        "avg_speed_kmh": round(df["avg_speed_kmh"].mean(), 1),
        "avg_congestion_index": round(df["congestion_index"].mean(), 3),
        "total_anomalies": int(df["is_anomaly"].sum()),
    }

@router.get("/timeseries")
def timeseries(zone: Optional[str] = None, days: int = 7, city: str = "New York"):
    df = load_traffic(city)
    if zone: df = df[df["zone"] == zone]
    df = df.sort_values("timestamp").tail(days * 24)
    h = df.groupby(pd.Grouper(key="timestamp", freq="h"))["vehicle_count"].mean().reset_index()
    return {"labels": h["timestamp"].dt.strftime("%Y-%m-%d %H:%M").tolist(),
            "values": h["vehicle_count"].round(1).tolist()}

@router.get("/by-zone")
def by_zone(city: str = "New York"):
    df = load_traffic(city)
    return [{"zone": z,
             "avg_vehicles": round(df[df["zone"]==z]["vehicle_count"].mean(), 1),
             "avg_speed":    round(df[df["zone"]==z]["avg_speed_kmh"].mean(), 1),
             "congestion":   round(df[df["zone"]==z]["congestion_index"].mean(), 3)}
            for z in get_zones(city)]

@router.get("/hourly-pattern")
def hourly(zone: Optional[str] = None, city: str = "New York"):
    df = load_traffic(city)
    if zone: df = df[df["zone"] == zone]
    df["hour"] = df["timestamp"].dt.hour
    pat = df.groupby("hour")["vehicle_count"].mean().round(1)
    return {"hours": list(range(24)), "values": pat.tolist()}

@router.get("/compare")
def compare(zone: Optional[str] = None, city: str = "New York"):
    df = load_traffic(city)
    if zone: df = df[df["zone"] == zone]
    h = df.sort_values("timestamp").groupby(
        pd.Grouper(key="timestamp", freq="h"))["vehicle_count"].mean().dropna()
    tw = h.iloc[-168:].round(1).tolist()
    lw = h.iloc[-336:-168].round(1).tolist()
    pct = round((sum(tw)/max(sum(lw),1)-1)*100, 1) if lw else 0
    return {"labels": [f"Day {i//24+1} {i%24:02d}h" for i in range(168)],
            "this_week": tw, "last_week": lw, "wow_pct": pct}

@router.get("/zones")
def zones(city: str = "New York"):
    return {"zones": get_zones(city)}
