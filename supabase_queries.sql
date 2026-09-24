-- ==============================================================================
-- CityPulse — Supabase Production Database Setup & Seed Queries
-- AmiHacks Track B: Industry / Open Innovation
-- Run these queries in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CREATE TABLES & EXTENSIONS
-- ------------------------------------------------------------------------------

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: Civic Events (weather, transit, 311, sensor telemetry)
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    zone TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL CHECK (source IN ('weather', 'transit', '311', 'manual')),
    type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for sliding-window spatial & temporal correlation queries
CREATE INDEX IF NOT EXISTS idx_events_zone_timestamp 
ON public.events (zone, timestamp DESC);

-- Table: User Profiles (Linked directly to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'analyst', 'responder')),
    primary_zone TEXT NOT NULL DEFAULT 'zone-1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public/anon) to read civic events
DROP POLICY IF EXISTS "Public events are viewable by all users" ON public.events;
CREATE POLICY "Public events are viewable by all users" 
ON public.events FOR SELECT USING (true);

-- Allow authenticated users to report/insert civic events
DROP POLICY IF EXISTS "Authenticated users can report civic events" ON public.events;
CREATE POLICY "Authenticated users can report civic events" 
ON public.events FOR INSERT WITH CHECK (true);

-- Allow everyone to read profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- Users can update only their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 3. AUTOMATIC PROFILE TRIGGER ON SUPABASE AUTH SIGNUP
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, primary_zone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen'),
    COALESCE(NEW.raw_user_meta_data->>'primary_zone', 'zone-1')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    primary_zone = EXCLUDED.primary_zone,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. ENABLE SUPABASE REALTIME STREAM
-- ------------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 5. SEED INITIAL HACKATHON SAMPLE DATA (Instant Dashboard Telemetry)
-- ------------------------------------------------------------------------------

INSERT INTO public.events (id, zone, timestamp, source, type, severity, payload)
VALUES
  -- Zone 3: Major Storm & Correlation Scenario (Flash Flood + Transit Suspension + Flooding Complaints)
  ('evt_weather_z3_01', 'zone-3', NOW() - INTERVAL '25 minutes', 'weather', 'flash_flood_warning', 'high', '{"wind_mph": 48, "precip_in_hr": 2.4, "headline": "Flash Flood Warning across Metro Core"}'),
  ('evt_transit_z3_01', 'zone-3', NOW() - INTERVAL '20 minutes', 'transit', 'subway_suspension', 'high', '{"line": "Blue Line Metro", "delay_min": 45, "cause": "Track flooding at Central Station"}'),
  ('evt_311_z3_01', 'zone-3', NOW() - INTERVAL '15 minutes', '311', 'street_flooding', 'high', '{"address": "5th & Main St", "category": "drainage", "reported_by": "Resident"}'),
  ('evt_311_z3_02', 'zone-3', NOW() - INTERVAL '12 minutes', '311', 'manhole_overflow', 'medium', '{"address": "Station Plaza West", "category": "sanitation"}'),
  ('evt_311_z3_03', 'zone-3', NOW() - INTERVAL '8 minutes', '311', 'traffic_signal_outage', 'medium', '{"address": "Market St & 4th Ave", "category": "traffic_lights"}'),

  -- Zone 2: Elevated Rush Hour Transit Delays
  ('evt_transit_z2_01', 'zone-2', NOW() - INTERVAL '18 minutes', 'transit', 'bus_delay', 'medium', '{"line": "Express Route 42", "delay_min": 18, "cause": "Corridor congestion"}'),
  ('evt_311_z2_01', 'zone-2', NOW() - INTERVAL '10 minutes', '311', 'pothole_hazard', 'low', '{"address": "Riverfront Way", "category": "roads"}'),

  -- Zone 1: Moderate Weather Advisory
  ('evt_weather_z1_01', 'zone-1', NOW() - INTERVAL '22 minutes', 'weather', 'high_wind_advisory', 'medium', '{"wind_mph": 34, "precip_in_hr": 0.4, "headline": "Wind Advisory for North District"}'),
  ('evt_311_z1_01', 'zone-1', NOW() - INTERVAL '14 minutes', '311', 'fallen_tree_branch', 'medium', '{"address": "Highland Park Blvd", "category": "parks"}'),

  -- Zone 4: Calm / Baseline Activity
  ('evt_weather_z4_01', 'zone-4', NOW() - INTERVAL '30 minutes', 'weather', 'clear_skies', 'low', '{"temp_f": 72, "humidity": 45, "headline": "Calm conditions"}'),
  ('evt_transit_z4_01', 'zone-4', NOW() - INTERVAL '28 minutes', 'transit', 'on_schedule', 'low', '{"line": "South Rail", "delay_min": 0}')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. VERIFICATION QUERIES (Run to check your data)
-- ------------------------------------------------------------------------------

-- Check all active events in the last 60-minute rolling window:
SELECT zone, source, type, severity, timestamp, payload 
FROM public.events 
WHERE timestamp >= NOW() - INTERVAL '60 minutes'
ORDER BY timestamp DESC;

-- Check events count per zone:
SELECT zone, COUNT(*) as total_events, 
       COUNT(*) FILTER (WHERE severity = 'high') as high_severity_count
FROM public.events 
GROUP BY zone 
ORDER BY zone;
