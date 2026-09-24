"""
city.py — Live weather/AQI via Open-Meteo (no API key).
          Global city detection and nearest-profile matching.
"""

import httpx
from fastapi import APIRouter, HTTPException
from backend.services.city_profiles import get_profile, find_nearest_city, get_all_cities, CITY_COORDS

router = APIRouter(prefix="/api/city", tags=["City"])

WMO = {
    0:"Clear sky",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",
    45:"Foggy",48:"Icy fog",51:"Light drizzle",53:"Drizzle",55:"Heavy drizzle",
    61:"Light rain",63:"Rain",65:"Heavy rain",71:"Light snow",73:"Snow",75:"Heavy snow",
    80:"Rain showers",81:"Showers",82:"Violent showers",95:"Thunderstorm",
    96:"Thunderstorm + hail",99:"Severe thunderstorm",
}
WMO_EMOJI = {
    0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",
    51:"🌦️",53:"🌧️",55:"🌧️",61:"🌧️",63:"🌧️",65:"🌧️",
    71:"❄️",73:"❄️",75:"❄️",80:"🌦️",81:"🌧️",82:"⛈️",
    95:"⛈️",96:"⛈️",99:"⛈️",
}

async def _coords(city: str):
    if city in CITY_COORDS:
        return CITY_COORDS[city]
    async with httpx.AsyncClient(timeout=8) as c:
        r = await c.get("https://geocoding-api.open-meteo.com/v1/search",
                        params={"name": city, "count": 1, "language": "en", "format": "json"})
        d = r.json()
        if not d.get("results"):
            raise HTTPException(404, f"City '{city}' not found")
        res = d["results"][0]
        return res["latitude"], res["longitude"]

@router.get("/all")
def all_cities():
    return {"cities": get_all_cities()}

@router.get("/nearest")
def nearest(lat: float, lon: float):
    city = find_nearest_city(lat, lon)
    profile = get_profile(city)
    return {"city": city, "zones": profile["zones"], "region": profile["region"],
            "timezone": profile["timezone"]}

@router.get("/{city}")
async def city_data(city: str):
    try:
        lat, lon = await _coords(city)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))

    async with httpx.AsyncClient(timeout=12) as c:
        w_res, a_res = await c.get(
            "https://api.open-meteo.com/v1/forecast",
            params={"latitude":lat,"longitude":lon,
                    "current":"temperature_2m,apparent_temperature,relative_humidity_2m,"
                              "wind_speed_10m,precipitation,weather_code,cloud_cover,uv_index",
                    "hourly":"temperature_2m",
                    "forecast_days":1,"temperature_unit":"fahrenheit","wind_speed_unit":"mph"}
        ), await c.get(
            "https://air-quality-api.open-meteo.com/v1/air-quality",
            params={"latitude":lat,"longitude":lon,
                    "current":"us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone",
                    "hourly":"us_aqi","forecast_days":1}
        )

    w = w_res.json(); aq = a_res.json()
    cur = w.get("current", {}); aqi_cur = aq.get("current", {})
    code = cur.get("weather_code", 0)
    aqi_val = aqi_cur.get("us_aqi") or 0

    if   aqi_val <= 50:  aqi_cat, aqi_color, aqi_advice = "Good",                "green",  "Air quality is satisfactory."
    elif aqi_val <= 100: aqi_cat, aqi_color, aqi_advice = "Moderate",            "yellow", "Acceptable for most people."
    elif aqi_val <= 150: aqi_cat, aqi_color, aqi_advice = "Unhealthy (Sensitive)","orange","Sensitive groups should limit outdoor activity."
    elif aqi_val <= 200: aqi_cat, aqi_color, aqi_advice = "Unhealthy",           "red",    "Wear a mask outdoors."
    elif aqi_val <= 300: aqi_cat, aqi_color, aqi_advice = "Very Unhealthy",      "purple", "Avoid outdoor activity."
    else:                aqi_cat, aqi_color, aqi_advice = "Hazardous",           "maroon", "Stay indoors."

    # Nearest profile city for IoT data
    matched_city = find_nearest_city(lat, lon)
    profile = get_profile(matched_city)

    return {
        "city": city,
        "matched_profile_city": matched_city,
        "lat": lat, "lon": lon,
        "zones": profile["zones"],
        "region": profile["region"],
        "timezone": profile["timezone"],
        "weather": {
            "temp_f":        cur.get("temperature_2m"),
            "feels_like_f":  cur.get("apparent_temperature"),
            "humidity":      cur.get("relative_humidity_2m"),
            "wind_mph":      cur.get("wind_speed_10m"),
            "precipitation": cur.get("precipitation"),
            "cloud_cover":   cur.get("cloud_cover"),
            "uv_index":      cur.get("uv_index"),
            "description":   WMO.get(code, "Unknown"),
            "emoji":         WMO_EMOJI.get(code, "🌡️"),
            "code":          code,
        },
        "air_quality": {
            "aqi":     aqi_val,
            "category": aqi_cat,
            "color":   aqi_color,
            "advice":  aqi_advice,
            "pm25":    aqi_cur.get("pm2_5"),
            "pm10":    aqi_cur.get("pm10"),
            "co":      aqi_cur.get("carbon_monoxide"),
            "no2":     aqi_cur.get("nitrogen_dioxide"),
            "ozone":   aqi_cur.get("ozone"),
        },
        "hourly_temp":   w.get("hourly",{}).get("temperature_2m",[])[:24],
        "hourly_labels": w.get("hourly",{}).get("time",[])[:24],
        "hourly_aqi":    aq.get("hourly",{}).get("us_aqi",[])[:24],
    }
