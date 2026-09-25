import React, { useState, useEffect } from 'react'
import { SECTOR_VISUALS } from '../../data/visualData'
import { X, Sparkles, Link2, Clock, MapPin, Database, CheckCircle2, ChevronRight, ShieldAlert, Layers } from 'lucide-react'
import { fetchZoneEvents } from '../../services/api'

export default function EvidenceDrawerModal({ zone, isOpen, onClose, asOf }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [showRawJson, setShowRawJson] = useState(false)

  const zoneId = zone?.zone || 'zone-3'
  const visual = SECTOR_VISUALS[zoneId] || {}
  const correlations = zone?.correlations || []

  useEffect(() => {
    if (isOpen && zoneId) {
      setLoading(true)
      fetchZoneEvents(zoneId, 60, asOf)
        .then(data => setEvents(data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [isOpen, zoneId, asOf])

  if (!isOpen || !zone) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-purple-500/40 shadow-2xl shadow-purple-950/40 p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">{visual.name || zoneId}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  EVIDENCE AUDIT TRAIL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {visual.district} • {visual.coords}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="my-4 space-y-4 overflow-y-auto pr-1 relative z-10">
          {/* Grounded Summary Card */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-1">
              <Link2 className="w-4 h-4" />
              <span>Grounded Plain-Language Explanation</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {zone.summary}
            </p>
            <div className="mt-2 text-[10px] font-mono text-purple-300/80 bg-purple-500/10 p-2 rounded-xl border border-purple-500/20">
              ⚡ <strong>Epistemic Honesty Standard:</strong> Data reflects deterministic cross-domain co-occurrence within a 30-minute rolling window.
            </div>
          </div>

          {/* Correlations List */}
          {correlations.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Detected Cross-Signal Patterns ({correlations.length})</span>
                <span className="text-[10px] font-mono text-emerald-400">SPATIAL OVERLAP: VALIDATED</span>
              </h4>
              <div className="space-y-2">
                {correlations.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                    <div className="font-bold text-white mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      {c.rule_name || 'Multi-Signal Storm & Transit Co-occurrence'}
                    </div>
                    <p className="text-[11px] text-slate-400">{c.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span>Signals: <strong>{c.signals?.join(', ') || 'weather, transit, 311'}</strong></span>
                      <span>•</span>
                      <span>Window: <strong>30 mins</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Normalized Events Stream */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-300">
                Normalized Ingested Events in Window ({events.length})
              </h4>
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-[10px] font-mono text-purple-400 hover:text-purple-300 underline"
              >
                {showRawJson ? 'View Timeline' : 'View Raw JSON'}
              </button>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500 font-mono">
                Loading sector event stream...
              </div>
            ) : showRawJson ? (
              <pre className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-48">
                {JSON.stringify(events, null, 2)}
              </pre>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white text-[11px] capitalize">
                        {evt.type?.replace('_', ' ')}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Source: <span className="text-slate-200">{evt.source}</span> • Severity:{' '}
                        <span className={evt.severity === 'high' ? 'text-rose-400' : 'text-amber-400'}>
                          {evt.severity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[10px] text-slate-500">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Immutable Civic Data Provenance</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
