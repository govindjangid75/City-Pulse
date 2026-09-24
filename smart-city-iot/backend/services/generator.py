"""
generator.py — City-aware synthetic IoT data generator.
Uses city climate profile to shape all 4 data domains realistically.
"""

import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta


def generate_all(data_dir: str, city: str = "New York"):
    from backend.services.city_profiles import get_profile
    p = get_profile(city)
    zones = p["zones"]

    os.makedirs(data_dir, exist_ok=True)
    seed = abs(hash(city)) % (2**31)
    rng = np.random.default_rng(seed)

    base_time = datetime.now() - timedelta(days=90)
    timestamps = [base_time + timedelta(hours=i) for i in range(90 * 24)]
    hours      = np.array([t.hour for t in timestamps])
    dow        = np.array([t.weekday() for t in timestamps])
    is_weekend = (dow >= 5).astype(float)

    S  = p["solar_index"]
    TD = p["traffic_density"]
    ES = p["energy_scale"]
    RF = p["rain_factor"]
    IA = p["industrial_aqi"]

    # ── Traffic ───────────────────────────────────────────────────────
    zone_traffic_base = [
        int(500 * TD),          # CBD / Downtown
        int(300 * TD * 0.60),   # Industrial
        int(200 * TD * 0.40),   # Residential
        int(400 * TD * 0.90),   # Airport
        int(150 * TD * 0.35),   # Port / Harbor
    ]
    rows = []
    for z, zone in enumerate(zones):
        base = zone_traffic_base[z]
        rush = (((hours>=7)&(hours<=9)).astype(float)*0.65 +
                ((hours>=17)&(hours<=19)).astype(float)*0.55)
        wknd = 1 - is_weekend * 0.3
        counts = (base * (1+rush) * wknd * (1+rng.normal(0,0.08,len(timestamps)))).clip(0)
        speeds = (65 - counts/max(base,1)*22 + rng.normal(0,3,len(timestamps))).clip(15,130)
        congestion = (counts/(base*1.6)).clip(0,1)
        anomaly = rng.random(len(timestamps)) < 0.018
        for i, t in enumerate(timestamps):
            rows.append({"timestamp":t,"zone":zone,
                         "vehicle_count":round(counts[i],1),
                         "avg_speed_kmh":round(speeds[i],1),
                         "congestion_index":round(congestion[i],3),
                         "is_anomaly":bool(anomaly[i])})
    pd.DataFrame(rows).to_csv(f"{data_dir}/traffic.csv", index=False)

    # ── Energy ────────────────────────────────────────────────────────
    zone_energy_base = [
        int(800  * ES),   # CBD
        int(2000 * ES),   # Industrial
        int(400  * ES),   # Residential
        int(1200 * ES),   # Airport
        int(600  * ES),   # Port
    ]
    rows = []
    for z, zone in enumerate(zones):
        base = zone_energy_base[z]
        biz = ((hours>=8)&(hours<=18)).astype(float)
        solar_curve = np.exp(-0.5*((hours-13)/2.8)**2)*(1-is_weekend*0.25)*S
        consumption = (base*(0.5+0.5*biz)*(1+rng.normal(0,0.06,len(timestamps)))).clip(0)
        solar = (base*0.32*solar_curve*(1+rng.normal(0,0.10,len(timestamps)))).clip(0)
        grid = ((consumption-solar)/max(base,1)*100).clip(0,150)
        for i, t in enumerate(timestamps):
            rows.append({"timestamp":t,"zone":zone,
                         "consumption_kwh":round(consumption[i],2),
                         "solar_generation_kwh":round(solar[i],2),
                         "grid_load_pct":round(grid[i],1)})
    pd.DataFrame(rows).to_csv(f"{data_dir}/energy.csv", index=False)

    # ── Air Quality ───────────────────────────────────────────────────
    rain_clean = RF * 28
    zone_aqi_base = [
        max(8, 62  + IA*0.6 - rain_clean),   # CBD
        max(8, 108 + IA     - rain_clean),    # Industrial
        max(8, 42            - rain_clean),   # Residential
        max(8, 78  + IA*0.4 - rain_clean),   # Airport
        max(8, 52  + IA*0.2 - rain_clean*0.7),# Port
    ]
    rows = []
    for z, zone in enumerate(zones):
        base_aqi = zone_aqi_base[z]
        rush_aqi = (((hours>=7)&(hours<=9)).astype(float)*16 +
                    ((hours>=17)&(hours<=19)).astype(float)*13)
        aqi  = (base_aqi + rush_aqi + rng.normal(0,8,len(timestamps))).clip(3,300)
        pm25 = (aqi*0.24 + rng.normal(0,2,len(timestamps))).clip(0)
        pm10 = (pm25*1.85 + rng.normal(0,3,len(timestamps))).clip(0)
        co2  = (400 + aqi*0.5 + rng.normal(0,15,len(timestamps))).clip(380)
        for i, t in enumerate(timestamps):
            rows.append({"timestamp":t,"zone":zone,
                         "aqi":round(aqi[i],1),"pm25":round(pm25[i],2),
                         "pm10":round(pm10[i],2),"co2_ppm":round(co2[i],1)})
    pd.DataFrame(rows).to_csv(f"{data_dir}/air_quality.csv", index=False)

    # ── Water ─────────────────────────────────────────────────────────
    zone_water_base = [500, 800, 350, 600, 400]
    rows = []
    for z, zone in enumerate(zones):
        base = zone_water_base[z]
        morn = ((hours>=6)&(hours<=9)).astype(float)*0.4
        eve  = ((hours>=18)&(hours<=21)).astype(float)*0.3
        usage    = (base*(1+morn+eve)*(1+rng.normal(0,0.07,len(timestamps)))).clip(0)
        pressure = (4.5+rng.normal(0,0.3,len(timestamps))).clip(2,8)
        leak     = rng.beta(1.5,8,len(timestamps)).clip(0,1)
        for i, t in enumerate(timestamps):
            rows.append({"timestamp":t,"zone":zone,
                         "usage_liters":round(usage[i],1),
                         "pressure_bar":round(pressure[i],2),
                         "pipe_leak_risk":round(leak[i],3)})
    pd.DataFrame(rows).to_csv(f"{data_dir}/water.csv", index=False)
    print(f"✅ Generated data for {city} ({len(zones)*len(timestamps)*4:,} records)")
