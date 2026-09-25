import React, { useState } from 'react'
import { 
  FLEET_ROUTE_PASSABILITY_DATA, 
  HISTORICAL_DATASETS_ARCHIVE, 
  SUBSCRIPTION_TIERS 
} from '../data/subscriptionPlans'
import { 
  Truck, BarChart3, Download, ShieldAlert, Sparkles, 
  Layers, Clock, MapPin, AlertTriangle, CheckCircle2, 
  FileText, ArrowRight, Zap, Droplets, Car, Building2,
  ExternalLink, Filter, Search, Eye, Lock, ShieldCheck,
  TrendingUp, Activity, Compass, Database
} from 'lucide-react'

export default function BusinessIntelligenceView({ 
  currentTier = 'business_pro', 
  onOpenSubscriptionModal,
  onNavigateToMap
}) {
  const [selectedMetro, setSelectedMetro] = useState('all')
  const [downloadSuccessId, setDownloadSuccessId] = useState(null)
  const [activeTab, setActiveTab] = useState('routes') // 'routes' | 'history' | 'exports' | 'vulnerability'
  const [warehouseAddress, setWarehouseAddress] = useState('Okhla Industrial Area Phase III, New Delhi')
  const [analyzingRisk, setAnalyzingRisk] = useState(false)
  const [riskAssessment, setRiskAssessment] = useState({
    floodRisk: 'Moderate (Elevation: 218m)',
    powerReliability: '96.4% (Dual 33kV feed)',
    trafficAccess: 'Congested (Peak speed 18 km/h)',
    overallScore: 'B+ (Commercial Grade)'
  })

  const isProOrEnterprise = currentTier === 'business_pro' || currentTier === 'enterprise'

  const filteredRoutes = FLEET_ROUTE_PASSABILITY_DATA.filter(route => {
    if (selectedMetro === 'all') return true
    return route.metro.toLowerCase().includes(selectedMetro.toLowerCase())
  })

  const handleDownloadDataset = (datasetId, format) => {
    setDownloadSuccessId(datasetId)
    // Simulate generation of CSV/JSON download blob
    const sampleData = [
      { timestamp: '2026-09-25T07:00:00Z', metro: 'Delhi NCR', rain_mm_hr: 58.2, flood_depth_cm: 120, avg_speed_kmh: 11.4 },
      { timestamp: '2026-09-25T07:15:00Z', metro: 'Delhi NCR', rain_mm_hr: 64.0, flood_depth_cm: 125, avg_speed_kmh: 9.8 }
    ]
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${datasetId}_telemetry_export.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setTimeout(() => {
      setDownloadSuccessId(null)
    }, 2500)
  }

  const handleAnalyzeWarehouseRisk = (e) => {
    e.preventDefault()
    setAnalyzingRisk(true)
    setTimeout(() => {
      setAnalyzingRisk(false)
      setRiskAssessment({
        floodRisk: 'Low-to-Moderate (Drain slope 1:120)',
        powerReliability: '98.1% (Industrial Express Feeder)',
        trafficAccess: 'Optimal via Expressway Bypass',
        overallScore: 'A (High Resilience Logistics Hub)'
      })
    }, 1000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Executive Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-purple-900/50">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Truck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Commercial Logistics & Deep Historical Intelligence Hub
                  </h2>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500 text-white flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    BUSINESS PRO
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Actionable fleet detour routing, underpass inundation radar, and multi-year historical disruption datasets for enterprise supply chains
                </p>
              </div>
            </div>

            {/* Current Active Plan Badge & Upgrade Action */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-300 block uppercase">
                  Active Tier
                </span>
                <span className="text-xs font-black text-white">
                  {SUBSCRIPTION_TIERS[currentTier]?.name || 'Commercial Pro'}
                </span>
              </div>
              <button
                onClick={onOpenSubscriptionModal}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
              >
                Manage Plan
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar for Fleet Operations */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs font-mono">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block text-[11px]">Fleet Passability Index</span>
              <strong className="text-lg font-black text-emerald-400">74.2% Passable</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block text-[11px]">Impassable Underpasses</span>
              <strong className="text-lg font-black text-rose-400">3 Submerged (&gt;1m)</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block text-[11px]">Peak Monsoon Delay</span>
              <strong className="text-lg font-black text-amber-400">+28 mins (Delhi ORR)</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block text-[11px]">Historical Records Ingested</span>
              <strong className="text-lg font-black text-purple-300">1.2M+ Points</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('routes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'routes'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Delivery Fleet Route Passability</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'history'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Deep Historical Analytics Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('exports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'exports'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Bulk Data Export Center (CSV/JSON)</span>
        </button>

        <button
          onClick={() => setActiveTab('vulnerability')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'vulnerability'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Commercial Property Asset Risk</span>
        </button>
      </div>

      {/* 3. TAB 1: FLEET ROUTE PASSABILITY RADAR */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Major Indian Metropolitan Delivery Corridors
              </h3>
              <p className="text-xs text-slate-500">
                Real-time routing telemetry for Swiggy, Blinkit, Zomato, Uber, Zepto & Interstate Freight
              </p>
            </div>

            {/* Metro filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Metro:</span>
              <select
                value={selectedMetro}
                onChange={(e) => setSelectedMetro(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm"
              >
                <option value="all">All Metros (Delhi, Bengaluru, Mumbai, Hyderabad)</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Bengaluru">Bengaluru Urban</option>
                <option value="Mumbai">Mumbai Metropolitan</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredRoutes.map(corridor => {
              const isCrit = corridor.passabilityScore < 40
              const isMod = corridor.passabilityScore >= 40 && corridor.passabilityScore < 70
              const scoreBadge = isCrit
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : isMod
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'

              return (
                <div
                  key={corridor.corridorId}
                  className="bento-card bento-porcelain p-5 flex flex-col justify-between border-2 border-slate-200/80 hover:border-purple-300 transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-purple-700 block">
                          {corridor.metro} • ID: {corridor.corridorId}
                        </span>
                        <h4 className="font-black text-slate-900 text-sm sm:text-base mt-0.5">
                          {corridor.corridorName}
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${scoreBadge}`}>
                          Passability: {corridor.passabilityScore}/100
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 block mt-1">
                          Sync: {corridor.lastSensorSync}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Current Fleet Speed:</span>
                        <strong className="text-slate-900">{corridor.averageFleetSpeed}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Delivery Delay Impact:</span>
                        <strong className={isCrit ? 'text-rose-600' : 'text-amber-600'}>{corridor.riskLevel}</strong>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 mb-3">
                      <span className="font-bold text-slate-900 block mb-0.5">Identified Chokepoint:</span>
                      <p className="text-slate-600 font-medium">{corridor.bottlenecks}</p>
                    </div>

                    {/* Detour Recommendation */}
                    <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs mb-3">
                      <span className="font-bold text-purple-900 block text-[11px] uppercase flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-purple-700" />
                        <span>AI Recommended Fleet Detour:</span>
                      </span>
                      <p className="text-purple-950 font-medium mt-1 leading-snug">
                        {corridor.recommendedDetour}
                      </p>
                    </div>

                    {/* Active Disruption Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {corridor.activeDisruptions.map((dis, i) => (
                        <span key={i} className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                          {dis}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-500">
                      Fleets: <strong>{corridor.targetBusinesses}</strong>
                    </span>
                    <button
                      onClick={onNavigateToMap}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                    >
                      <span>View Corridor on Map</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 4. TAB 2: DEEP HISTORICAL ANALYTICS STUDIO (PDF Requirement) */}
      {activeTab === 'history' && (
        <div className="space-y-5">
          <div className="bento-card bento-porcelain p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Multi-Month Cross-Signal Correlation Time Series
                </h3>
                <p className="text-xs text-slate-500">
                  Deterministic alignment of Heavy Rainfall vs Arterial Velocity vs Substation Outages over the last 90 days
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="flex items-center gap-1 text-sky-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  Precipitation (mm/h)
                </span>
                <span className="flex items-center gap-1 text-amber-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Traffic Congestion (%)
                </span>
                <span className="flex items-center gap-1 text-rose-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  311 Waterlogging Complaints
                </span>
              </div>
            </div>

            {/* Visual Simulated Correlation Waveform Chart */}
            <div className="h-64 bg-slate-900 rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span>June 2025 (Monsoon Start)</span>
                <span>July 2025 (Peak Downpours)</span>
                <span>August 2025 (Receding Basin)</span>
                <span>September 2025 (Present)</span>
              </div>

              {/* Multi-Signal Curves */}
              <div className="relative flex-1 flex items-end justify-between px-2 gap-1 py-4">
                {[
                  { rain: 12, traffic: 35, flood: 4 },
                  { rain: 18, traffic: 40, flood: 8 },
                  { rain: 65, traffic: 88, flood: 42 },
                  { rain: 78, traffic: 92, flood: 58 },
                  { rain: 45, traffic: 70, flood: 30 },
                  { rain: 22, traffic: 50, flood: 12 },
                  { rain: 82, traffic: 95, flood: 64 },
                  { rain: 90, traffic: 98, flood: 76 },
                  { rain: 30, traffic: 55, flood: 20 },
                  { rain: 15, traffic: 42, flood: 6 },
                  { rain: 60, traffic: 82, flood: 38 },
                  { rain: 25, traffic: 48, flood: 14 }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group/bar relative">
                    <div 
                      className="w-full bg-sky-500/80 rounded-t transition-all group-hover/bar:bg-sky-400"
                      style={{ height: `${bar.rain}%` }}
                    />
                    <div 
                      className="w-full bg-amber-500/80 rounded-t transition-all group-hover/bar:bg-amber-400"
                      style={{ height: `${bar.traffic}%` }}
                    />
                    <div 
                      className="w-full bg-rose-500/90 rounded-t transition-all group-hover/bar:bg-rose-400"
                      style={{ height: `${bar.flood}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                <span>Spatial Correlation Coefficient: r = 0.884 (Heavy Rain ↔ Traffic Gridlock)</span>
                <span>Confidence: 99.2% • Source: IMD & CPCB Open Data</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 font-medium leading-relaxed">
              💡 <strong>Historical Pattern Discovery:</strong> Over the last 90 days in Delhi NCR, whenever precipitation exceeded <strong>45 mm/hr</strong>, underpass waterlogging incidents increased by <strong>340% within 18 minutes</strong>, reducing arterial delivery vehicle speeds to under 12 km/h across Pragati Maidan, Minto Road, and IFFCO Chowk.
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: BULK DATA EXPORT CENTER */}
      {activeTab === 'exports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Bulk Raw Civic Datasets for Enterprise Data Science & ERP
              </h3>
              <p className="text-xs text-slate-500">
                Standardized event-oriented schemas with timestamps, coordinates, sensor IDs & data provenance
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              REST / S3 COMPATIBLE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HISTORICAL_DATASETS_ARCHIVE.map(ds => {
              const isDownloaded = downloadSuccessId === ds.id
              return (
                <div key={ds.id} className="bento-card bento-porcelain p-5 flex flex-col justify-between border-2 border-slate-200/80">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                        {ds.id} • {ds.size}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                        {ds.format}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm mb-1.5">
                      {ds.title}
                    </h4>

                    <div className="text-xs text-slate-600 mb-2 font-mono">
                      <span>Timeframe: <strong>{ds.timeframe}</strong></span>
                      <span className="block text-slate-500 mt-0.5">{ds.recordsCount}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {ds.dataTypes.map((type, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      WGS-84 • CPCB / IMD Provenance
                    </span>

                    <button
                      onClick={() => handleDownloadDataset(ds.id, ds.format)}
                      disabled={isDownloaded}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                        isDownloaded 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-900 hover:bg-black text-white'
                      }`}
                    >
                      {isDownloaded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Downloaded!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Export Dataset</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 6. TAB 4: COMMERCIAL PROPERTY ASSET RISK SCORECARD */}
      {activeTab === 'vulnerability' && (
        <div className="bento-card bento-porcelain p-6 space-y-5">
          <div className="max-w-2xl">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Commercial Premises & Warehouse Civic Vulnerability Scorecard
            </h3>
            <p className="text-xs text-slate-500">
              Evaluate real estate, corporate offices, or cloud kitchen hubs for flood susceptibility, power grid redundancy, and road choke points
            </p>
          </div>

          <form onSubmit={handleAnalyzeWarehouseRisk} className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[280px]">
              <input
                type="text"
                value={warehouseAddress}
                onChange={(e) => setWarehouseAddress(e.target.value)}
                placeholder="Enter warehouse, retail hub or commercial facility address..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={analyzingRisk}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              {analyzingRisk ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Calculating Telemetry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Facility Audit</span>
                </>
              )}
            </button>
          </form>

          {riskAssessment && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block uppercase font-mono font-bold">1. Flood Inundation Risk</span>
                <strong className="text-sm font-black text-slate-900 block mt-1">{riskAssessment.floodRisk}</strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block uppercase font-mono font-bold">2. Power Grid Stability</span>
                <strong className="text-sm font-black text-emerald-700 block mt-1">{riskAssessment.powerReliability}</strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block uppercase font-mono font-bold">3. Arterial Fleet Access</span>
                <strong className="text-sm font-black text-amber-700 block mt-1">{riskAssessment.trafficAccess}</strong>
              </div>
              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200">
                <span className="text-purple-700 text-[10px] block uppercase font-mono font-bold">4. Commercial Grade</span>
                <strong className="text-sm font-black text-purple-900 block mt-1">{riskAssessment.overallScore}</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
