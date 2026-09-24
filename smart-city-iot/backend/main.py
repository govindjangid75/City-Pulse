"""
Smart City IoT Analytics v3 — Global Edition
Run: uvicorn backend.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.routes import traffic, energy, air_quality, water, forecast
from backend.routes.city import router as city_router
from backend.routes.alerts import router as alerts_router
from backend.routes.geo import router as geo_router

app = FastAPI(title="SmartCity IoT API — Global", version="3.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(traffic.router,     prefix="/api/traffic",     tags=["Traffic"])
app.include_router(energy.router,      prefix="/api/energy",      tags=["Energy"])
app.include_router(air_quality.router, prefix="/api/air-quality", tags=["Air Quality"])
app.include_router(water.router,       prefix="/api/water",       tags=["Water"])
app.include_router(forecast.router,    prefix="/api/forecast",    tags=["Forecast"])
app.include_router(city_router,                                    tags=["City"])
app.include_router(alerts_router,      prefix="/api/alerts",      tags=["Alerts"])
app.include_router(geo_router,                                     tags=["Geo"])

app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/")
def root(): return FileResponse("frontend/index.html")

@app.get("/health")
def health(): return {"status": "ok", "version": "3.0.0"}
