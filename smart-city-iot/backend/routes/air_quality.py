from fastapi import APIRouter
from typing import Optional
import pandas as pd
from backend.services.data_loader import load_air_quality, get_zones

router = APIRouter()

def _cat(aqi):
    if aqi <= 50:   return "Good",                  "green",  "Air quality is satisfactory."
    elif aqi <= 100: return "Moderate",              "yellow", "Acceptable, but some pollutants may affect sensitive people."
    elif aqi <= 150: return "Unhealthy (Sensitive)", "orange", "Sensitive groups should limit outdoor activity."
    elif aqi <= 200: return "Unhealthy",             "red",    "Everyone may begin to experience health effects. Wear a mask."
    elif aqi <= 300: return "Very Unhealthy",        "purple", "Health alert — avoid outdoor activity."
    else:            return "Hazardous",             "maroon", "Emergency conditions. Stay indoors."

@router.get("/summary")
def summary(zone: Optional[str] = None, city: str = "New York"):
    df = load_air_quality(city)
    if zone: df = df[df["zone"] == zone]
    avg = round(df["aqi"].mean(), 1)
    cat, color, advice = _cat(avg)
    return {"avg_aqi": avg, "max_aqi": round(df["aqi"].max(),1),
            "avg_pm25": round(df["pm25"].mean(),1),
            "avg_co2_ppm": round(df["co2_ppm"].mean(),1),
            "unhealthy_pct": round((df["aqi"]>100).mean()*100,1),
            "category": cat, "color": color, "advice": advice}

@router.get("/timeseries")
def timeseries(zone: Optional[str] = None, days: int = 7, city: str = "New York"):
    df = load_air_quality(city)
    if zone: df = df[df["zone"] == zone]
    df = df.sort_values("timestamp").tail(days * 24)
    h = df.groupby(pd.Grouper(key="timestamp", freq="h"))["aqi"].mean().reset_index()
    return {"labels": h["timestamp"].dt.strftime("%Y-%m-%d %H:%M").tolist(),
            "aqi": h["aqi"].round(1).tolist()}

@router.get("/by-zone")
def by_zone(city: str = "New York"):
    df = load_air_quality(city)
    result = []
    for z in get_zones(city):
        zd = df[df["zone"]==z]
        avg = round(zd["aqi"].mean(),1)
        cat, color, advice = _cat(avg)
        result.append({"zone":z,"avg_aqi":avg,"avg_pm25":round(zd["pm25"].mean(),1),
                        "category":cat,"color":color,"advice":advice})
    return result

@router.get("/compare")
def compare(zone: Optional[str] = None, city: str = "New York"):
    df = load_air_quality(city)
    if zone: df = df[df["zone"] == zone]
    h = df.sort_values("timestamp").groupby(
        pd.Grouper(key="timestamp", freq="h"))["aqi"].mean().dropna()
    tw = h.iloc[-168:].round(1).tolist()
    lw = h.iloc[-336:-168].round(1).tolist()
    pct = round((sum(tw)/max(sum(lw),1)-1)*100, 1) if lw else 0
    return {"labels": [f"Day {i//24+1} {i%24:02d}h" for i in range(168)],
            "this_week": tw, "last_week": lw, "wow_pct": pct}
