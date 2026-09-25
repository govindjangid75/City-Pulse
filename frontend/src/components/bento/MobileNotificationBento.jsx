import React from 'react'
import { Bell, Siren, ShieldAlert, Radio, Clock, ChevronRight } from 'lucide-react'

export default function MobileNotificationBento({ zones = [], onOpenCommandCenter }) {
  const alertZone = zones.find(z => z.status === 'alert') || zones.find(z => z.zone === 'zone-3')

  return (
    <div className="bento-card bento-sky p-6 pb-0 flex flex-col justify-between h-full relative group overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-pulse" />
            <h3 className="font-extrabold text-lg text-sky-950 tracking-tight">Citizen Alerts</h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-200/80 text-sky-950 border border-sky-300">
            PUSH ENGINE
          </span>
        </div>
        <p className="text-xs text-sky-900/80 font-medium mb-4">
          Location-aware resident push notifications & first responder dispatch
        </p>

        {/* Realistic Smartphone Frame Mockup (Givingli Reminders Phone Style) */}
        <div 
          onClick={() => onOpenCommandCenter && onOpenCommandCenter()}
          className="phone-mockup-frame mx-auto w-64 h-48 pt-2 px-3 shadow-2xl relative cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          {/* Dynamic Island Notch */}
          <div className="phone-dynamic-island flex items-center justify-between px-2 text-[8px] text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>

          {/* Time & Lockscreen status */}
          <div className="flex items-center justify-between text-[9px] font-mono font-bold text-slate-500 mt-2 px-1">
            <span>09:41</span>
            <span className="text-emerald-600">● 5G Live</span>
          </div>

          {/* Floating Push Notification Banner */}
          <div className="mt-2 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-md hover:border-rose-300 transition">
            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mb-1">
              <span className="flex items-center gap-1 font-bold text-rose-600">
                <Siren className="w-3 h-3 animate-pulse" /> CIVIC HEALTH ADVISORY
              </span>
              <span className="text-rose-600 font-bold">Open →</span>
            </div>
            <div className="font-bold text-[11px] text-slate-900 leading-tight">
              {alertZone ? `${alertZone.zone.toUpperCase()} Flash Flood Advisory` : 'ITO & Pragati Maidan Flood Advisory'}
            </div>
            <p className="text-[9px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
              Heavy waterlogging (1.2m) at Pragati Maidan underpass. NDRF Pump Unit 12 on scene. Traffic diverted via Ring Road.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
