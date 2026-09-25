import React, { useState } from 'react'
import { SIMULATION_SCENARIOS } from '../../data/visualData'
import { Cpu, Play, RotateCcw, Sparkles, Check, CloudLightning, ZapOff, Car, SunMedium } from 'lucide-react'
import { triggerScenario, resetSimulationDatabase } from '../../services/api'

export default function CrisisSimulatorBentoCard({ onScenarioTriggered }) {
  const [loadingScenario, setLoadingScenario] = useState(null)
  const [successScenario, setSuccessScenario] = useState(null)

  const iconMap = {
    CloudLightning: CloudLightning,
    ZapOff: ZapOff,
    Car: Car,
    SunMedium: SunMedium
  }

  const handleTrigger = async (sc) => {
    try {
      setLoadingScenario(sc.id)
      await triggerScenario(sc.id, sc.zone)
      setSuccessScenario(sc.id)
      if (onScenarioTriggered) onScenarioTriggered()
      setTimeout(() => setSuccessScenario(null), 3000)
    } catch (err) {
      console.error('Failed to trigger scenario', err)
    } finally {
      setLoadingScenario(null)
    }
  }

  const handleReset = async () => {
    try {
      setLoadingScenario('reset')
      await resetSimulationDatabase()
      if (onScenarioTriggered) onScenarioTriggered()
    } catch (err) {
      console.error('Failed to reset', err)
    } finally {
      setLoadingScenario(null)
    }
  }

  return (
    <div className="bento-card p-5 bento-card-amber flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-wide">Live Crisis Sandbox</h3>
              <p className="text-[11px] text-slate-400 font-medium">1-Click hackathon demonstration presets</p>
            </div>
          </div>

          <button
            onClick={handleReset}
            disabled={loadingScenario === 'reset'}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-[11px] font-mono transition"
          >
            <RotateCcw className={`w-3 h-3 ${loadingScenario === 'reset' ? 'animate-spin' : ''}`} />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* 2x2 Scenario Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2">
          {SIMULATION_SCENARIOS.map((sc) => {
            const Icon = iconMap[sc.icon] || Sparkles
            const isLoading = loadingScenario === sc.id
            const isSuccess = successScenario === sc.id

            return (
              <button
                key={sc.id}
                onClick={() => handleTrigger(sc)}
                disabled={isLoading}
                className={`p-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group/btn flex flex-col justify-between bg-gradient-to-br ${sc.color} hover:scale-[1.02] shadow-md`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-slate-300 border border-white/10">
                    {sc.badge}
                  </span>
                </div>

                <div>
                  <h5 className="font-bold text-xs text-white group-hover/btn:text-amber-200 transition-colors">
                    {sc.title}
                  </h5>
                  <p className="text-[10px] text-slate-300 line-clamp-2 mt-0.5 leading-snug">
                    {sc.description}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <span>Target: {sc.zone.toUpperCase()}</span>
                  <span className="font-bold flex items-center gap-1 text-amber-300">
                    {isSuccess ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Injected
                      </>
                    ) : isLoading ? (
                      'Simulating...'
                    ) : (
                      <>
                        Inject Event <Play className="w-2.5 h-2.5 fill-current" />
                      </>
                    )}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Instant Cross-Domain Cascade Engine</span>
        <span className="font-mono text-amber-400">Deterministic Generator</span>
      </div>
    </div>
  )
}
