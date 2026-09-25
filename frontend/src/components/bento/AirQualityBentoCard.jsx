import React from 'react'
import { Wind, Activity, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function AirQualityBentoCard({ zones = [] }) {
  // Sample AQI based on whether storm or industrial elevated
  const hasAlert = zones.some(z => z.status === 'alert')
  const aqiValue = hasAlert ? 84 : 46

  const getAQILevel = (val) => {
    if (val <= 50) return { label: 'Good (Clean)', text: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', bar: 'bg-emerald-400', advice: 'Ideal for outdoor civic activities & cycling.' }
    if (val <= 100) return { label: 'Moderate', text: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30', bar: 'bg-amber-400', advice: 'Sensitive groups should limit prolonged heavy exertion.' }
    return { label: 'Unhealthy', text: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/30', bar: 'bg-rose-400', advice: 'Avoid outdoor exercise; keep windows closed.' }
  }

  const level = getAQILevel(aqiValue)

  return (
    <div className="bento-card p-5 bento-card-sage flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-wide">Air Quality & Atmosphere</h3>
              <p className="text-[11px] text-slate-400 font-medium">CPCB / SAFAR CAAQMS Sensor Array</p>
            </div>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${level.bg} ${level.text}`}>
            {level.label}
          </span>
        </div>

        {/* AQI Score & Visual Spectrum Bar */}
        <div className="my-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-baseline justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{aqiValue}</span>
              <span className="text-xs font-mono text-slate-400">NAQI (India)</span>
            </div>
            <span className={`text-xs font-bold ${level.text}`}>PM2.5 Primary</span>
          </div>

          {/* Color Spectrum Progress Bar */}
          <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full ${level.bar} rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(100, (aqiValue / 200) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            {level.advice}
          </p>
        </div>

        {/* Pollutant Breakdown Grid */}
        <div className="grid grid-cols-3 gap-1.5 my-2 text-center font-mono text-[10px]">
          <div className="p-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-slate-400">PM2.5</div>
            <div className="font-bold text-slate-200 mt-0.5">{hasAlert ? '28.4 µg' : '11.2 µg'}</div>
          </div>
          <div className="p-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-slate-400">PM10</div>
            <div className="font-bold text-slate-200 mt-0.5">{hasAlert ? '44.1 µg' : '22.0 µg'}</div>
          </div>
          <div className="p-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="text-slate-400">NO2 / O3</div>
            <div className="font-bold text-emerald-400 mt-0.5">Low</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Continuous IoT Optical Sensors</span>
        <span className="font-mono text-teal-400">Live Calibration</span>
      </div>
    </div>
  )
}
