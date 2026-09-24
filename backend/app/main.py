"""
CityPulse FastAPI Main Application Entrypoint.
Initializes database, CORS, router endpoints, WebSocket, and background scheduler.
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import init_db
from .api import router, ws_manager

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="The Live Civic Health Dashboard API — AmiHacks",
    version="0.1.0"
)

# CORS middleware for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()

app.include_router(router, prefix=settings.API_V1_STR)

@app.websocket("/ws/zones")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep-alive loop or incoming client commands (e.g. zone subscribe)
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
