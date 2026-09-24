from fastapi import APIRouter
from typing import Optional
import pandas as pd
from backend.services.data_loader import load_energy, get_zones

router = APIRouter()

@router.get("/summary")
def summary(zone: Optional[str] = None, city: str = "New York"):
    df = load_energy(city)
    if zone: df = df[df["zone"] == zone]
    total = df["consumption_kwh"].sum()
    solar = df["solar_generation_kwh"].sum()
    return {
        "total_consumption_kwh": round(total, 1),
        "total_solar_kwh": round(solar, 1),
        "solar_pct": round(solar/total*100, 1) if total > 0 else 0,
        "avg_grid_load_pct": round(df["grid_load_pct"].mean(), 1),
        "peak_consumption_kwh": round(df["consumption_kwh"].max(), 1),
    }

@router.get("/timeseries")
def timeseries(zone: Optional[str] = None, days: int = 7, city: str = "New York"):
    df = load_energy(city)
    if zone: df = df[df["zone"] == zone]
    df = df.sort_values("timestamp").tail(days * 24)
    return {"labels": df["timestamp"].dt.strftime("%Y-%m-%d %H:%M").tolist(),
            "consumption": df["consumption_kwh"].round(1).tolist(),
            "solar": df["solar_generation_kwh"].round(1).tolist()}

@router.get("/by-zone")
def by_zone(city: str = "New York"):
    df = load_energy(city)
    result = []
    for z in get_zones(city):
        zd = df[df["zone"]==z]
        t, s = zd["consumption_kwh"].sum(), zd["solar_generation_kwh"].sum()
        result.append({"zone": z, "avg_consumption_kwh": round(zd["consumption_kwh"].mean(),1),
                        "solar_pct": round(s/t*100,1) if t>0 else 0,
                        "avg_grid_load": round(zd["grid_load_pct"].mean(),1)})
    return result

@router.get("/compare")
def compare(zone: Optional[str] = None, city: str = "New York"):
    df = load_energy(city)
    if zone: df = df[df["zone"] == zone]
    h = df.sort_values("timestamp").groupby(
        pd.Grouper(key="timestamp", freq="h"))["consumption_kwh"].mean().dropna()
    tw = h.iloc[-168:].round(2).tolist()
    lw = h.iloc[-336:-168].round(2).tolist()
    pct = round((sum(tw)/max(sum(lw),1)-1)*100, 1) if lw else 0
    return {"labels": [f"Day {i//24+1} {i%24:02d}h" for i in range(168)],
            "this_week": tw, "last_week": lw, "wow_pct": pct}
