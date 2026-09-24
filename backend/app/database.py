"""
SQLite Database connection and initialization for CityPulse.
Stores normalized CivicEvents indexed on (zone, timestamp).
"""
import sqlite3
import os
from typing import Generator

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "citypulse.db")

def get_db_connection() -> sqlite3.Connection:
    """Return a connection to the SQLite database with row_factory configured."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize SQLite tables and required indexes."""
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
    
    conn.commit()
    conn.close()
