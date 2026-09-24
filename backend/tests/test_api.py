"""
API integration tests for CityPulse.
Tests /zones, /zones/{id}, /health, /history/timeline, and simulation endpoints.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.ingestion import ingestion_manager

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_seed():
    ingestion_manager.reset_database_from_seed()

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "weather" in data["feeds"]
    assert "transit" in data["feeds"]
    assert "311" in data["feeds"]

def test_get_all_zones():
    response = client.get("/api/v1/zones?window_minutes=30")
    assert response.status_code == 200
    zones = response.json()
    assert len(zones) == 4
    zone_ids = [z["zone"] for z in zones]
    assert "zone-1" in zone_ids
    assert "zone-3" in zone_ids
    
    # In seeded scenario, zone-3 has severe flood storm + transit suspension + flooding 311 reports
    z3 = next(z for z in zones if z["zone"] == "zone-3")
    assert z3["status"] in ["alert", "elevated"]
    assert len(z3["correlations"]) >= 1
    # Epistemic honesty check
    for corr in z3["correlations"]:
        assert corr["confidence"] == "possible_link"
        assert "cause" not in corr["description"].lower()

def test_get_single_zone_detail():
    response = client.get("/api/v1/zones/zone-3")
    assert response.status_code == 200
    z3 = response.json()
    assert z3["zone"] == "zone-3"
    assert "summary" in z3
    assert len(z3["summary"]) > 5

def test_get_zone_events():
    response = client.get("/api/v1/zones/zone-3/events?window_minutes=60")
    assert response.status_code == 200
    events = response.json()
    assert len(events) >= 3

def test_simulation_toggle_feed_degradation():
    # Simulate weather feed delay
    response = client.post("/api/v1/simulate/toggle-feed", json={"feed": "weather", "status": "delayed"})
    assert response.status_code == 200
    assert response.json()["health"] == "delayed"
    
    # Zones endpoint should still work perfectly (graceful degradation)
    res_zones = client.get("/api/v1/zones")
    assert res_zones.status_code == 200
    data = res_zones.json()
    assert data[0]["feed_health"]["weather"]["status"] == "delayed"

def test_simulation_trigger_scenario():
    response = client.post("/api/v1/simulate/scenario", json={"scenario": "storm_flood", "zone": "zone-2"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "scenario_injected"
    assert data["events_count"] >= 3
