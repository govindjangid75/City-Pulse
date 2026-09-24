import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db

@pytest.fixture(autouse=True)
def setup_db():
    init_db()

def test_demo_users_endpoint():
    client = TestClient(app)
    response = client.get("/api/v1/auth/demo-users")
    assert response.status_code == 200
    demos = response.json()
    assert len(demos) >= 3
    emails = [d["email"] for d in demos]
    assert "citizen@citypulse.org" in emails

def test_login_demo_user():
    client = TestClient(app)
    response = client.post("/api/v1/auth/login", json={
        "email": "citizen@citypulse.org",
        "password": "citizen123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "citizen@citypulse.org"
    assert data["user"]["role"] == "citizen"

import uuid

def test_signup_new_user():
    client = TestClient(app)
    uid = uuid.uuid4().hex[:6]
    signup_payload = {
        "email": f"tester_{uid}@citypulse.org",
        "full_name": "Alex Mercer",
        "password": "securepassword123",
        "role": "analyst",
        "primary_zone": "zone-2"
    }
    response = client.post("/api/v1/auth/signup", json=signup_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == signup_payload["email"]
    assert data["user"]["full_name"] == "Alex Mercer"

    # Test duplicate email rejected
    dup_res = client.post("/api/v1/auth/signup", json=signup_payload)
    assert dup_res.status_code == 400
