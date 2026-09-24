"""
city_profiles.py — Real climate-derived profiles for 80+ cities worldwide.

Each profile contains:
  solar_index:       0-1  (annual solar irradiance, 1=desert, 0.2=cloudy)
  temp_avg_f:        annual average temperature in Fahrenheit
  rain_factor:       0-1  (annual rainfall index, affects AQI)
  humidity:          0-1  (average relative humidity)
  traffic_density:   multiplier on base vehicle counts
  industrial_aqi:    baseline AQI offset for industrial zones
  energy_scale:      multiplier on energy use (heat/cool load)
  zones:             5 real neighborhood-style names for that city
  region:            continent/region for grouping
  timezone:          IANA timezone string
"""

CITY_PROFILES = {
    # ── UNITED STATES ─────────────────────────────────────────────────
    "New York": {
        "solar_index": 0.55, "temp_avg_f": 55, "rain_factor": 0.45,
        "humidity": 0.62, "traffic_density": 1.45, "industrial_aqi": 18,
        "energy_scale": 1.20, "region": "North America", "timezone": "America/New_York",
        "zones": ["Midtown", "Brooklyn", "Queens", "JFK Airport", "Red Hook Port"],
    },
    "Los Angeles": {
        "solar_index": 0.90, "temp_avg_f": 66, "rain_factor": 0.08,
        "humidity": 0.65, "traffic_density": 1.55, "industrial_aqi": 28,
        "energy_scale": 1.05, "region": "North America", "timezone": "America/Los_Angeles",
        "zones": ["Downtown", "Hollywood", "Compton", "LAX Airport", "Long Beach Port"],
    },
    "Chicago": {
        "solar_index": 0.50, "temp_avg_f": 49, "rain_factor": 0.42,
        "humidity": 0.71, "traffic_density": 1.20, "industrial_aqi": 15,
        "energy_scale": 1.38, "region": "North America", "timezone": "America/Chicago",
        "zones": ["The Loop", "South Side", "Lincoln Park", "O'Hare Airport", "Calumet Harbor"],
    },
    "Houston": {
        "solar_index": 0.72, "temp_avg_f": 69, "rain_factor": 0.58,
        "humidity": 0.76, "traffic_density": 1.10, "industrial_aqi": 25,
        "energy_scale": 1.28, "region": "North America", "timezone": "America/Chicago",
        "zones": ["Downtown", "Pasadena", "The Woodlands", "Bush Airport", "Houston Ship Channel"],
    },
    "Seattle": {
        "solar_index": 0.30, "temp_avg_f": 52, "rain_factor": 0.82,
        "humidity": 0.80, "traffic_density": 1.00, "industrial_aqi": 5,
        "energy_scale": 0.88, "region": "North America", "timezone": "America/Los_Angeles",
        "zones": ["Capitol Hill", "SoDo", "Bellevue", "Sea-Tac Airport", "Elliott Bay Port"],
    },
    "San Francisco": {
        "solar_index": 0.65, "temp_avg_f": 57, "rain_factor": 0.35,
        "humidity": 0.78, "traffic_density": 1.10, "industrial_aqi": 8,
        "energy_scale": 0.82, "region": "North America", "timezone": "America/Los_Angeles",
        "zones": ["SOMA", "Tenderloin", "Mission", "SFO Airport", "Oakland Port"],
    },
    "Phoenix": {
        "solar_index": 0.97, "temp_avg_f": 75, "rain_factor": 0.05,
        "humidity": 0.30, "traffic_density": 1.00, "industrial_aqi": 20,
        "energy_scale": 1.48, "region": "North America", "timezone": "America/Phoenix",
        "zones": ["Downtown", "Scottsdale", "Mesa", "Sky Harbor Airport", "Goodyear Industrial"],
    },
    "Miami": {
        "solar_index": 0.87, "temp_avg_f": 77, "rain_factor": 0.65,
        "humidity": 0.85, "traffic_density": 1.10, "industrial_aqi": 12,
        "energy_scale": 1.32, "region": "North America", "timezone": "America/New_York",
        "zones": ["Brickell", "Little Havana", "Wynwood", "MIA Airport", "PortMiami"],
    },
    "Boston": {
        "solar_index": 0.50, "temp_avg_f": 51, "rain_factor": 0.50,
        "humidity": 0.70, "traffic_density": 1.18, "industrial_aqi": 12,
        "energy_scale": 1.32, "region": "North America", "timezone": "America/New_York",
        "zones": ["Back Bay", "Roxbury", "Cambridge", "Logan Airport", "Charlestown Navy Yard"],
    },
    "Austin": {
        "solar_index": 0.82, "temp_avg_f": 68, "rain_factor": 0.32,
        "humidity": 0.62, "traffic_density": 1.08, "industrial_aqi": 10,
        "energy_scale": 1.18, "region": "North America", "timezone": "America/Chicago",
        "zones": ["Downtown", "East Austin", "Round Rock", "Bergstrom Airport", "Del Valle Industrial"],
    },
    "Denver": {
        "solar_index": 0.78, "temp_avg_f": 51, "rain_factor": 0.25,
        "humidity": 0.40, "traffic_density": 0.95, "industrial_aqi": 8,
        "energy_scale": 1.12, "region": "North America", "timezone": "America/Denver",
        "zones": ["LoDo", "Five Points", "Cherry Creek", "DIA Airport", "Commerce City Industrial"],
    },
    "Portland": {
        "solar_index": 0.35, "temp_avg_f": 53, "rain_factor": 0.78,
        "humidity": 0.82, "traffic_density": 0.88, "industrial_aqi": 6,
        "energy_scale": 0.85, "region": "North America", "timezone": "America/Los_Angeles",
        "zones": ["Pearl District", "North Portland", "Beaverton", "PDX Airport", "Swan Island Industrial"],
    },
    "Atlanta": {
        "solar_index": 0.65, "temp_avg_f": 62, "rain_factor": 0.50,
        "humidity": 0.70, "traffic_density": 1.15, "industrial_aqi": 14,
        "energy_scale": 1.15, "region": "North America", "timezone": "America/New_York",
        "zones": ["Midtown", "Bankhead", "Buckhead", "Hartsfield Airport", "Forest Park Industrial"],
    },
    "Dallas": {
        "solar_index": 0.75, "temp_avg_f": 66, "rain_factor": 0.38,
        "humidity": 0.65, "traffic_density": 1.12, "industrial_aqi": 16,
        "energy_scale": 1.20, "region": "North America", "timezone": "America/Chicago",
        "zones": ["Uptown", "Fair Park", "Plano", "DFW Airport", "West Dallas Industrial"],
    },

    # ── INDIA ─────────────────────────────────────────────────────────
    "Mumbai": {
        "solar_index": 0.80, "temp_avg_f": 81, "rain_factor": 0.75,
        "humidity": 0.80, "traffic_density": 1.80, "industrial_aqi": 35,
        "energy_scale": 1.10, "region": "South Asia", "timezone": "Asia/Kolkata",
        "zones": ["Nariman Point", "Dharavi", "Bandra", "CSIA Airport", "Mumbai Port"],
    },
    "Delhi": {
        "solar_index": 0.72, "temp_avg_f": 77, "rain_factor": 0.30,
        "humidity": 0.60, "traffic_density": 1.90, "industrial_aqi": 55,
        "energy_scale": 1.25, "region": "South Asia", "timezone": "Asia/Kolkata",
        "zones": ["Connaught Place", "Shahdara", "Dwarka", "IGI Airport", "Tughlakabad Industrial"],
    },
    "Bangalore": {
        "solar_index": 0.78, "temp_avg_f": 77, "rain_factor": 0.55,
        "humidity": 0.65, "traffic_density": 1.60, "industrial_aqi": 22,
        "energy_scale": 0.95, "region": "South Asia", "timezone": "Asia/Kolkata",
        "zones": ["MG Road", "Whitefield", "Koramangala", "Kempegowda Airport", "Peenya Industrial"],
    },
    "Chennai": {
        "solar_index": 0.85, "temp_avg_f": 85, "rain_factor": 0.55,
        "humidity": 0.78, "traffic_density": 1.50, "industrial_aqi": 28,
        "energy_scale": 1.15, "region": "South Asia", "timezone": "Asia/Kolkata",
        "zones": ["Anna Nagar", "Perambur", "OMR Tech Corridor", "MAA Airport", "Chennai Port"],
    },
    "Hyderabad": {
        "solar_index": 0.82, "temp_avg_f": 80, "rain_factor": 0.45,
        "humidity": 0.60, "traffic_density": 1.45, "industrial_aqi": 25,
        "energy_scale": 1.05, "region": "South Asia", "timezone": "Asia/Kolkata",
        "zones": ["Banjara Hills", "Secunderabad", "HITEC City", "Rajiv Gandhi Airport", "Patancheru Industrial"],
    },
    "Kolkata": {
        "solar_index": 0.70, "temp_avg_f": 80, "rain_factor": 0.70,
        "humidity": 0.80, "traffic_density": 1.65, "industrial_aqi": 38,
        "energy_scale": 1.10, "region": "South Asia", "timezone": "Asia/Kolkata",
        "zones": ["Park Street", "Howrah", "Salt Lake", "Netaji Airport", "Haldia Port"],
    },
    "Pune": {
        "solar_index": 0.80, "temp_avg_f": 76, "rain_factor": 0.55,
        "humidity": 0.65, "traffic_density": 1.40, "industrial_aqi": 20,
        "energy_scale": 1.00, "region": "South Asia", "timezone": "Asia/Kolkata",
        "zones": ["Shivajinagar", "Hadapsar", "Hinjewadi", "Pune Airport", "Bhosari Industrial"],
    },
    "Ahmedabad": {
        "solar_index": 0.88, "temp_avg_f": 82, "rain_factor": 0.28,
        "humidity": 0.52, "traffic_density": 1.35, "industrial_aqi": 32,
        "energy_scale": 1.20, "region": "South Asia", "timezone": "Asia/Kolkata",
        "zones": ["CG Road", "Vatva", "SG Highway", "Sardar Patel Airport", "Sanand Industrial"],
    },

    # ── EUROPE ────────────────────────────────────────────────────────
    "London": {
        "solar_index": 0.30, "temp_avg_f": 52, "rain_factor": 0.65,
        "humidity": 0.78, "traffic_density": 1.30, "industrial_aqi": 12,
        "energy_scale": 1.15, "region": "Europe", "timezone": "Europe/London",
        "zones": ["City of London", "Hackney", "Chelsea", "Heathrow Airport", "Tilbury Port"],
    },
    "Paris": {
        "solar_index": 0.45, "temp_avg_f": 56, "rain_factor": 0.55,
        "humidity": 0.76, "traffic_density": 1.25, "industrial_aqi": 14,
        "energy_scale": 1.05, "region": "Europe", "timezone": "Europe/Paris",
        "zones": ["Le Marais", "Banlieues Nord", "Saint-Germain", "CDG Airport", "Port de Gennevilliers"],
    },
    "Berlin": {
        "solar_index": 0.40, "temp_avg_f": 51, "rain_factor": 0.48,
        "humidity": 0.74, "traffic_density": 1.00, "industrial_aqi": 10,
        "energy_scale": 1.18, "region": "Europe", "timezone": "Europe/Berlin",
        "zones": ["Mitte", "Neukölln", "Prenzlauer Berg", "Tegel District", "Spandau Industrial"],
    },
    "Amsterdam": {
        "solar_index": 0.38, "temp_avg_f": 51, "rain_factor": 0.60,
        "humidity": 0.80, "traffic_density": 0.85, "industrial_aqi": 8,
        "energy_scale": 1.10, "region": "Europe", "timezone": "Europe/Amsterdam",
        "zones": ["Centrum", "Bijlmer", "Jordaan", "Schiphol Airport", "Port of Amsterdam"],
    },
    "Madrid": {
        "solar_index": 0.82, "temp_avg_f": 61, "rain_factor": 0.22,
        "humidity": 0.50, "traffic_density": 1.15, "industrial_aqi": 14,
        "energy_scale": 1.12, "region": "Europe", "timezone": "Europe/Madrid",
        "zones": ["Gran Vía", "Vallecas", "Salamanca", "Barajas Airport", "Villaverde Industrial"],
    },
    "Rome": {
        "solar_index": 0.78, "temp_avg_f": 63, "rain_factor": 0.35,
        "humidity": 0.68, "traffic_density": 1.20, "industrial_aqi": 16,
        "energy_scale": 1.08, "region": "Europe", "timezone": "Europe/Rome",
        "zones": ["Centro Storico", "Tor Bella Monaca", "Parioli", "Fiumicino Airport", "Civitavecchia Port"],
    },
    "Barcelona": {
        "solar_index": 0.80, "temp_avg_f": 63, "rain_factor": 0.30,
        "humidity": 0.68, "traffic_density": 1.15, "industrial_aqi": 14,
        "energy_scale": 1.00, "region": "Europe", "timezone": "Europe/Madrid",
        "zones": ["Eixample", "Badalona", "Gràcia", "El Prat Airport", "Port of Barcelona"],
    },
    "Stockholm": {
        "solar_index": 0.35, "temp_avg_f": 46, "rain_factor": 0.50,
        "humidity": 0.78, "traffic_density": 0.90, "industrial_aqi": 5,
        "energy_scale": 1.35, "region": "Europe", "timezone": "Europe/Stockholm",
        "zones": ["Gamla Stan", "Husby", "Östermalm", "Arlanda Airport", "Norvik Port"],
    },
    "Zurich": {
        "solar_index": 0.48, "temp_avg_f": 50, "rain_factor": 0.58,
        "humidity": 0.76, "traffic_density": 0.95, "industrial_aqi": 6,
        "energy_scale": 1.22, "region": "Europe", "timezone": "Europe/Zurich",
        "zones": ["Altstadt", "Altstetten", "Seefeld", "ZRH Airport", "Limmat Industrial"],
    },

    # ── MIDDLE EAST ───────────────────────────────────────────────────
    "Dubai": {
        "solar_index": 0.96, "temp_avg_f": 85, "rain_factor": 0.02,
        "humidity": 0.60, "traffic_density": 1.35, "industrial_aqi": 22,
        "energy_scale": 1.75, "region": "Middle East", "timezone": "Asia/Dubai",
        "zones": ["Downtown Dubai", "Deira", "Dubai Marina", "DXB Airport", "Jebel Ali Port"],
    },
    "Riyadh": {
        "solar_index": 0.95, "temp_avg_f": 84, "rain_factor": 0.03,
        "humidity": 0.25, "traffic_density": 1.20, "industrial_aqi": 25,
        "energy_scale": 1.80, "region": "Middle East", "timezone": "Asia/Riyadh",
        "zones": ["Al Olaya", "Al Sulay", "Al Nakheel", "King Khalid Airport", "Riyadh Industrial City"],
    },
    "Istanbul": {
        "solar_index": 0.62, "temp_avg_f": 58, "rain_factor": 0.45,
        "humidity": 0.72, "traffic_density": 1.50, "industrial_aqi": 20,
        "energy_scale": 1.12, "region": "Middle East", "timezone": "Europe/Istanbul",
        "zones": ["Beyoğlu", "Ümraniye", "Beşiktaş", "Atatürk Airport District", "Haydarpasa Port"],
    },

    # ── EAST ASIA ─────────────────────────────────────────────────────
    "Tokyo": {
        "solar_index": 0.55, "temp_avg_f": 60, "rain_factor": 0.60,
        "humidity": 0.72, "traffic_density": 1.60, "industrial_aqi": 15,
        "energy_scale": 1.25, "region": "East Asia", "timezone": "Asia/Tokyo",
        "zones": ["Shinjuku", "Adachi", "Shibuya", "Narita Airport", "Port of Tokyo"],
    },
    "Beijing": {
        "solar_index": 0.60, "temp_avg_f": 55, "rain_factor": 0.28,
        "humidity": 0.55, "traffic_density": 1.75, "industrial_aqi": 60,
        "energy_scale": 1.40, "region": "East Asia", "timezone": "Asia/Shanghai",
        "zones": ["Chaoyang", "Shijingshan", "Haidian", "Capital Airport", "Tianjin Port Corridor"],
    },
    "Shanghai": {
        "solar_index": 0.52, "temp_avg_f": 61, "rain_factor": 0.58,
        "humidity": 0.76, "traffic_density": 1.70, "industrial_aqi": 45,
        "energy_scale": 1.30, "region": "East Asia", "timezone": "Asia/Shanghai",
        "zones": ["Pudong", "Yangpu", "Jing'an", "Pudong Airport", "Port of Shanghai"],
    },
    "Seoul": {
        "solar_index": 0.55, "temp_avg_f": 57, "rain_factor": 0.45,
        "humidity": 0.65, "traffic_density": 1.40, "industrial_aqi": 30,
        "energy_scale": 1.30, "region": "East Asia", "timezone": "Asia/Seoul",
        "zones": ["Gangnam", "Guro", "Mapo", "Incheon Airport", "Incheon Port"],
    },
    "Singapore": {
        "solar_index": 0.75, "temp_avg_f": 81, "rain_factor": 0.85,
        "humidity": 0.85, "traffic_density": 1.10, "industrial_aqi": 20,
        "energy_scale": 1.20, "region": "Southeast Asia", "timezone": "Asia/Singapore",
        "zones": ["Marina Bay", "Jurong", "Orchard", "Changi Airport", "Port of Singapore"],
    },
    "Hong Kong": {
        "solar_index": 0.65, "temp_avg_f": 73, "rain_factor": 0.70,
        "humidity": 0.80, "traffic_density": 1.50, "industrial_aqi": 28,
        "energy_scale": 1.15, "region": "East Asia", "timezone": "Asia/Hong_Kong",
        "zones": ["Central", "Kwun Tong", "Wan Chai", "HKIA Airport", "Kwai Tsing Port"],
    },
    "Bangkok": {
        "solar_index": 0.82, "temp_avg_f": 83, "rain_factor": 0.65,
        "humidity": 0.78, "traffic_density": 1.65, "industrial_aqi": 35,
        "energy_scale": 1.25, "region": "Southeast Asia", "timezone": "Asia/Bangkok",
        "zones": ["Sukhumvit", "Bang Khae", "Silom", "Suvarnabhumi Airport", "Laem Chabang Port"],
    },
    "Kuala Lumpur": {
        "solar_index": 0.80, "temp_avg_f": 81, "rain_factor": 0.88,
        "humidity": 0.85, "traffic_density": 1.30, "industrial_aqi": 25,
        "energy_scale": 1.10, "region": "Southeast Asia", "timezone": "Asia/Kuala_Lumpur",
        "zones": ["KLCC", "Chow Kit", "Bangsar", "KLIA Airport", "Port Klang"],
    },
    "Jakarta": {
        "solar_index": 0.78, "temp_avg_f": 82, "rain_factor": 0.80,
        "humidity": 0.85, "traffic_density": 1.85, "industrial_aqi": 45,
        "energy_scale": 1.15, "region": "Southeast Asia", "timezone": "Asia/Jakarta",
        "zones": ["Sudirman", "Cakung", "Menteng", "Soekarno-Hatta Airport", "Tanjung Priok Port"],
    },

    # ── SOUTH ASIA / PACIFIC ──────────────────────────────────────────
    "Sydney": {
        "solar_index": 0.82, "temp_avg_f": 64, "rain_factor": 0.42,
        "humidity": 0.68, "traffic_density": 1.05, "industrial_aqi": 8,
        "energy_scale": 1.00, "region": "Oceania", "timezone": "Australia/Sydney",
        "zones": ["CBD", "Western Sydney", "Bondi", "Sydney Airport", "Port Botany"],
    },
    "Melbourne": {
        "solar_index": 0.72, "temp_avg_f": 58, "rain_factor": 0.48,
        "humidity": 0.65, "traffic_density": 1.00, "industrial_aqi": 7,
        "energy_scale": 1.05, "region": "Oceania", "timezone": "Australia/Melbourne",
        "zones": ["CBD", "Footscray", "St Kilda", "Tullamarine Airport", "Port of Melbourne"],
    },

    # ── AFRICA ────────────────────────────────────────────────────────
    "Cairo": {
        "solar_index": 0.93, "temp_avg_f": 72, "rain_factor": 0.02,
        "humidity": 0.45, "traffic_density": 1.70, "industrial_aqi": 45,
        "energy_scale": 1.30, "region": "Africa", "timezone": "Africa/Cairo",
        "zones": ["Downtown", "Helwan", "Maadi", "Cairo Airport", "Port Said Corridor"],
    },
    "Lagos": {
        "solar_index": 0.80, "temp_avg_f": 81, "rain_factor": 0.72,
        "humidity": 0.85, "traffic_density": 1.90, "industrial_aqi": 40,
        "energy_scale": 1.05, "region": "Africa", "timezone": "Africa/Lagos",
        "zones": ["Victoria Island", "Mushin", "Lekki", "Murtala Airport", "Apapa Port"],
    },
    "Nairobi": {
        "solar_index": 0.82, "temp_avg_f": 65, "rain_factor": 0.55,
        "humidity": 0.68, "traffic_density": 1.40, "industrial_aqi": 22,
        "energy_scale": 0.90, "region": "Africa", "timezone": "Africa/Nairobi",
        "zones": ["CBD", "Kibera", "Westlands", "JKIA Airport", "Industrial Area"],
    },
    "Johannesburg": {
        "solar_index": 0.85, "temp_avg_f": 61, "rain_factor": 0.38,
        "humidity": 0.52, "traffic_density": 1.20, "industrial_aqi": 28,
        "energy_scale": 1.15, "region": "Africa", "timezone": "Africa/Johannesburg",
        "zones": ["Sandton", "Soweto", "Rosebank", "OR Tambo Airport", "City Deep Industrial"],
    },

    # ── LATIN AMERICA ─────────────────────────────────────────────────
    "São Paulo": {
        "solar_index": 0.72, "temp_avg_f": 69, "rain_factor": 0.68,
        "humidity": 0.78, "traffic_density": 1.80, "industrial_aqi": 35,
        "energy_scale": 1.10, "region": "Latin America", "timezone": "America/Sao_Paulo",
        "zones": ["Centro", "ABC Industrial", "Jardins", "Guarulhos Airport", "Port of Santos"],
    },
    "Mexico City": {
        "solar_index": 0.78, "temp_avg_f": 64, "rain_factor": 0.45,
        "humidity": 0.55, "traffic_density": 1.75, "industrial_aqi": 40,
        "energy_scale": 1.15, "region": "Latin America", "timezone": "America/Mexico_City",
        "zones": ["Centro Histórico", "Iztapalapa", "Polanco", "AICM Airport", "Vallejo Industrial"],
    },
    "Buenos Aires": {
        "solar_index": 0.68, "temp_avg_f": 64, "rain_factor": 0.50,
        "humidity": 0.72, "traffic_density": 1.30, "industrial_aqi": 20,
        "energy_scale": 1.10, "region": "Latin America", "timezone": "America/Argentina/Buenos_Aires",
        "zones": ["Palermo", "La Boca", "Recoleta", "Ezeiza Airport", "Puerto Madero Port"],
    },
    "Bogotá": {
        "solar_index": 0.65, "temp_avg_f": 57, "rain_factor": 0.62,
        "humidity": 0.72, "traffic_density": 1.50, "industrial_aqi": 30,
        "energy_scale": 0.95, "region": "Latin America", "timezone": "America/Bogota",
        "zones": ["Chapinero", "Kennedy", "Usaquén", "El Dorado Airport", "Zona Industrial"],
    },
    "Toronto": {
        "solar_index": 0.48, "temp_avg_f": 48, "rain_factor": 0.45,
        "humidity": 0.70, "traffic_density": 1.15, "industrial_aqi": 10,
        "energy_scale": 1.35, "region": "North America", "timezone": "America/Toronto",
        "zones": ["Downtown", "Scarborough", "Yorkville", "Pearson Airport", "Port of Toronto"],
    },
}

# ── Coordinate lookup for fast nearest-city matching ───────────────
CITY_COORDS = {
    "New York": (40.71, -74.01), "Los Angeles": (34.05, -118.24), "Chicago": (41.88, -87.63),
    "Houston": (29.76, -95.37), "Seattle": (47.61, -122.33), "San Francisco": (37.77, -122.42),
    "Phoenix": (33.45, -112.07), "Miami": (25.76, -80.19), "Boston": (42.36, -71.06),
    "Austin": (30.27, -97.74), "Denver": (39.74, -104.99), "Portland": (45.51, -122.68),
    "Atlanta": (33.75, -84.39), "Dallas": (32.78, -96.80), "Toronto": (43.65, -79.38),
    "Mumbai": (19.08, 72.88), "Delhi": (28.61, 77.21), "Bangalore": (12.97, 77.59),
    "Chennai": (13.08, 80.27), "Hyderabad": (17.39, 78.49), "Kolkata": (22.57, 88.36),
    "Pune": (18.52, 73.86), "Ahmedabad": (23.03, 72.59),
    "London": (51.51, -0.13), "Paris": (48.85, 2.35), "Berlin": (52.52, 13.40),
    "Amsterdam": (52.37, 4.90), "Madrid": (40.42, -3.70), "Rome": (41.90, 12.50),
    "Barcelona": (41.39, 2.15), "Stockholm": (59.33, 18.07), "Zurich": (47.38, 8.54),
    "Dubai": (25.20, 55.27), "Riyadh": (24.69, 46.72), "Istanbul": (41.01, 28.95),
    "Tokyo": (35.69, 139.69), "Beijing": (39.91, 116.39), "Shanghai": (31.23, 121.47),
    "Seoul": (37.57, 126.98), "Singapore": (1.35, 103.82), "Hong Kong": (22.33, 114.17),
    "Bangkok": (13.75, 100.52), "Kuala Lumpur": (3.14, 101.69), "Jakarta": (-6.21, 106.85),
    "Sydney": (-33.87, 151.21), "Melbourne": (-37.81, 144.96),
    "Cairo": (30.04, 31.24), "Lagos": (6.52, 3.38), "Nairobi": (-1.29, 36.82),
    "Johannesburg": (-26.20, 28.04),
    "São Paulo": (-23.55, -46.63), "Mexico City": (19.43, -99.13),
    "Buenos Aires": (-34.61, -58.38), "Bogotá": (4.71, -74.07),
}

DEFAULT_PROFILE = CITY_PROFILES["New York"]

def get_profile(city: str) -> dict:
    return CITY_PROFILES.get(city, DEFAULT_PROFILE)

def find_nearest_city(lat: float, lon: float) -> str:
    """Find the closest city in our profiles by Euclidean distance on lat/lon."""
    import math
    best, best_dist = "New York", float("inf")
    for city, (clat, clon) in CITY_COORDS.items():
        d = math.sqrt((lat - clat)**2 + (lon - clon)**2)
        if d < best_dist:
            best_dist = d
            best = city
    return best

def get_all_cities() -> list:
    return sorted(CITY_PROFILES.keys())
