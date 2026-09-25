import React, { useState, useMemo } from 'react'
import { 
  CIVIC_PROBLEM_CATEGORIES, 
  REAL_TIME_ALL_INDIA_ALERTS, 
  getFilteredAlerts, 
  getCrossDomainEventFusion 
} from '../data/allIndiaAlertsData'
import { INDIAN_STATES_AND_CITIES } from '../data/visualData'
import { 
  AlertTriangle, ShieldAlert, Sparkles, Filter, Search, 
  MapPin, Clock, ExternalLink, Radio, CheckCircle2, ChevronRight, 
  Camera, Eye, Activity, BellRing, Share2, Layers, Cpu, ArrowUpRight,
  Droplets, Zap, Wind, Car, Train, Volume2, Flame, Building2, Globe
} from 'lucide-react'

export default function AllIndiaAlertsHub({ 
  initialState = 'all', 
  onSelectCityOnMap,
  onNavigateToMap
}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedState, setSelectedState] = useState(initialState)
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAlertForModal, setSelectedAlertForModal] = useState(null)
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState({})
  const [pushedAlerts, setPushedAlerts] = useState({})

  // Available states from master dictionary
  const availableStates = ['all', ...Object.keys(INDIAN_STATES_AND_CITIES)]

  // Filtered alerts memo
  const filteredAlerts = useMemo(() => {
    return getFilteredAlerts({
      state: selectedState,
      category: selectedCategory,
      query: searchQuery
    }).filter(alert => {
      if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) {
        return false
      }
      return true
    })
  }, [selectedState, selectedCategory, selectedSeverity, searchQuery])

  // Count by severity
  const criticalCount = filteredAlerts.filter(a => a.severity === 'critical').length
  const highCount = filteredAlerts.filter(a => a.severity === 'high').length
  const moderateCount = filteredAlerts.filter(a => a.severity === 'moderate' || a.severity === 'low').length

  // Cross-Domain Correlation Example based on selected state
  const activeCitySample = (INDIAN_STATES_AND_CITIES[selectedState] && INDIAN_STATES_AND_CITIES[selectedState][0]) || INDIAN_STATES_AND_CITIES['Delhi NCR'][0]
  const correlationInsight = getCrossDomainEventFusion(activeCitySample)

  const handleAcknowledge = (alertId) => {
    setAcknowledgedAlerts(prev => ({ ...prev, [alertId]: true }))
  }

  const handlePushAlert = (alertId) => {
    setPushedAlerts(prev => ({ ...prev, [alertId]: true }))
    setTimeout(() => {
      setPushedAlerts(prev => ({ ...prev, [alertId]: false }))
    }, 4000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner: Pan-India Real-Time Multi-Domain Alerts */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-inner">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Pan-India Real-Time Civic Alerts & Signals Matrix
                  </h2>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500 text-white flex items-center gap-1.5 shadow-sm animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    LIVE SENSORS
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Unified multi-source civic intelligence across <strong>Weather, AQI, Traffic, Floods, Power, Gas, Noise & 311 Road Hazards</strong> for all Indian States & Cities
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs font-bold font-mono">
              <span className="text-rose-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {criticalCount} Critical
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {highCount} High
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {moderateCount} Moderate
              </span>
            </div>
          </div>

          {/* Quick Problem Category Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-white/10">
            {CIVIC_PROBLEM_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
                    isActive 
                      ? 'bg-white text-slate-900 shadow-md scale-105' 
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive Filter Strip: State Selector + Severity + Free-text Search */}
      <div className="bento-card bento-porcelain p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* State Selector (4 cols) */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>Filter by Indian State / Region</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="all">🇮🇳 All Indian States & Cities (Pan-India Stream)</option>
              {Object.keys(INDIAN_STATES_AND_CITIES).map(st => (
                <option key={st} value={st}>
                  {st} ({INDIAN_STATES_AND_CITIES[st]?.length} Major Cities)
                </option>
              ))}
            </select>
          </div>

          {/* Severity Selector (3 cols) */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Severity Level</span>
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            >
              <option value="all">All Severity Tiers</option>
              <option value="critical">🔴 Critical / Emergency Only</option>
              <option value="high">🟠 High Warning Only</option>
              <option value="moderate">🟡 Moderate / Watch Only</option>
            </select>
          </div>

          {/* Keyword Search (5 cols) */}
          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Search any City, Landmark, or Alert Keyword</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Pragati Maidan, Flood, Substation, Hinjawadi, AQI, Silk Board..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Cross-Domain Multi-Signal Event Fusion Explainer ("Why is this happening?" - PDF Requirement) */}
      {correlationInsight && (
        <div className="bento-card bento-porcelain p-5 bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-blue-50/60 border border-indigo-200/80 shadow-sm relative overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {correlationInsight.title}
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300">
                    AI FUSION ENGINE
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Multi-signal spatial correlation window: <strong>{correlationInsight.timeWindow}</strong> (Confidence: {correlationInsight.confidence})
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-slate-500 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
              {correlationInsight.epistemicHonestyNote}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-3">
            {correlationInsight.signalsInvolved.map((sig, idx) => (
              <div key={idx} className="bg-white/90 p-2.5 rounded-xl border border-indigo-100/80 shadow-xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase">{sig.name}</div>
                <div className="text-xs font-black text-slate-900 mt-0.5">{sig.value}</div>
                <span className={`inline-block text-[9px] font-bold font-mono px-1.5 py-0.2 rounded mt-1 ${
                  sig.status === 'alert' 
                    ? 'bg-rose-100 text-rose-800' 
                    : sig.status === 'elevated' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {sig.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-3 rounded-xl border border-indigo-100 font-medium">
            💡 <strong>Cross-Feed Analysis:</strong> {correlationInsight.plainLanguageSummary}
          </p>
        </div>
      )}

      {/* 4. Real-Time Multi-Domain Alerts Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Live Verified Civic Incidents ({filteredAlerts.length})
            </h3>
            <span className="text-xs font-bold text-slate-500">
              • Showing {selectedCategory === 'all' ? 'All 9 Categories' : selectedCategory} in {selectedState === 'all' ? 'Pan-India' : selectedState}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE TELEMETRY AUTO-REFRESH
          </span>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="bento-card bento-porcelain p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-800">No Critical Alerts in Selected View</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All sensors and feeds for <strong>{selectedState === 'all' ? 'this filter' : selectedState}</strong> are currently within baseline thresholds. Try selecting "All Indian States" or adjusting the category filter.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedState('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredAlerts.map(alert => {
              const isCrit = alert.severity === 'critical'
              const isHigh = alert.severity === 'high'
              const isAck = acknowledgedAlerts[alert.id]
              const isPushed = pushedAlerts[alert.id]

              const severityBadge = isCrit
                ? { bg: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500', label: 'CRITICAL / EMERGENCY' }
                : isHigh
                ? { bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500', label: 'HIGH WARNING' }
                : { bg: 'bg-blue-50 text-blue-800 border-blue-200', dot: 'bg-blue-500', label: 'WATCH / MODERATE' }

              return (
                <div
                  key={alert.id}
                  className={`bento-card bento-porcelain p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg border-2 ${
                    isCrit ? 'border-rose-200/90 hover:border-rose-300' : 'border-slate-200/80 hover:border-indigo-300'
                  }`}
                >
                  <div>
                    {/* Top Row: Category + State/City + Severity */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl p-1.5 rounded-xl bg-slate-100 shadow-xs">
                          {alert.icon}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                            {alert.state} • {alert.district || alert.city.split('(')[0]}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {alert.categoryName}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${severityBadge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${severityBadge.dot} ${isCrit ? 'animate-ping' : ''}`} />
                          {severityBadge.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Alert Title */}
                    <h4 className="font-black text-slate-900 text-sm sm:text-base leading-snug mb-1.5">
                      {alert.title}
                    </h4>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-slate-600 font-medium mb-3">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{alert.location}</span>
                    </div>

                    {/* High-Res Photo Preview & Sensor Evidence Box */}
                    <div className="grid grid-cols-12 gap-3 mb-3">
                      <div className="col-span-4 relative rounded-xl overflow-hidden border border-slate-200 group/img bg-slate-100 h-24">
                        <img 
                          src={alert.photo} 
                          alt={alert.title} 
                          className="w-full h-full object-cover group-hover/img:scale-105 transition duration-300" 
                        />
                        <button
                          onClick={() => setSelectedAlertForModal(alert)}
                          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition text-xs font-bold gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </div>

                      <div className="col-span-8 flex flex-col justify-between text-xs text-slate-600 bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80 font-mono text-[11px]">
                        <div>
                          <span className="font-bold text-slate-800 block text-[10px] uppercase text-indigo-700">
                            📡 Sensor Evidence Trail
                          </span>
                          <span className="line-clamp-2 mt-0.5 text-slate-700">
                            {alert.evidence}
                          </span>
                        </div>

                        <div className="mt-1 pt-1 border-t border-slate-200/60 text-[10px] text-slate-500">
                          Authority: <strong>{alert.actionAuthority}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Description Text */}
                    <p className="text-xs text-slate-700 leading-relaxed mb-3 font-medium">
                      {alert.details}
                    </p>

                    {/* Correlated Overlapping Signals Tag List */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Co-occurring:</span>
                      {alert.correlatedSignals.map((sig, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 shadow-xs"
                        >
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedAlertForModal(alert)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Inspect Photographic Proof</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePushAlert(alert.id)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition flex items-center gap-1 ${
                          isPushed 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <BellRing className={`w-3.5 h-3.5 ${isPushed ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>{isPushed ? 'Pushed to Citizens!' : 'Push Broadcast'}</span>
                      </button>

                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1 ${
                          isAck 
                            ? 'bg-emerald-700 text-white' 
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isAck ? 'Acknowledged' : 'Acknowledge'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 5. Photographic Evidence & Sensor Audit Modal */}
      {selectedAlertForModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-2xl bg-slate-100">
                  {selectedAlertForModal.icon}
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedAlertForModal.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {selectedAlertForModal.state} • {selectedAlertForModal.location}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAlertForModal(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* High-Res Photo Evidence */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <img 
                src={selectedAlertForModal.photo} 
                alt={selectedAlertForModal.title} 
                className="w-full h-64 object-cover" 
              />
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Coordinates</span>
                <span className="font-bold text-slate-800">
                  {selectedAlertForModal.coordinates[0].toFixed(4)}°N, {selectedAlertForModal.coordinates[1].toFixed(4)}°E
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Severity</span>
                <span className="font-bold text-rose-700 uppercase">
                  {selectedAlertForModal.severity}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Timestamp</span>
                <span className="font-bold text-slate-800">
                  {selectedAlertForModal.timestamp}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Status</span>
                <span className="font-bold text-emerald-700">
                  {selectedAlertForModal.status}
                </span>
              </div>
            </div>

            {/* Detailed Sensor Audit */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900">
                Detailed Incident Narrative & Sensor Validation:
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {selectedAlertForModal.details}
              </p>
              <div className="text-[11px] font-mono text-indigo-900 bg-indigo-50 p-2.5 rounded-xl border border-indigo-200">
                📡 <strong>Evidence Lineage:</strong> {selectedAlertForModal.evidence}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedAlertForModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
              >
                Close Audit
              </button>
              <button
                onClick={() => {
                  handleAcknowledge(selectedAlertForModal.id)
                  setSelectedAlertForModal(null)
                }}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Confirm & Log Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
