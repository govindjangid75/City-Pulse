import React from 'react'

export default function ZoneDetailModal({ zone, onClose }) {
  if (!zone) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white capitalize">{zone.zone.replace('-', ' ')} Live Diagnostics</h2>
            <p className="text-xs text-slate-400">Time window: Last 30 minutes</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Narrative Summary */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Plain-Language Synthesis</h4>
          <p className="text-sm text-slate-200">{zone.summary}</p>
        </div>

        {/* Detected Multi-Feed Correlations */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Detected Correlations</h4>
          {zone.correlations && zone.correlations.length > 0 ? (
            <div className="space-y-2">
              {zone.correlations.map((corr, idx) => (
                <div key={idx} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between items-center text-amber-300 font-semibold">
                    <span>Rule: {corr.rule_id}</span>
                    <span className="bg-amber-500/20 px-2 py-0.5 rounded text-[10px]">Possible Link</span>
                  </div>
                  <p className="text-slate-300">{corr.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No co-occurring cross-feed correlations detected.</p>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
