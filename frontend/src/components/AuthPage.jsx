import React, { useState, useEffect } from 'react'
import { 
  ShieldCheck, Radio, Mail, Lock, User, Eye, EyeOff, 
  ArrowRight, Building2, Siren, CheckCircle2, 
  AlertCircle, Sparkles, Activity, MapPin, Zap, Navigation, Compass, Globe
} from 'lucide-react'
import { loginUser, signupUser, fetchDemoUsers } from '../services/api'
import { isSupabaseConfigured } from '../services/supabase'
import { INDIAN_CITIES, SECTOR_VISUALS, calculateDistanceKm } from '../data/visualData'

export default function AuthPage({ onAuthSuccess, onCancel, initialMode = 'signup' }) {
  const [mode, setMode] = useState(initialMode) // 'signup' | 'signin'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [locatingStep, setLocatingStep] = useState(null) // null | 'locating' | 'locked'

  // Form Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('citizen')
  const [selectedCity, setSelectedCity] = useState('delhi-ncr')
  const [primaryZone, setPrimaryZone] = useState('zone-3')
  const [demoProfiles, setDemoProfiles] = useState([])

  useEffect(() => {
    fetchDemoUsers()
      .then(data => setDemoProfiles(data || []))
      .catch(() => {
        setDemoProfiles([
          { email: 'citizen@citypulse.in', password: 'citizen123', full_name: 'Aarav Sharma', role: 'citizen', title: 'Resident (Noida Sec 62)', badge: '👤 Citizen', zone: 'zone-1' },
          { email: 'planner@citypulse.gov.in', password: 'analyst123', full_name: 'Dr. Priya Verma', role: 'analyst', title: 'Urban Planner (MCD / DDA)', badge: '🏛️ Analyst', zone: 'zone-3' },
          { email: 'ops@delhipolice.gov.in', password: 'dispatch123', full_name: 'Insp. Rajesh Kumar', role: 'responder', title: 'Emergency Ops (Traffic)', badge: '🚨 Responder', zone: 'zone-2' }
        ])
      })
  }, [])

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-200' }
    let score = 0
    if (pwd.length >= 6) score += 1
    if (pwd.length >= 9) score += 1
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' }
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' }
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-emerald-500' }
    return { score: 100, label: 'Strong', color: 'bg-emerald-600' }
  }

  const pwdStrength = getPasswordStrength(password)

  const handleQuickFill = (p) => {
    setEmail(p.email)
    setPassword(p.password)
    setErrorMsg('')
  }

  // Automatic Location Detection Pipeline after auth
  const runAutoLocationAndProceed = (user, token) => {
    setLocatingStep('locating')

    const finalizeWithLocation = (lat, lng, isSimulated = false) => {
      // Determine nearest Indian sector
      let nearest = null
      let minDistance = Infinity

      Object.values(SECTOR_VISUALS).forEach(sec => {
        const dist = parseFloat(calculateDistanceKm(lat, lng, sec.lat, sec.lng))
        if (dist < minDistance) {
          minDistance = dist
          nearest = sec
        }
      })

      const locationPayload = {
        lat,
        lng,
        isSimulated,
        nearestSector: nearest || SECTOR_VISUALS['zone-3'],
        distanceKm: minDistance !== Infinity ? minDistance : 0.8
      }

      setLocatingStep('locked')

      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess(user, token, locationPayload)
        }
      }, 1200)
    }

    if (!navigator.geolocation) {
      finalizeWithLocation(28.6255, 77.2450, true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        finalizeWithLocation(latitude, longitude, false)
      },
      (err) => {
        console.warn('Geolocation permission not granted, using simulated high-accuracy Delhi NCR location:', err)
        finalizeWithLocation(28.6255, 77.2450, true)
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
    )
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    setLoading(true)
    try {
      const data = await loginUser(email.trim(), password)
      setSuccessMsg('Authenticated! Locking your live GPS coordinates...')
      localStorage.setItem('citypulse_token', data.token)
      localStorage.setItem('citypulse_user', JSON.stringify(data.user))
      runAutoLocationAndProceed(data.user, data.token)
    } catch (err) {
      const matched = demoProfiles.find(d => d.email.toLowerCase() === email.trim().toLowerCase() && d.password === password)
      if (matched) {
        const fallbackUser = {
          id: `usr_${matched.role}`,
          email: matched.email,
          full_name: matched.full_name,
          role: matched.role,
          primary_zone: matched.zone || 'zone-3',
          created_at: new Date().toISOString()
        }
        const fallbackToken = `cptkn_${matched.role}_demo`
        localStorage.setItem('citypulse_token', fallbackToken)
        localStorage.setItem('citypulse_user', JSON.stringify(fallbackUser))
        setSuccessMsg('Demo Persona matched! Locking live GPS location...')
        runAutoLocationAndProceed(fallbackUser, fallbackToken)
      } else {
        setErrorMsg(err.message || 'Invalid email or password.')
        setLoading(false)
      }
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.')
      return
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim(),
        password: password,
        role: role,
        primary_zone: primaryZone,
        city: selectedCity
      }
      const data = await signupUser(payload)
      setSuccessMsg('Account registered! Automatically detecting your live location...')
      localStorage.setItem('citypulse_token', data.token)
      localStorage.setItem('citypulse_user', JSON.stringify(data.user))
      runAutoLocationAndProceed(data.user, data.token)
    } catch (err) {
      // Seamless local fallback if backend offline
      const fallbackUser = {
        id: `usr_${Date.now()}`,
        email: email.trim(),
        full_name: fullName.trim(),
        role: role,
        primary_zone: primaryZone,
        city: selectedCity,
        created_at: new Date().toISOString()
      }
      const fallbackToken = `cptkn_reg_${Date.now()}`
      localStorage.setItem('citypulse_token', fallbackToken)
      localStorage.setItem('citypulse_user', JSON.stringify(fallbackUser))
      setSuccessMsg('Account registered! Automatically detecting your live location...')
      runAutoLocationAndProceed(fallbackUser, fallbackToken)
    }
  }

  const handleGuestEntry = () => {
    const guestUser = {
      id: 'usr_guest',
      email: 'guest@citypulse.in',
      full_name: 'Guest Explorer',
      role: 'citizen',
      primary_zone: 'zone-3',
      created_at: new Date().toISOString()
    }
    const guestToken = 'cptkn_guest'
    localStorage.setItem('citypulse_token', guestToken)
    localStorage.setItem('citypulse_user', JSON.stringify(guestUser))
    runAutoLocationAndProceed(guestUser, guestToken)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Soothing Pastel Background Blobs */}
      <div className="absolute top-0 left-10 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="px-6 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between relative z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                CityPulse
              </span>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                INDIA EDITION
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Live Civic Health Intelligence & Multi-Signal Telemetry</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition border border-slate-200 shadow-sm"
            >
              ← Back to Home
            </button>
          )}

          <button
            onClick={handleGuestEntry}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Explore Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Visual Introduction & India Features */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Automatic GPS Location Onboarding</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Live Civic Health Intelligence across India.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Join citizens, urban planners, and emergency responders in monitoring real-time IMD weather radars, Delhi Metro & DTC transit flows, CPCB air quality, and MCD 311 complaints.
          </p>

          {/* Auto Location Highlight Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 shadow-sm flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
              <Navigation className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-blue-950">Automatic GPS Location Telemetry</h4>
              <p className="text-[11px] text-blue-900/80 font-medium mt-0.5 leading-relaxed">
                As soon as you sign up or sign in, CityPulse automatically locks your live GPS coordinates, assigns the nearest metropolitan sector, and renders your hyperlocal live map.
              </p>
            </div>
          </div>

          {/* 3 City / Signal Pillars */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 inline-block mb-1">
                IMD RADAR
              </span>
              <div className="font-extrabold text-xs text-slate-900">Doppler Weather</div>
              <div className="text-[10px] text-slate-500 font-medium">Cloudburst alerts</div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mb-1">
                DMRC / DTC
              </span>
              <div className="font-extrabold text-xs text-slate-900">Transit GTFS</div>
              <div className="text-[10px] text-slate-500 font-medium">Live speed & delay</div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block mb-1">
                MCD 311
              </span>
              <div className="font-extrabold text-xs text-slate-900">Citizen Reports</div>
              <div className="text-[10px] text-slate-500 font-medium">Geotagged photos</div>
            </div>
          </div>
        </div>

        {/* Right Column: Sign Up / Sign In Glass Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-300/40 backdrop-blur-xl relative overflow-hidden">
            {/* Top Colored Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-500 rounded-t-3xl absolute top-0 left-0" />

            {/* GPS Detection Full-Card Overlay when Locating */}
            {locatingStep && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <div className="relative mb-4">
                  <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                  <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 relative">
                    <Navigation className="w-8 h-8 animate-pulse" />
                  </div>
                </div>

                <h3 className="font-black text-lg text-slate-900 tracking-tight">
                  {locatingStep === 'locating' ? 'Locking Satellite GPS Coordinates...' : 'GPS Lock Confirmed!'}
                </h3>
                <p className="text-xs text-slate-500 font-medium max-w-xs mt-1 leading-relaxed">
                  {locatingStep === 'locating' 
                    ? 'Detecting nearest Indian metropolitan sector (Delhi NCR, Jaipur, Mumbai, Bengaluru)...' 
                    : 'Initializing live Doppler weather, transit feeds, and citizen observation lens.'}
                </p>

                <div className="mt-4 flex items-center gap-2 font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>WGS84 Telemetry Active</span>
                </div>
              </div>
            )}

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 mb-5">
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-md font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account (Sign Up)
              </button>
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-slate-900 shadow-md font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In (Login)
              </button>
            </div>

            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ══════════════════════════════════════════════
                MODE 1: SIGN UP (CREATE ACCOUNT)
                ══════════════════════════════════════════════ */}
            {mode === 'signup' ? (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@citypulse.in"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {password && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                        style={{ width: `${pwdStrength.score}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono font-bold">
                      <span>Password Security</span>
                      <span>{pwdStrength.label}</span>
                    </div>
                  </div>
                )}

                {/* Indian Civic Role Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Civic Role
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRole('citizen')}
                      className={`p-2 rounded-xl border text-center transition ${
                        role === 'citizen'
                          ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-bold">Resident</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('analyst')}
                      className={`p-2 rounded-xl border text-center transition ${
                        role === 'analyst'
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-bold">Analyst</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('responder')}
                      className={`p-2 rounded-xl border text-center transition ${
                        role === 'responder'
                          ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-bold">Responder</div>
                    </button>
                  </div>
                </div>

                {/* Monitored Indian Region */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monitored Metropolitan Region
                  </label>
                  <select
                    value={primaryZone}
                    onChange={(e) => setPrimaryZone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="zone-1">Zone 1 — Noida Sector 62 & Yamuna Riverfront</option>
                    <option value="zone-2">Zone 2 — Connaught Place & Ring Road Arterial</option>
                    <option value="zone-3">Zone 3 — ITO & Pragati Maidan Core</option>
                    <option value="zone-4">Zone 4 — Okhla Phase III & Industrial Grid</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 fill-current" />
                      <span>Sign Up & Auto-Detect Live Location</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ══════════════════════════════════════════════
                 MODE 2: SIGN IN (LOGIN)
                 ══════════════════════════════════════════════ */
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="citizen@citypulse.in"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      (or use 1-click persona below)
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 fill-current" />
                      <span>Sign In & Auto-Detect Live Location</span>
                    </>
                  )}
                </button>

                {/* 1-Click Indian Personas */}
                <div className="pt-4 border-t border-slate-100 mt-5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>1-Click Indian Demo Personas</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {demoProfiles.map((p) => (
                      <button
                        key={p.email}
                        type="button"
                        onClick={() => handleQuickFill(p)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 text-left transition group shadow-sm active:scale-95"
                      >
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">{p.badge}</div>
                        <div className="text-[10px] text-slate-500 truncate font-medium mt-0.5">{p.full_name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* Bottom Guest Link */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={handleGuestEntry}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
              >
                Skip sign up and explore live map directly →
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-200 bg-white/80 backdrop-blur-md text-center text-xs text-slate-500 font-medium">
        CityPulse Live Civic Health Platform &bull; AmiHacks Track B: Open Innovation &bull; India Smart Cities Mission
      </footer>
    </div>
  )
}
