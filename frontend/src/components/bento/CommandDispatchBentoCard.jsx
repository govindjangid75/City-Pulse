import React, { useState } from 'react'
import { OFFICIAL_RESPONDER_UNITS } from '../../data/visualData'
import { ShieldAlert, Siren, Navigation, CheckCircle, Radio, Clock, UserCheck, AlertCircle } from 'lucide-react'

export default function CommandDispatchBentoCard({ zones = [] }) {
  const [units, setUnits] = useState(OFFICIAL_RESPONDER_UNITS)
  const [dispatchedId, setDispatchedId] = useState(null)

  const handleDispatch = (unitId) => {
    setUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          status: u.status === 'Standby' ? 'Dispatched' : 'On Scene',
          eta: '2 mins'
        }
      }
      return u
    }))
    setDispatchedId(unitId)
    setTimeout(() => setDispatchedId(null), 3000)
  }

  return (
    <div className="bento-card p-5 bento-card-coral flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Background visual glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-wide">Command Operations & Dispatch</h3>
              <p className="text-[11px] text-slate-400 font-medium">Emergency responder triage & resource allocation</p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <Radio className="w-3 h-3 animate-ping" />
            DISPATCH FREQ: SEC-9
          </span>
        </div>

        {/* Units Grid */}
        <div className="space-y-2.5 my-2">
          {units.map((unit) => {
            const isStandby = unit.status === 'Standby'
            const isOnScene = unit.status === 'On Scene'
            return (
              <div
                key={unit.id}
                className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {unit.id}
                    </span>
                    <h5 className="font-bold text-xs text-white">{unit.name}</h5>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                    <span>{unit.location}</span>
                    <span>•</span>
                    <span className="text-slate-300">Incident: {unit.assignedIncident}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isOnScene
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : isStandby
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {unit.status}
                  </span>

                  {isStandby && (
                    <button
                      onClick={() => handleDispatch(unit.id)}
                      className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold text-[10px] shadow-sm active:scale-95 transition"
                    >
                      Dispatch Unit
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-rose-400" />
          <span>Avg Response Time: <strong>4.8 mins</strong></span>
        </div>
        <span className="font-mono text-rose-400">EOC Channel 1 Active</span>
      </div>
    </div>
  )
}
