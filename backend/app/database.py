"""
SQLite Database connection and initialization for CityPulse.
Stores normalized CivicEvents indexed on (zone, timestamp).
"""
import sqlite3
import os
import hashlib
import secrets
from datetime import datetime, timezone
from typing import Generator

from .config import settings

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "citypulse.db")

_supabase_client = None

def get_supabase_client():
    """Return an active Supabase client instance if configured in .env."""
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client
    
    if settings.SUPABASE_URL and (settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY):
        try:
            from supabase import create_client
            key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
            _supabase_client = create_client(settings.SUPABASE_URL, key)
            return _supabase_client
        except Exception as e:
            print(f"[Supabase] Client initialization notice: {e}")
            return None
    return None

def sync_event_to_supabase(event_data: dict):
    """Mirror a single event to the Supabase cloud table."""
    sync_events_to_supabase([event_data])

def sync_events_to_supabase(events_list: list):
    """Batch mirror events to the Supabase cloud table in a single HTTP request."""
    if not events_list:
        return
    client = get_supabase_client()
    if client:
        try:
            client.table("events").upsert(events_list).execute()
        except Exception as e:
            pass

def hash_password(password: str, salt: str = None) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256 with a random salt."""
    if not salt:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}:{key.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    """Verify a plain password against the stored salt:hash string."""
    try:
        salt, key_hex = hashed.split(":", 1)
        expected = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
        return secrets.compare_digest(expected, key_hex)
    except Exception:
        return False

def get_db_connection() -> sqlite3.Connection:
    """Return a connection to the SQLite database with row_factory configured."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize SQLite tables, users, and required indexes."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        zone TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        source TEXT NOT NULL,
        type TEXT NOT NULL,
        severity TEXT NOT NULL,
        payload TEXT NOT NULL
    );
    """)
    
    # Crucial index for rolling window temporal and spatial queries
    cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_events_zone_timestamp 
    ON events (zone, timestamp DESC);
    """)

    # Users and Civic Authentication table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        hashed_password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'citizen',
        primary_zone TEXT DEFAULT 'zone-1',
        created_at TEXT NOT NULL
    );
    """)

    # Seed default demonstration accounts if empty
    cursor.execute("SELECT COUNT(*) as cnt FROM users")
    if cursor.fetchone()["cnt"] == 0:
        now_iso = datetime.now(timezone.utc).isoformat()
        demo_accounts = [
            ("usr_citizen_demo", "citizen@citypulse.org", "Maya Lin", hash_password("citizen123"), "citizen", "zone-1", now_iso),
            ("usr_analyst_demo", "analyst@citypulse.gov", "David Vance", hash_password("analyst123"), "analyst", "zone-3", now_iso),
            ("usr_ops_demo", "ops@citypulse.gov", "Capt. Sarah Chen", hash_password("dispatch123"), "responder", "zone-2", now_iso),
        ]
        cursor.executemany("""
        INSERT INTO users (id, email, full_name, hashed_password, role, primary_zone, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, demo_accounts)

    conn.commit()
    conn.close()

