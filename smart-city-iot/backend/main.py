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

# CityPulse Intelligence Routers
from backend.routes.civic_health import router as civic_health_router
from backend.routes.events import router as events_router
from backend.routes.intelligence import router as intelligence_router
from backend.routes.reports import router as reports_router
from backend.routes.operations import router as operations_router
from backend.routes.neighborhoods import router as neighborhoods_router
from backend.routes.sources import router as sources_router
from backend.routes.replay import router as replay_router
from backend.routes.ai_analyst import router as ai_analyst_router
from backend.routes.demo import router as demo_router

app = FastAPI(title="CityPulse: The Live Civic Health & Intelligence Platform", version="4.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Existing Preserved IoT Routers
app.include_router(traffic.router,     prefix="/api/traffic",     tags=["Traffic"])
app.include_router(energy.router,      prefix="/api/energy",      tags=["Energy"])
app.include_router(air_quality.router, prefix="/api/air-quality", tags=["Air Quality"])
app.include_router(water.router,       prefix="/api/water",       tags=["Water"])
app.include_router(forecast.router,    prefix="/api/forecast",    tags=["Forecast"])
app.include_router(city_router,                                   tags=["City"])
app.include_router(alerts_router,      prefix="/api/alerts",      tags=["Alerts"])
app.include_router(geo_router,                                    tags=["Geo"])

# CityPulse Intelligence Routers
app.include_router(civic_health_router,                           tags=["Civic Health"])
app.include_router(events_router,                                 tags=["Civic Events"])
app.include_router(intelligence_router,                           tags=["Intelligence"])
app.include_router(reports_router,                                tags=["Citizen Reports"])
app.include_router(operations_router,                             tags=["Operations Command"])
app.include_router(neighborhoods_router,                          tags=["Neighborhoods"])
app.include_router(sources_router,                                tags=["Data Sources"])
app.include_router(replay_router,                                 tags=["Historical Replay"])
app.include_router(ai_analyst_router,                             tags=["AI Analyst"])
app.include_router(demo_router,                                   tags=["Demo Controller"])

app.mount("/static", StaticFiles(directory="frontend"), name="static")

@app.get("/")
def root(): return FileResponse("frontend/index.html")

@app.get("/health")
def health(): return {"status": "ok", "platform": "CityPulse", "version": "4.0.0"}

