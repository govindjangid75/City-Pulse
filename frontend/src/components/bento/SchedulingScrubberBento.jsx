import React, { useState } from 'react'
import { Calendar, Play, Pause, RotateCcw, Clock, Sparkles, Check, CloudLightning, ZapOff, Car, SunMedium } from 'lucide-react'
import { triggerScenario, resetSimulationDatabase } from '../../services/api'
import { SIMULATION_SCENARIOS } from '../../data/visualData'

export default function SchedulingScrubberBento({
  timeline = [],
  currentTimestamp,
  isPlaying,
  onTogglePlay,
  onSelectTimestamp,
  onScenarioTriggered
}) {
  const [loadingScenario, setLoadingScenario] = useState(null)
  const [successScenario, setSuccessScenario] = useState(null)

  const currentIndex = timeline.findIndex(t => t === currentTimestamp)
  const effectiveIndex = currentIndex >= 0 ? currentIndex : timeline.length - 1

  const formatDisplayTime = (iso) => {
    if (!iso) return { date: 'September 25', time: '05:00 AM' }
    try {
      const dt = new Date(iso)
      const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const timeStr = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      return { date: dateStr, time: timeStr }
    } catch {
      return { date: 'Today', time: 'Live' }
    }
  }

  const { date, time } = formatDisplayTime(currentTimestamp)

  const handleTrigger = async (sc) => {
    try {
      setLoadingScenario(sc.id)
      await triggerScenario(sc.id, sc.zone)
      setSuccessScenario(sc.id)
      if (onScenarioTriggered) onScenarioTriggered()
      setTimeout(() => setSuccessScenario(null), 3000)
    } catch (err) {
      console.error('Failed scenario', err)
    } finally {
      setLoadingScenario(null)
    }
  }

  return (
    <div className="bento-card bento-coral p-6 flex flex-col justify-between h-full relative group">
      {/* Top Section */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
              <h3 className="font-extrabold text-lg text-rose-950 tracking-tight">Timeline & Sandbox</h3>
            </div>
            <p className="text-xs text-rose-900/80 font-medium leading-relaxed">
              Scrub chronological multi-signal evolution or inject 1-click test scenarios.
            </p>

            {/* 1-Click Indian Crisis Preset Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {SIMULATION_SCENARIOS.map(sc => {
                const isLoading = loadingScenario === sc.id
                const isSuccess = successScenario === sc.id
                return (
                  <button
                    key={sc.id}
                    onClick={() => handleTrigger(sc)}
                    disabled={isLoading}
                    className="px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-rose-950 font-bold text-[11px] shadow-sm hover:shadow-md transition flex items-center gap-1.5 border border-rose-200/80 active:scale-95"
                    title={sc.description}
                  >
                    {isSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Sparkles className="w-3.5 h-3.5 text-rose-600" />}
                    <span>{sc.title.split(' ')[0]} {sc.title.split(' ')[1]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Floating Time Picker / Calendar Sheet Widget (Givingli Inspired) */}
          <div className="floating-widget p-4 w-52 shrink-0 bg-white border border-rose-100 shadow-xl">
            <div className="text-[10px] font-mono font-bold text-rose-900/60 uppercase tracking-wider mb-2">
              Scrubber Timestamp
            </div>

            <div className="space-y-1.5 border-y border-slate-100 py-2 my-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>July</span>
                <span>15</span>
                <span>11:00 AM</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 font-mono bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                <span className="text-rose-900">{date}</span>
                <span className="text-rose-950">{time}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>October</span>
                <span>21</span>
                <span>06:00 PM</span>
              </div>
            </div>

            <button
              onClick={onTogglePlay}
              className="w-full mt-2 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Scrubber Range Slider */}
        <div className="mt-5 p-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-rose-200/60">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-rose-950 mb-1.5">
            <span>Inception</span>
            <span className="text-rose-700">{date} • {time}</span>
            <span>Peak Crisis</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(0, timeline.length - 1)}
            value={effectiveIndex}
            onChange={(e) => {
              const idx = parseInt(e.target.value)
              if (timeline[idx]) onSelectTimestamp(timeline[idx])
            }}
            className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
        </div>
      </div>

      {/* Subtext */}
      <div className="pt-3 border-t border-rose-200/80 flex items-center justify-between text-[11px] text-rose-950/80 font-medium">
        <span>Deterministic Multi-Hour Replay Engine</span>
        <span className="font-mono font-bold">{timeline.length} Time Frames Ingested</span>
      </div>
    </div>
  )
}
