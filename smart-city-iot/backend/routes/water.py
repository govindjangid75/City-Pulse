from fastapi import APIRouter
from typing import Optional
import pandas as pd
from backend.services.data_loader import load_water, get_zones

router = APIRouter()

@router.get("/summary")
def summary(zone: Optional[str] = None, city: str = "New York"):
    df = load_water(city)
    if zone: df = df[df["zone"] == zone]
    return {
        "total_usage_liters": round(df["usage_liters"].sum(), 1),
        "avg_usage_per_hour": round(df["usage_liters"].mean(), 1),
        "avg_pressure_bar":   round(df["pressure_bar"].mean(), 2),
        "high_leak_risk_pct": round((df["pipe_leak_risk"]>0.7).mean()*100, 1),
    }

@router.get("/timeseries")
def timeseries(zone: Optional[str] = None, days: int = 7, city: str = "New York"):
    df = load_water(city)
    if zone: df = df[df["zone"] == zone]
    df = df.sort_values("timestamp").tail(days * 24)
    return {"labels": df["timestamp"].dt.strftime("%Y-%m-%d %H:%M").tolist(),
            "usage": df["usage_liters"].round(1).tolist(),
            "pressure": df["pressure_bar"].round(2).tolist()}

@router.get("/by-zone")
def by_zone(city: str = "New York"):
    df = load_water(city)
    return [{"zone":z,
             "avg_usage_liters": round(df[df["zone"]==z]["usage_liters"].mean(),1),
             "avg_pressure_bar": round(df[df["zone"]==z]["pressure_bar"].mean(),2),
             "leak_risk_pct":    round((df[df["zone"]==z]["pipe_leak_risk"]>0.7).mean()*100,1)}
            for z in get_zones(city)]

@router.get("/compare")
def compare(zone: Optional[str] = None, city: str = "New York"):
    df = load_water(city)
    if zone: df = df[df["zone"] == zone]
    h = df.sort_values("timestamp").groupby(
        pd.Grouper(key="timestamp", freq="h"))["usage_liters"].mean().dropna()
    tw = h.iloc[-168:].round(1).tolist()
    lw = h.iloc[-336:-168].round(1).tolist()
    pct = round((sum(tw)/max(sum(lw),1)-1)*100, 1) if lw else 0
    return {"labels": [f"Day {i//24+1} {i%24:02d}h" for i in range(168)],
            "this_week": tw, "last_week": lw, "wow_pct": pct}
