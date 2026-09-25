import React from 'react'
import { Play, Pause, RotateCcw, Clock, Calendar, FastForward, Rewind, Sparkles } from 'lucide-react'

export default function HistoricalReplayBentoCard({
  timeline = [],
  currentTimestamp,
  isPlaying,
  onTogglePlay,
  onSelectTimestamp,
  onResetToLive
}) {
  const currentIndex = timeline.findIndex(t => t === currentTimestamp)
  const effectiveIndex = currentIndex >= 0 ? currentIndex : timeline.length - 1
  const progressPercent = timeline.length > 1 ? (effectiveIndex / (timeline.length - 1)) * 100 : 100

  // Format ISO timestamp to readable time
  const formatTime = (iso) => {
    if (!iso) return 'Live Window'
    try {
      const dt = new Date(iso)
      return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } catch {
      return iso
    }
  }

  // Key Event Milestones in the dataset
  const milestones = [
    { label: 'T-00: Normal Baseline', index: 0 },
    { label: 'T-15: Rain Begins', index: Math.floor(timeline.length * 0.3) },
    { label: 'T-25: Underpass Flood', index: Math.floor(timeline.length * 0.6) },
    { label: 'T-45: Multi-Feed Peak', index: timeline.length - 1 }
  ]

  return (
    <div className="bento-card p-5 bento-card-lavender flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-wide">Historical Replay Studio</h3>
              <p className="text-[11px] text-slate-400 font-medium">Step-by-step multi-domain incident evolution scrubber</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full font-bold">
              Time: {formatTime(currentTimestamp)}
            </span>
            <button
              onClick={onResetToLive}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-[11px] font-mono transition"
            >
              Live
            </button>
          </div>
        </div>

        {/* Playback Controls & Scrubber Slider */}
        <div className="my-3 p-4 rounded-2xl bg-slate-900/90 border border-purple-500/20 space-y-3">
          {/* Progress Bar & Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Incident Inception</span>
              <span className="text-purple-300 font-bold">{Math.round(progressPercent)}% Timeline Replay</span>
              <span>Peak Co-occurrence</span>
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
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          {/* Controls Button Row */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => {
                const nextIdx = Math.max(0, effectiveIndex - 1)
                if (timeline[nextIdx]) onSelectTimestamp(timeline[nextIdx])
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Rewind className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Replay' : 'Play Timeline'}</span>
            </button>

            <button
              onClick={() => {
                const nextIdx = Math.min(timeline.length - 1, effectiveIndex + 1)
                if (timeline[nextIdx]) onSelectTimestamp(timeline[nextIdx])
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Key Milestone Quick Jump Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 my-2">
          {milestones.map((m) => (
            <button
              key={m.label}
              onClick={() => timeline[m.index] && onSelectTimestamp(timeline[m.index])}
              className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/40 text-[10px] font-mono text-slate-300 hover:text-white transition text-center truncate"
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Continuous Deterministic Time-Series Playback</span>
        <span className="font-mono text-purple-400">{timeline.length} Ingested Frames</span>
      </div>
    </div>
  )
}
