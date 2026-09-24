"""
CityPulse FastAPI Main Application Entrypoint.
Initializes database, CORS, router endpoints, WebSocket, and background scheduler.
"""
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import init_db, get_db_connection
from .api import router, ws_manager
from .api.auth import router as auth_router
from .services.ingestion import ingestion_manager

async def periodic_ingestion_worker():
    """Background task running occasional ingestion sweeps."""
    while True:
        try:
            await asyncio.sleep(60)  # Polling cycle
            await ingestion_manager.run_ingestion_cycle()
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"[Worker] Ingestion sweep error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB and initial seed if empty
    init_db()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as cnt FROM events")
    cnt = cursor.fetchone()["cnt"]
    conn.close()
    
    if cnt == 0:
        print("[Startup] Seeding database from sample_data...")
        ingestion_manager.reset_database_from_seed()
    
    # Start background polling worker
    worker_task = asyncio.create_task(periodic_ingestion_worker())
    yield
    # Shutdown
    worker_task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="The Live Civic Health Dashboard API — AmiHacks 2026",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix=settings.API_V1_STR)

@app.websocket("/ws/zones")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Send initial confirmation
        await websocket.send_json({"type": "CONNECTED", "message": "Connected to CityPulse real-time stream."})
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Serve Frontend static build if present
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(frontend_dist, "index.html"))

    @app.get("/{full_path:path}")
    async def serve_frontend_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("ws"):
            return None
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
