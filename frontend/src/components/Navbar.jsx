import React, { useState, useRef, useEffect } from 'react'
import { 
  Radio, RefreshCw, Play, RotateCcw, Cpu, User, LogIn, LogOut, 
  ChevronDown, Sparkles, MapPin, LayoutGrid, ShieldAlert, Clock,
  Flame, Bell, Compass, HeartPulse, Home, Building2, Truck, Crown
} from 'lucide-react'

export default function Navbar({ 
  wsStatus, 
  replayMode, 
  onToggleReplay, 
  onResetDatabase, 
  onRefresh, 
  onOpenSimulator,
  currentUser,
  onOpenAuth,
  onSignOut,
  activeTab,
  onSelectTab,
  activeSubscription,
  onOpenSubscriptionModal
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getRoleBadge = (role) => {
    switch (role) {
      case 'responder':
        return { label: '🚨 First Responder', bg: 'bg-rose-100 text-rose-800 border-rose-200' }
      case 'analyst':
        return { label: '🏛️ City Analyst', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
      default:
        return { label: '👤 Resident / Citizen', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
    }
  }

  const roleInfo = currentUser ? getRoleBadge(currentUser.role) : null

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 py-3.5 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                CityPulse
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  INDIA LIVE
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Multi-Feed Spatial Telemetry & Civic Health
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('home')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'home'
                ? 'bg-white text-slate-900 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-indigo-600" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onSelectTab('citizen')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'citizen'
                ? 'bg-white text-slate-900 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-violet-600" />
            <span>Live Dashboard</span>
          </button>

          <button
            onClick={() => onSelectTab('alerts')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'alerts'
                ? 'bg-white text-slate-900 font-extrabold shadow-sm ring-1 ring-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>Real-Time Alerts</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500 text-white">
              9 DOMAINS
            </span>
          </button>

          <button
            onClick={() => onSelectTab('admin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'admin'
                ? 'bg-white text-slate-900 font-extrabold shadow-sm ring-1 ring-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Admin Portal</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
              24h SLA
            </span>
          </button>

          <button
            onClick={() => onSelectTab('business')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'business'
                ? 'bg-white text-slate-900 font-extrabold shadow-sm ring-1 ring-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-purple-600" />
            <span>Business Intel</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-200">
              PRO
            </span>
          </button>

          <button
            onClick={() => onSelectTab('command')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'command'
                ? 'bg-white text-slate-900 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Command Center</span>
          </button>

          <button
            onClick={() => onSelectTab('replay')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'replay'
                ? 'bg-white text-slate-900 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Replay Studio</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Subscription Tier Pill & Upgrade Trigger */}
          {onOpenSubscriptionModal && (
            <button
              onClick={onOpenSubscriptionModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 border border-amber-300 text-slate-800 text-xs font-bold transition shadow-xs"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{activeSubscription?.name || 'Plans & Pricing'}</span>
              <span className="text-[9px] font-mono font-black uppercase text-amber-700 bg-white/80 px-1.5 py-0.5 rounded border border-amber-200">
                {activeSubscription?.id === 'free' ? 'UPGRADE' : 'ACTIVE'}
              </span>
            </button>
          )}

          {/* Live Feed Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-mono font-medium">
            <span className={`w-2 h-2 rounded-full ${
              wsStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
              wsStatus === 'connecting' ? 'bg-amber-500 animate-ping' : 'bg-rose-500'
            }`} />
            <span className="text-slate-700 text-[10px] hidden md:inline font-bold">
              {wsStatus === 'connected' ? 'Feeds Live' : 'Connecting'}
            </span>
          </div>

          {/* Crisis Demo Presets Button */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-sm active:scale-95 transition"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Demo Scenarios</span>
          </button>

          {/* Refresh Data */}
          <button
            onClick={onRefresh}
            title="Refresh All Feeds"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* User Auth Section */}
          <div className="relative" ref={dropdownRef}>
            {currentUser ? (
              <div>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden md:inline">
                    {currentUser.full_name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in">
                    <div className="p-2 border-b border-slate-100 mb-2">
                      <div className="font-bold text-sm text-slate-900">{currentUser.full_name}</div>
                      <div className="text-xs text-slate-500 font-mono truncate">{currentUser.email}</div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${roleInfo?.bg}`}>
                          {roleInfo?.label}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setProfileDropdownOpen(false); onOpenAuth('signin'); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Switch Persona / Login</span>
                    </button>

                    <button
                      onClick={() => { setProfileDropdownOpen(false); onSignOut(); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-700 hover:bg-rose-50 transition flex items-center gap-2 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('signin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white transition shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
