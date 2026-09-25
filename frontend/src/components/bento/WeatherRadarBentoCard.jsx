import React from 'react'
import { CloudRain, Wind, Droplets, Compass, Sparkles } from 'lucide-react'

export default function WeatherRadarBentoCard({ zones = [] }) {
  const hasStorm = zones.some(z => z.status === 'alert' || (z.correlations && z.correlations.some(c => c.signals?.includes('weather'))))

  const weatherData = hasStorm ? {
    temp: '21°C',
    condition: 'Precipitation Cell',
    precipRate: '48 mm/h',
    rainProbability: '92%',
    wind: '34 km/h NW',
    humidity: '94%',
    radarStatus: 'Active Rain Cell',
    radarColor: 'text-rose-600 bg-rose-50 border-rose-200',
    bgImage: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80'
  } : {
    temp: '26°C',
    condition: 'Partly Sunny & Calm',
    precipRate: '0 mm/h',
    rainProbability: '12%',
    wind: '14 km/h W',
    humidity: '58%',
    radarStatus: 'Clear Sky',
    radarColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    bgImage: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=800&q=80'
  }

  return (
    <div className="bento-card bento-porcelain p-6 flex flex-col justify-between h-full relative group">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-sky-50 text-sky-600">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Doppler Weather</h3>
              <p className="text-[11px] text-slate-500 font-medium">Precipitation radar telemetry</p>
            </div>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${weatherData.radarColor}`}>
            {weatherData.radarStatus}
          </span>
        </div>

        {/* Temperature & Visual Condition */}
        <div className="flex items-end justify-between my-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <div className="text-3xl font-black text-slate-900 leading-none">{weatherData.temp}</div>
            <div className="text-xs font-bold text-sky-700 mt-1">{weatherData.condition}</div>
          </div>

          <div className="text-right font-mono text-[11px] text-slate-500 space-y-0.5">
            <div>Precip: <strong className="text-slate-800">{weatherData.precipRate}</strong></div>
            <div>Rain Risk: <strong className="text-sky-600">{weatherData.rainProbability}</strong></div>
          </div>
        </div>

        {/* Radar Mini Visual Grid */}
        <div className="grid grid-cols-2 gap-2 my-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <span className="text-slate-500 flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-sky-500" /> Wind
            </span>
            <span className="text-slate-800 font-bold">{weatherData.wind}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <span className="text-slate-500 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Humidity
            </span>
            <span className="text-slate-800 font-bold">{weatherData.humidity}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>IMD Doppler Radar (Safdarjung / Mausam Bhavan)</span>
        <span className="font-mono text-emerald-600 font-bold">1 min ago</span>
      </div>
    </div>
  )
}
