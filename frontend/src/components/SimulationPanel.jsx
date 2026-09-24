import React, { useState } from 'react'
import { 
  X, Cpu, CloudRain, Train, AlertTriangle, Sun, PlusCircle, 
  Send, RotateCcw, Check, Sparkles, Flame 
} from 'lucide-react'
import { triggerScenario, injectCustomEvent, resetSimulationDatabase } from '../services/api'

export default function SimulationPanel({ onClose, onEventInjected }) {
  const [activeTab, setActiveTab] = useState('scenarios')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // Custom Event Form State
  const [customZone, setCustomZone] = useState('zone-3')
  const [customSource, setCustomSource] = useState('311')
  const [customType, setCustomType] = useState('street_flooding')
  const [customSeverity, setCustomSeverity] = useState('high')
  const [customDescription, setCustomDescription] = useState('Water main burst with road impassable near intersection')

  const handleScenario = async (scenarioName, zone = 'zone-3') => {
    setLoading(true)
    setSuccessMsg('')
    try {
      await triggerScenario(scenarioName, zone)
      setSuccessMsg(`Successfully triggered "${scenarioName}" in ${zone}!`)
      if (onEventInjected) onEventInjected()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg('')
    try {
      const payload = {
        zone: customZone,
        source: customSource,
        type: customType,
        severity: customSeverity,
        timestamp: new Date().toISOString(),
        payload: {
          category: customType,
          description: customDescription,
          injected_by: 'live_demo_panel'
        }
      }
      await injectCustomEvent(payload)
      setSuccessMsg(`Injected custom ${customSource} event into ${customZone}!`)
      if (onEventInjected) onEventInjected()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    setLoading(true)
    try {
      await resetSimulationDatabase()
      setSuccessMsg('Database reset to baseline sample dataset.')
      if (onEventInjected) onEventInjected()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Interactive Demo & Simulator Panel</h2>
              <p className="text-xs text-slate-400">Trigger multi-feed crisis scenarios or inject custom civic reports</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-2">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'scenarios'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Preset Scenarios
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'custom'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Inject Custom Event
          </button>
        </div>

        {/* Status Toast */}
        {successMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 space-y-4">
          {activeTab === 'scenarios' ? (
            <div className="space-y-3">
              {/* Scenario 1: Storm & Flood Alert */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-red-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-sky-400" />
                    <h4 className="text-sm font-bold text-white group-hover:text-red-300 transition">
                      ⛈️ Severe Storm & Underpass Flood (Zone 3)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Injects flash flood alert, Red Line subway suspension, and multiple citizen street flooding reports. Triggers <strong className="text-red-400 font-mono">ALERT</strong> status & multi-feed cascade correlation.
                  </p>
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleScenario('storm_flood', 'zone-3')}
                  className="px-3.5 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold shrink-0 transition"
                >
                  Trigger Storm
                </button>
              </div>

              {/* Scenario 2: Rush Hour Transit Failure */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      🚦 Rush Hour Transit & Signal Breakdown (Zone 2)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Injects Blue Line 18-minute delay + traffic signal blackout in West Park corridor. Triggers <strong className="text-amber-400 font-mono">ELEVATED</strong> status with transit-incident link.
                  </p>
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleScenario('rush_hour_congestion', 'zone-2')}
                  className="px-3.5 py-2 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-white text-xs font-bold shrink-0 transition"
                >
                  Trigger Transit Delay
                </button>
              </div>

              {/* Scenario 3: Extreme Heat Advisory */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-orange-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition">
                      🔥 Heat Wave & Grid Strain (Zone 4)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Injects 41°C extreme heat warning and electrical substation power surge reports in East River Industrial.
                  </p>
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleScenario('heat_wave', 'zone-4')}
                  className="px-3.5 py-2 rounded-lg bg-orange-600/80 hover:bg-orange-500 text-white text-xs font-bold shrink-0 transition"
                >
                  Trigger Heat Wave
                </button>
              </div>
            </div>
          ) : (
            /* Custom Event Ingestion Form */
            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Sector</label>
                  <select
                    value={customZone}
                    onChange={(e) => setCustomZone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="zone-1">Zone 1 (North Uptown)</option>
                    <option value="zone-2">Zone 2 (West Park)</option>
                    <option value="zone-3">Zone 3 (Downtown Core)</option>
                    <option value="zone-4">Zone 4 (East Industrial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Data Source Feed</label>
                  <select
                    value={customSource}
                    onChange={(e) => setCustomSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="311">311 Incident Feed</option>
                    <option value="weather">Weather Feed</option>
                    <option value="transit">Transit Authority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Normalized Severity</label>
                  <select
                    value={customSeverity}
                    onChange={(e) => setCustomSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="high">High / Critical</option>
                    <option value="medium">Medium / Warning</option>
                    <option value="low">Low / Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Event Type Key</label>
                <input
                  type="text"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="e.g. flood_alert, delay, power_outage"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Report Description & Payload Details</label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                Inject Event & Broadcast to Dashboard
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset DB to Initial Seed
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
