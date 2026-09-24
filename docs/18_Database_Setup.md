# Database Setup Guide
## CityPulse: SQLite Initialization, Seeding, and Verification

---

## 1. Quick Setup & Initialization

CityPulse uses an embedded SQLite database (`backend/citypulse.db`). Initialization is automated on backend startup via `backend/app/database.py`.

### 1.1 Programmatic Initialization
When `uvicorn app.main:app` starts, the `@app.on_event("startup")` hook calls `init_db()`. This executes:
- Table creation for `events`.
- Composite indexing for `(zone, timestamp DESC)`.

### 1.2 Manual Seeding via CLI
To seed the database with the pre-configured storm correlation scenario:

```bash
cd backend
python scripts/seed.py --from-dir ../sample_data
```

Expected output:
```
Successfully seeded 17 events from ../sample_data.
```

---

## 2. Inspecting the Database

You can inspect the generated SQLite database using standard tools (`sqlite3` CLI, DB Browser for SQLite, or VS Code SQLite extensions).

### 2.1 Using `sqlite3` CLI
```bash
sqlite3 backend/citypulse.db

-- Show schema
.schema events

-- Check seeded record counts by source
SELECT source, COUNT(*) FROM events GROUP BY source;

-- Verify Zone 3 events in the scenario
SELECT id, timestamp, source, type, severity 
FROM events 
WHERE zone = 'zone-3' 
ORDER BY timestamp ASC;
```

---

## 3. Database Resetting
To wipe state and restore a clean slate:
```bash
# Delete existing SQLite file
rm backend/citypulse.db  # Linux/macOS
# On Windows PowerShell:
Remove-Item backend/citypulse.db -ErrorAction SilentlyContinue

# Re-seed fresh data
python backend/scripts/seed.py --from-dir sample_data
```
