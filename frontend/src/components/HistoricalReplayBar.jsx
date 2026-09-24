import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, FastForward, Rewind, Calendar, Clock, History } from 'lucide-react'
import { fetchHistoryTimeline } from '../services/api'

export default function HistoricalReplayBar({ 
  currentTimestamp, 
  onSelectTimestamp, 
  isPlaying, 
  onTogglePlay, 
  onResetToLive 
}) {
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistoryTimeline()
      .then(data => {
        if (data && data.length > 0) {
          setTimeline(data)
          if (!currentTimestamp) {
            onSelectTimestamp(data[data.length - 1])
          }
        }
      })
      .catch(err => console.error('Failed to load timeline', err))
      .finally(() => setLoading(false))
  }, [])

  const currentIndex = timeline.findIndex(t => t === currentTimestamp)
  const safeIndex = currentIndex >= 0 ? currentIndex : timeline.length - 1

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value, 10)
    if (timeline[idx]) {
      onSelectTimestamp(timeline[idx])
    }
  }

  const handleStepBack = () => {
    if (safeIndex > 0) {
      onSelectTimestamp(timeline[safeIndex - 1])
    }
  }

  const handleStepForward = () => {
    if (safeIndex < timeline.length - 1) {
      onSelectTimestamp(timeline[safeIndex + 1])
    }
  }

  const formatDisplayTime = (isoString) => {
    if (!isoString) return 'Live Real-Time'
    try {
      const dt = new Date(isoString)
      return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } catch {
      return isoString
    }
  }

  return (
    <div className="glass-panel-glow rounded-2xl p-4 border border-indigo-500/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 shadow-2xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <History className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Historical Time Scrubber</h3>
            <p className="text-[11px] text-indigo-300/80">
              Scrub or replay timestamps to observe how civic anomalies formed over time
            </p>
          </div>
        </div>

        {/* Current Scrub Time Display */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-indigo-500/30 font-mono text-xs">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">Scrubbed Time:</span>
          <span className="text-indigo-300 font-bold">
            {formatDisplayTime(currentTimestamp)}
          </span>
          <span className="text-slate-500 text-[10px]">
            ({safeIndex + 1} / {timeline.length || 1})
          </span>
        </div>
      </div>

      {/* Scrubber Controls & Slider */}
      <div className="flex items-center gap-3">
        {/* Play / Pause / Step Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleStepBack}
            disabled={safeIndex <= 0}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
            title="Previous Event Moment"
          >
            <Rewind className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" /> Play
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            disabled={safeIndex >= timeline.length - 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
            title="Next Event Moment"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Slider */}
        <div className="flex-1 px-2">
          <input
            type="range"
            min="0"
            max={Math.max(0, timeline.length - 1)}
            value={safeIndex}
            onChange={handleSliderChange}
            className="w-full accent-indigo-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer border border-indigo-500/30"
          />
        </div>

        {/* Jump to Live */}
        <button
          onClick={onResetToLive}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-mono font-medium border border-indigo-500/30 transition"
        >
          Jump to Latest
        </button>
      </div>
    </div>
  )
}
