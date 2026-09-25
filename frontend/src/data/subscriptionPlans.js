/**
 * CityPulse - Tiered Subscription Architecture & Commercial Business Intelligence
 * 
 * Balances free public civic access with specialized Resident Pro, Commercial Logistics,
 * and Municipal Enterprise subscriptions.
 */

export const SUBSCRIPTION_TIERS = {
  free: {
    id: 'free',
    name: 'Citizen Standard',
    tagline: 'Essential real-time civic awareness for every Indian resident',
    priceMonthly: 0,
    priceAnnual: 0,
    badgeColor: 'emerald',
    isPopular: false,
    targetAudience: 'General Residents, Pedestrians & Daily Commuters',
    features: [
      'Live 9-Domain Civic Dashboard (Weather, AQI, Traffic, Floods, Transit, Power, Gas, Noise, 311)',
      'Pan-India Interactive Spatial Map with 10 Layer Toggles',
      'Instant Emergency Push Alert Banner for Severe Disasters',
      'Citizen Camera Portal: File up to 5 complaints daily with live GPS & AI authenticity check',
      'Community Upvoting to escalate local civic priorities',
      'Mandatory 24-Hour Municipal SLA Tracking with SDMA Escalation transparency'
    ],
    limitations: [
      'Standard web-only notification delivery',
      'Recent 24-hour historical window only',
      'No raw CSV/JSON dataset exports',
      'No commercial logistics fleet routing APIs'
    ]
  },
  resident_pro: {
    id: 'resident_pro',
    name: 'Resident Sentinel Pro',
    tagline: 'Hyperlocal family safety, predictive forecasts & priority civic resolution',
    priceMonthly: 299,
    priceAnnual: 2499,
    badgeColor: 'blue',
    isPopular: true,
    targetAudience: 'Homeowners, Parents, Regular Commuters & Neighborhood Associations',
    features: [
      'Everything in Citizen Standard, plus:',
      '⚡ Instant WhatsApp & SMS Alerts for Flash Floods, Cloudbursts & Power Feeder Trips',
      '📍 3 Custom Safety Geofences (Home, Kids’ School, Workplace Corridor)',
      '🔮 48-Hour Predictive AI Forecast for localized Monsoon Rain, Floods & AQI Spikes',
      '⏳ 30-Day Neighborhood Historical Replay (Track road repair history & recurring waterlogging)',
      '🚀 Priority 311 Ticket Ingestion with direct escalation audit trails',
      '🔇 Hyperlocal Decibel (dB) & Microclimate Sensor Trends'
    ],
    limitations: [
      'Single user license (non-commercial)',
      'Limited to 500 API calls/month for personal automation'
    ]
  },
  business_pro: {
    id: 'business_pro',
    name: 'Commercial Logistics & Mobility',
    tagline: 'Actionable disruption intelligence for delivery fleets, cabs & retail chains',
    priceMonthly: 4999,
    priceAnnual: 49999,
    badgeColor: 'purple',
    isPopular: false,
    targetAudience: 'Delivery Fleets (Zomato/Blinkit/Swiggy), Cabs (Uber/Ola), Supply Chains & Construction',
    features: [
      'Everything in Resident Sentinel Pro, plus:',
      '🚚 Hyperlocal Fleet Route Passability Index & Live Underpass Water Depth Radar',
      '⚡ Dynamic Delivery Detour Recommendations during Monsoon Waterlogging & Gridlocks',
      '📊 1-Year Historical Civic Archive (Multi-month time series for road speeds, rain, power trips)',
      '💾 Bulk Data Export Center: One-click CSV, JSON & GeoJSON datasets with sensor provenance',
      '🔌 REST & WebSocket API Access (100,000 requests/month) for ERP / dispatch integration',
      '🏢 Commercial Property Asset Risk Scorecard (Flood inundation & power outage vulnerability)',
      '📄 Automated Daily & Weekly Civic Disruption PDF Reports for Ops Managers'
    ],
    limitations: [
      'Up to 10 fleet operator seats',
      'Custom SLA agreement required for municipal command dispatch'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Municipal & Infrastructure Enterprise',
    tagline: 'End-to-end command dispatch, smart city telemetry & state disaster management',
    priceMonthly: 24999,
    priceAnnual: 249999,
    badgeColor: 'amber',
    isPopular: false,
    targetAudience: 'Municipal Corporations (MCD, BMC, BBMP), SDMA, Utility Providers (BSES, PVVNL, IGL), Highway Authorities',
    features: [
      'Everything in Commercial Logistics, plus:',
      '🏛️ Dedicated Municipal Command & First-Responder Dispatch Center (NDRF, PWD, Fire, Police)',
      '📡 Unrestricted Direct SCADA, CAAQMS, Water Level IoT & Traffic Camera Raw Telemetry Stream',
      '🚨 Automated Level 3 SDMA Escalation Governance & Chief Secretary Audit Logs',
      '🗺️ Custom GIS Polygon Layers & High-Precision Infrastructure Mapping',
      '🛡️ 99.99% Telemetry Uptime SLA with 24/7 Dedicated Solutions Engineer',
      'Unlimited API throughput & custom on-premise / hybrid cloud deployment'
    ],
    limitations: []
  }
}

/**
 * Commercial Business Intelligence: Delivery Fleet Route Telemetry for Indian Metros
 */
export const FLEET_ROUTE_PASSABILITY_DATA = [
  {
    corridorId: 'COR-DEL-01',
    corridorName: 'Delhi Outer Ring Road: ITO to Ashram Flyover',
    metro: 'Delhi NCR',
    targetBusinesses: 'Swiggy, Blinkit, Uber, E-Kart Logistics',
    status: 'High Congestion / Impassable Underpass',
    riskLevel: 'Severe Risk (Delay: +28 min)',
    passabilityScore: 34, // out of 100
    bottlenecks: 'Bhairon Marg underpass water depth 1.2m; Ring Road 3-lane merge bottleneck',
    averageFleetSpeed: '11 km/h (Normal: 42 km/h)',
    recommendedDetour: 'Divert fleet via Barapullah Elevated Corridor & Mathura Road Inner Lane',
    activeDisruptions: ['🌊 Waterlogging: 1.2m', '🚗 Traffic: 82% jam index', '⚡ Traffic lights on solar backup'],
    lastSensorSync: '3 mins ago'
  },
  {
    corridorId: 'COR-BLR-01',
    corridorName: 'Bengaluru Outer Ring Road: Silk Board to Marathahalli',
    metro: 'Bengaluru Urban',
    targetBusinesses: 'Zepto Hubs, Uber Auto, IT Shuttle Fleets',
    status: 'Slow Arterial Velocity',
    riskLevel: 'Moderate Delay (+18 min)',
    passabilityScore: 58,
    bottlenecks: 'Ecospace service road drainage overflow; Bellandur signal cycle delays',
    averageFleetSpeed: '16 km/h (Normal: 38 km/h)',
    recommendedDetour: 'Route two-wheelers through Haralur Road bypass to Sarjapur main road',
    activeDisruptions: ['🌧️ Rain: 35 mm/hr', '🚗 Traffic: 16 km/h', '🚧 Metro pier barricades'],
    lastSensorSync: '5 mins ago'
  },
  {
    corridorId: 'COR-MUM-01',
    corridorName: 'Mumbai Western Express Highway: Bandra to Andheri Flyover',
    metro: 'Mumbai Metropolitan',
    targetBusinesses: 'Amazon Prime, Zomato Quick, Airport Logistics',
    status: 'Critical Impasse',
    riskLevel: 'Severe Delay (+35 min)',
    passabilityScore: 28,
    bottlenecks: 'Vakola Flyover truck breakdown; Coastal wind squall across Kalanagar',
    averageFleetSpeed: '9 km/h (Normal: 48 km/h)',
    recommendedDetour: 'Use SV Road or Coastal Road Northbound link (Light vehicles only)',
    activeDisruptions: ['🚗 Breakdown blocking 2 lanes', '🌊 High tide backflow warning', '🌧️ Drizzle'],
    lastSensorSync: '2 mins ago'
  },
  {
    corridorId: 'COR-HYD-01',
    corridorName: 'Hyderabad IT Corridor: Hitec City to Gachibowli Circle',
    metro: 'Telangana & AP',
    targetBusinesses: 'Swiggy Instamart, Rapido, Corporate Shuttles',
    status: 'Passable with Minor Delay',
    riskLevel: 'Low Delay (+6 min)',
    passabilityScore: 82,
    bottlenecks: 'Biodiversity underpass drainage pumps active; water level normalized < 8 cm',
    averageFleetSpeed: '32 km/h (Normal: 40 km/h)',
    recommendedDetour: 'Main flyover flow is optimal. Service road puddles cleared.',
    activeDisruptions: ['🌊 Sump pumps running', '🚗 Normal corridor speed'],
    lastSensorSync: '1 min ago'
  }
]

/**
 * Historical Disruption Datasets available for Business Pro / Enterprise Export
 */
export const HISTORICAL_DATASETS_ARCHIVE = [
  {
    id: 'DS-2026-DELHI-MONSOON',
    title: 'Delhi NCR Monsoon Precipitation & Road Inundation Dataset',
    timeframe: 'June 2025 - August 2025 (90 Days Continuous)',
    recordsCount: '142,850 observations',
    dataTypes: ['IMD Rain Gauge mm/h', 'Underpass Flood Depth cm', 'Ring Road Congestion %', 'MCD Sump Dispatches'],
    format: 'CSV, JSON, GeoJSON (WGS-84)',
    size: '18.4 MB',
    isPro: true
  },
  {
    id: 'DS-2026-PANINDIA-AQI',
    title: 'CPCB Pan-India Ambient Air Quality & Thermal Inversion Log',
    timeframe: 'October 2025 - January 2026 (120 Days Winter Inversion)',
    recordsCount: '318,400 observations',
    dataTypes: ['PM2.5', 'PM10', 'NO2', 'Surface Wind Velocity', 'Temperature Inversion Lapse Rate'],
    format: 'CSV, Parquet, JSON',
    size: '42.1 MB',
    isPro: true
  },
  {
    id: 'DS-2026-BENGALURU-TRAFFIC',
    title: 'Bengaluru Tech Corridors Speed & Metro Outage Telemetry',
    timeframe: 'March 2025 - March 2026 (365 Days)',
    recordsCount: '580,200 observations',
    dataTypes: ['BTP Velocity km/h', 'Namma Metro Headways', 'Rain Inundation Points', 'Feeder Trips'],
    format: 'CSV, GeoJSON',
    size: '64.8 MB',
    isPro: true
  },
  {
    id: 'DS-2026-MUMBAI-COASTAL',
    title: 'Mumbai High Tide Coastal Flooding & BMC Dewatering Log',
    timeframe: 'Monsoon 2025 (4 Months)',
    recordsCount: '98,600 observations',
    dataTypes: ['Tide Height Meters', 'Hindmata & Sion Water Level', 'Central Rail Stoppage Minutes'],
    format: 'CSV, JSON',
    size: '12.2 MB',
    isPro: true
  }
]

/**
 * Get active user subscription from localStorage with fallback to Free
 */
export function getActiveSubscription() {
  try {
    const saved = localStorage.getItem('citypulse_active_subscription')
    if (saved && SUBSCRIPTION_TIERS[saved]) {
      return SUBSCRIPTION_TIERS[saved]
    }
  } catch (e) {
    console.warn('Error reading active subscription:', e)
  }
  return SUBSCRIPTION_TIERS.free
}

/**
 * Update active user subscription in localStorage
 */
export function setActiveSubscription(tierId) {
  if (SUBSCRIPTION_TIERS[tierId]) {
    try {
      localStorage.setItem('citypulse_active_subscription', tierId)
    } catch (e) {
      console.warn('Error writing active subscription:', e)
    }
    return SUBSCRIPTION_TIERS[tierId]
  }
  return SUBSCRIPTION_TIERS.free
}
