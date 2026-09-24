import React, { useState, useEffect } from 'react'
import { 
  X, AlertTriangle, ShieldCheck, Sparkles, CloudRain, 
  Train, PhoneCall, ChevronDown, ChevronUp, Code, Clock, Info, ExternalLink 
} from 'lucide-react'
import { fetchZoneEvents } from '../services/api'

export default function ZoneDetailModal({ zone, onClose, asOf }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFeedFilter, setSelectedFeedFilter] = useState('all')
  const [expandedEventId, setExpandedEventId] = useState(null)
  const [windowMinutes, setWindowMinutes] = useState(60)

  useEffect(() => {
    if (!zone) return
    let isMounted = true
    setLoading(true)

    fetchZoneEvents(zone.zone, windowMinutes, asOf)
      .then(data => {
        if (isMounted) setEvents(data || [])
      })
      .catch(err => console.error('Failed to load zone events', err))
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [zone, windowMinutes, asOf])

  if (!zone) return null

  const correlations = zone.correlations || []
  const status = zone.status || 'calm'

  const filteredEvents = events.filter(e => {
    if (selectedFeedFilter === 'all') return true
    return e.source === selectedFeedFilter
  })

  const getSourceBadge = (source) => {
    if (source === 'weather') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
          <CloudRain className="w-3 h-3 text-sky-400" /> Weather
        </span>
      )
    }
    if (source === 'transit') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Train className="w-3 h-3 text-amber-400" /> Transit
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
        <PhoneCall className="w-3 h-3 text-purple-400" /> 311 Reports
      </span>
    )
  }

  const getSeverityBadge = (severity) => {
    if (severity === 'high') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40">HIGH</span>
    }
    if (severity === 'medium') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">MEDIUM</span>
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">LOW</span>
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-white capitalize tracking-wide">
                {zone.zone.replace('-', ' ')} Live Diagnostics
              </h2>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                status === 'alert' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                status === 'elevated' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                {status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-feed ingestion timeline & spatial correlation reasoning
            </p>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          {/* Epistemic Honesty Alert */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-slate-300 leading-relaxed">
              <strong className="text-white font-semibold">Civic Honesty Guarantee:</strong> CityPulse correlates concurrent multi-feed signals and frames relationships strictly as <em className="text-amber-300 font-mono not-italic font-medium">possible links</em>. Co-occurrence provides actionable awareness without asserting unfounded causation.
            </div>
          </div>

          {/* Plain-Language Narrative */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-1.5">
            <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Plain-Language Synthesis
            </h4>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {zone.summary}
            </p>
          </div>

          {/* Detected Cross-Feed Correlations */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Detected Multi-Feed Correlations ({correlations.length})
              </h4>
            </div>

            {correlations.length > 0 ? (
              <div className="space-y-2.5">
                {correlations.map((corr, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                          Rule: {corr.rule_id}
                        </span>
                        <div className="flex items-center gap-1">
                          {corr.sources_involved.map(src => (
                            <span key={src} className="text-[10px] font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300 capitalize">
                              {src}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase">
                        Possible Link
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {corr.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No cross-feed co-occurrence rules triggered. Sector activity is isolated and within baseline.</span>
              </div>
            )}
          </div>

          {/* Feed Stream & Filter Controls */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Normalized Feed Stream ({filteredEvents.length} events)
              </h4>

              {/* Feed Filters */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                {['all', 'weather', 'transit', '311'].map(filterKey => (
                  <button
                    key={filterKey}
                    onClick={() => setSelectedFeedFilter(filterKey)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition capitalize ${
                      selectedFeedFilter === filterKey
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filterKey === '311' ? '311' : filterKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Events List */}
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                Loading normalized event stream...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-mono bg-slate-950/40 rounded-xl border border-slate-800">
                No events recorded for this filter in the evaluated window.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEvents.map(event => {
                  const isExpanded = expandedEventId === event.id
                  return (
                    <div 
                      key={event.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {getSourceBadge(event.source)}
                          <span className="font-semibold text-xs text-slate-200 capitalize">
                            {event.type.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {getSeverityBadge(event.severity)}
                          <span className="text-[11px] font-mono text-slate-500">
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                            title="Inspect raw payload"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Payload snippet preview */}
                      {event.payload && Object.keys(event.payload).length > 0 && !isExpanded && (
                        <p className="text-[11px] text-slate-400 truncate font-mono">
                          {JSON.stringify(event.payload).replace(/[{}\"]/g, ' ')}
                        </p>
                      )}

                      {/* Expanded Raw Payload JSON Inspector */}
                      {isExpanded && (
                        <div className="pt-2 border-t border-slate-800/80 mt-2">
                          <div className="flex items-center justify-between mb-1 text-[10px] font-mono text-slate-400">
                            <span className="flex items-center gap-1">
                              <Code className="w-3 h-3 text-emerald-400" />
                              Raw Event Schema Payload
                            </span>
                            <span>ID: {event.id}</span>
                          </div>
                          <pre className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                            {JSON.stringify(event, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <span className="text-[11px] font-mono text-slate-500">
            Spatial Unit: {zone.zone} • Evaluated Window: {windowMinutes}m
          </span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  )
}
