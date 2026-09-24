"""
Database Seed Script.
Loads sample data from sample_data/ (weather.json, transit_delays.json, incidents_311.json)
into the SQLite database.
Usage:
    python backend/scripts/seed.py --from sample_data
"""
import os
import sys
import json
import argparse
from pathlib import Path

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent.parent))

from backend.app.database import get_db_connection, init_db

def seed_database(sample_dir: str):
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    files = ["weather.json", "transit_delays.json", "incidents_311.json"]
    total_inserted = 0
    
    for filename in files:
        file_path = os.path.join(sample_dir, filename)
        if not os.path.exists(file_path):
            print(f"Skipping {filename} (not found at {file_path})")
            continue
            
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            source = data.get("source", "unknown")
            events = data.get("events", [])
            
            for event in events:
                cursor.execute("""
                INSERT OR REPLACE INTO events (id, zone, timestamp, source, type, severity, payload)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    event["id"],
                    event["zone"],
                    event["timestamp"],
                    source,
                    event["type"],
                    event["severity"],
                    json.dumps(event.get("payload", {}))
                ))
                total_inserted += 1
                
    conn.commit()
    conn.close()
    print(f"Successfully seeded {total_inserted} events from {sample_dir}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed CityPulse database")
    parser.add_argument("--from-dir", default="sample_data", help="Directory with JSON seeds")
    args = parser.parse_args()
    seed_database(args.from_dir)
