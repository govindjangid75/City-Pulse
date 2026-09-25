import React from 'react'
import { 
  Sparkles, Compass, Camera, ShieldAlert, Clock, ArrowRight, 
  MapPin, Activity, HeartPulse, CloudRain, Car, Train, Zap,
  CheckCircle2, Globe, ArrowUpRight, Play, Eye, Flame, ShieldCheck,
  Building, Navigation, Radio, Truck
} from 'lucide-react'
import { INDIAN_CITIES, INDIAN_STATES_AND_CITIES, SECTOR_VISUALS } from '../data/visualData'

export default function HomePage({ 
  onNavigateToDashboard, 
  onNavigateToMap, 
  onNavigateToCommand, 
  onNavigateToReplay,
  onNavigateToAdmin,
  onNavigateToAlerts,
  onNavigateToBusiness,
  onOpenSubscriptionModal,
  onOpenCitizenReport,
  onSelectCity,
  zones = []
}) {
  const topCities = [
    { id: 'delhi-ncr', name: 'Delhi NCR', state: 'Delhi NCR', aqi: 142, temp: '26°C', tag: 'DMRC Active' },
    { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', aqi: 68, temp: '29°C', tag: 'Coastal Breeze' },
    { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', aqi: 45, temp: '22°C', tag: 'Namma Metro' },
    { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', aqi: 82, temp: '28°C', tag: 'Heritage Smart' },
    { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana & AP', aqi: 62, temp: '26°C', tag: 'Hitec City' },
    { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', aqi: 88, temp: '28°C', tag: 'Underwater Metro' },
    { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', aqi: 38, temp: '25°C', tag: 'Cleanest City' },
    { id: 'shimla', name: 'Shimla', state: 'Himachal', aqi: 20, temp: '16°C', tag: 'Pure Mountain Air' }
  ]

  const featureCards = [
    {
      icon: ShieldAlert,
      title: 'Pan-India Real-Time Alerts Hub (9 Domains)',
      desc: 'Live verified alerts across Heavy Rainfall, Floods, Traffic Gridlocks, AQI Smog, Metro Outages, Power Trips, Gas Leaks, Noise & 311 Road Hazards.',
      actionLabel: 'View Real-Time Alerts',
      onClick: onNavigateToAlerts,
      color: 'from-rose-500/10 to-amber-500/10 border-rose-200 text-rose-800',
      badge: '9 CIVIC DOMAINS'
    },
    {
      icon: Building,
      title: 'Commercial Fleet & Premium Subscriptions',
      desc: 'Hyperlocal route passability for Swiggy, Blinkit & Uber. 1-Year historical disruption archive, raw CSV/JSON exports & predictive storm alerts.',
      actionLabel: 'Open Business Intel',
      onClick: onNavigateToBusiness,
      color: 'from-purple-500/10 to-indigo-500/10 border-purple-200 text-purple-900',
      badge: 'PRO & ENTERPRISE'
    },
    {
      icon: Building,
      title: 'Municipal Admin Portal (24h SLA Governance)',
      desc: 'Real-time GPS complaint stream with photos. Automatic escalation to State Disaster Management Authority (SDMA) if unresolved in 24 hours.',
      actionLabel: 'Open Admin Portal',
      onClick: onNavigateToAdmin,
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-800',
      badge: '24h SLA POLICY'
    },
    {
      icon: Camera,
      title: 'Citizen Camera Complaint Portal',
      desc: 'Direct in-browser camera viewfinder, instant GPS watermarking, 6 Indian municipal categories & 311 tracking ticket receipts.',
      actionLabel: 'Snap & File Report',
      onClick: onOpenCitizenReport,
      color: 'from-rose-500/10 to-amber-500/10 border-rose-200 text-rose-700',
      badge: 'DEVICE CAMERA'
    },
    {
      icon: Compass,
      title: 'Pan-India Spatial Map & Sensors',
      desc: 'Hierarchical State & City filters, manual geocoding for any town, Open-Meteo live weather radar & CPCB NAQI AQI scores.',
      actionLabel: 'Explore Map',
      onClick: onNavigateToMap,
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-700',
      badge: 'LIVE SENSORS'
    },
    {
      icon: Activity,
      title: 'Multi-Signal Correlation Engine',
      desc: 'Cross-feed synthesis linking monsoon cloudbursts, underpass flood depths, bus diversions & power grid dips without causation bias.',
      actionLabel: 'Inspect Matrix',
      onClick: onNavigateToDashboard,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-700',
      badge: 'AI SYNTHESIS'
    },
    {
      icon: Clock,
      title: 'Deterministic Historical Replay',
      desc: 'Chronological time-machine scrubber (5:00 AM storm inception → 6:00 PM peak flood) and 1-click resilience crisis injection scenarios.',
      actionLabel: 'Open Time Scrubber',
      onClick: onNavigateToReplay,
      color: 'from-purple-500/10 to-violet-500/10 border-purple-200 text-purple-700',
      badge: 'TIMELINE'
    },
    {
      icon: ShieldAlert,
      title: 'Official Municipal Command Center',
      desc: 'First-responder deployment triage, CCTV surveillance feeds, inter-agency broadcast advisory engine & zone quarantine.',
      actionLabel: 'Open Command',
      onClick: onNavigateToCommand,
      color: 'from-slate-900/10 to-slate-800/10 border-slate-300 text-slate-900',
      badge: 'FIRST RESPONDER'
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. HERO SHOWCASE BANNER */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800">
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-5">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>PAN-INDIA METROPOLITAN CIVIC HEALTH INTELLIGENCE</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Real-Time Spatial Telemetry & Civic Intelligence for Indian Cities
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-3xl">
            Synthesizing <strong>OpenStreetMap spatial mapping</strong>, <strong>IMD weather Doppler radar</strong>, <strong>CPCB air quality</strong>, <strong>arterial traffic velocity</strong>, <strong>citizen camera complaints</strong>, and <strong>24-hour SLA governance</strong> across 18+ Indian States and 45+ Smart Cities.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateToDashboard}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/40 flex items-center gap-2 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onNavigateToAlerts}
              className="px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-950/40 flex items-center gap-2 transition active:scale-95 border border-rose-400/40"
            >
              <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
              <span>Real-Time Alerts (9 Domains)</span>
            </button>

            <button
              onClick={onNavigateToBusiness}
              className="px-5 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-lg shadow-purple-950/40 flex items-center gap-2 transition active:scale-95 border border-purple-400/40"
            >
              <Truck className="w-4 h-4 text-purple-200" />
              <span>Business Intel (Fleet & Historical)</span>
            </button>

            <button
              onClick={onNavigateToAdmin}
              className="px-4 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-950/40 flex items-center gap-2 transition active:scale-95 border border-indigo-400/40"
            >
              <Building className="w-4 h-4" />
              <span>Admin Portal (24h SLA)</span>
            </button>

            <button
              onClick={onOpenSubscriptionModal}
              className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md flex items-center gap-2 transition active:scale-95"
            >
              <span>Pricing & Plans</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs font-mono">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
              <span className="text-slate-400 block text-[11px]">States Monitored</span>
              <strong className="text-lg font-black text-white">18+ Regions</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
              <span className="text-slate-400 block text-[11px]">Metropolitan Cities</span>
              <strong className="text-lg font-black text-emerald-400">45+ Urban Hubs</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
              <span className="text-slate-400 block text-[11px]">Correlation Speed</span>
              <strong className="text-lg font-black text-indigo-400">2.4s Real-Time</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
              <span className="text-slate-400 block text-[11px]">API Key Required</span>
              <strong className="text-lg font-black text-teal-400">0 (100% Free)</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PAN-INDIA CITY QUICK-ACCESS CAROUSEL / GRID */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Pan-India Metropolitan Quick Access
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Click any city to view live map & telemetry
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {topCities.map(city => (
            <button
              key={city.id}
              onClick={() => onSelectCity && onSelectCity(city.id, city.state)}
              className="p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition text-left group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-slate-400 block truncate">{city.state}</span>
                <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-indigo-600 transition truncate">
                  {city.name}
                </h4>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-700 font-bold">{city.temp}</span>
                <span className="text-emerald-700 font-bold">AQI {city.aqi}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. CORE MODULES & BENTO HIGHLIGHTS */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Integrated Civic Intelligence Features
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Explore the 6 core pillars designed for modern municipal governance and citizen empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                onClick={card.onClick}
                className={`bento-card p-6 rounded-3xl bg-gradient-to-br ${card.color} border flex flex-col justify-between hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-slate-200/60">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-sm">
                      {card.badge}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 tracking-tight group-hover:text-indigo-600 transition">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition">
                  <span>{card.actionLabel}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. CRISIS SCENARIO SANDBOX CTA */}
      <section className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl border border-indigo-800/40">
        <div className="space-y-1 max-w-xl">
          <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider">
            Crisis Simulation Engine
          </span>
          <h3 className="text-xl font-black text-white">
            Test How Your City Responds to Disasters in Real-Time
          </h3>
          <p className="text-xs text-slate-300">
            Inject monsoon cloudbursts, traffic signal outages, or grid failures to witness live multi-signal correlation and first-responder triage.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onNavigateToReplay}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-100 transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Historical Replay</span>
          </button>
          <button
            onClick={onNavigateToDashboard}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition"
          >
            <span>Open Live Dashboard →</span>
          </button>
        </div>
      </section>
    </div>
  )
}
