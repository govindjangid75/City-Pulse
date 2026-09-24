import React, { useState, useEffect } from 'react'
import { 
  ShieldCheck, Radio, Mail, Lock, User, Eye, EyeOff, 
  ArrowLeft, ArrowRight, Building2, Siren, CheckCircle2, 
  AlertCircle, Sparkles, Activity, MapPin, Zap
} from 'lucide-react'
import { loginUser, signupUser, fetchDemoUsers } from '../services/api'

export default function AuthPage({ onBackToDashboard, onAuthSuccess, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('citizen')
  const [primaryZone, setPrimaryZone] = useState('zone-1')
  const [demoProfiles, setDemoProfiles] = useState([])

  useEffect(() => {
    fetchDemoUsers()
      .then(data => setDemoProfiles(data || []))
      .catch(() => {
        setDemoProfiles([
          { email: 'citizen@citypulse.org', password: 'citizen123', full_name: 'Maya Lin', role: 'citizen', title: 'Resident', badge: '👤 Citizen', zone: 'zone-1' },
          { email: 'analyst@citypulse.gov', password: 'analyst123', full_name: 'David Vance', role: 'analyst', title: 'Urban Planner', badge: '🏛️ Analyst', zone: 'zone-3' },
          { email: 'ops@citypulse.gov', password: 'dispatch123', full_name: 'Capt. Sarah Chen', role: 'responder', title: 'Emergency Ops', badge: '🚨 Responder', zone: 'zone-2' }
        ])
      })
  }, [])

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-700' }
    let score = 0
    if (pwd.length >= 6) score += 1
    if (pwd.length >= 9) score += 1
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' }
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' }
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-emerald-400' }
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' }
  }

  const pwdStrength = getPasswordStrength(password)

  const handleQuickFill = (p) => {
    setEmail(p.email)
    setPassword(p.password)
    setErrorMsg('')
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
      setSuccessMsg('Welcome back to CityPulse!')
      localStorage.setItem('citypulse_token', data.token)
      localStorage.setItem('citypulse_user', JSON.stringify(data.user))
      setTimeout(() => {
        onAuthSuccess(data.user, data.token)
      }, 500)
    } catch (err) {
      const matched = demoProfiles.find(d => d.email.toLowerCase() === email.trim().toLowerCase() && d.password === password)
      if (matched) {
        const fallbackUser = {
          id: `usr_${matched.role}`,
          email: matched.email,
          full_name: matched.full_name,
          role: matched.role,
          primary_zone: matched.zone || 'zone-1',
          created_at: new Date().toISOString()
        }
        const fallbackToken = `cptkn_${matched.role}_demo`
        localStorage.setItem('citypulse_token', fallbackToken)
        localStorage.setItem('citypulse_user', JSON.stringify(fallbackUser))
        setSuccessMsg('Logged in with Demo Profile.')
        setTimeout(() => {
          onAuthSuccess(fallbackUser, fallbackToken)
        }, 500)
      } else {
        setErrorMsg(err.message || 'Invalid email or password.')
      }
    } finally {
      setLoading(false)
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
        primary_zone: primaryZone
      }
      const data = await signupUser(payload)
      setSuccessMsg('Civic account created successfully!')
      localStorage.setItem('citypulse_token', data.token)
      localStorage.setItem('citypulse_user', JSON.stringify(data.user))
      setTimeout(() => {
        onAuthSuccess(data.user, data.token)
      }, 600)
    } catch (err) {
      setErrorMsg(err.message || 'Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="px-6 py-4 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
              CityPulse
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                AmiHacks
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Dashboard</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Civic Intelligence Value Proposition */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Civic Health Telemetry & Cross-Feed Fusion</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            One glance tells you what's happening in your city.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
            CityPulse ingests real-time weather alerts, transit disruptions, and 311 incident reports. 
            By cross-correlating multi-feed signals, it surfaces genuine civic anomalies before they escalate.
          </p>

          {/* Persona Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <User className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="text-xs font-bold text-slate-200">Residents</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Hyperlocal safety, flood warnings, and commute health.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <Building2 className="w-5 h-5 text-indigo-400 mb-2" />
              <h4 className="text-xs font-bold text-slate-200">City Planners</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Spatial analytics, infrastructure load, and historical replay.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <Siren className="w-5 h-5 text-rose-400 mb-2" />
              <h4 className="text-xs font-bold text-slate-200">Emergency Ops</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Priority alert thresholds and multi-zone correlation radar.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 pt-4 border-t border-slate-900 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Sub-second event normalization</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>Grounded AI narratives</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In / Sign Up Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl relative">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-sky-400 rounded-t-3xl absolute top-0 left-0" />

            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800/80 mb-6">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error & Success Feedback */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="citizen@citypulse.org"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 1-Click Demo Logins */}
                <div className="pt-4 border-t border-slate-800/80 mt-5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Quick Demo Logins</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {demoProfiles.map((p) => (
                      <button
                        key={p.email}
                        type="button"
                        onClick={() => handleQuickFill(p)}
                        className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/40 text-left transition"
                      >
                        <div className="text-[11px] font-semibold text-slate-200">{p.badge}</div>
                        <div className="text-[10px] text-slate-400 truncate">{p.full_name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              /* SIGN UP FORM */
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.org"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Confirm
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                {password && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                        style={{ width: `${pwdStrength.score}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Strength</span>
                      <span className="font-semibold">{pwdStrength.label}</span>
                    </div>
                  </div>
                )}

                {/* Role */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Civic Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('citizen')}
                      className={`p-2 rounded-xl border text-center transition ${
                        role === 'citizen'
                          ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-semibold">Resident</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('analyst')}
                      className={`p-2 rounded-xl border text-center transition ${
                        role === 'analyst'
                          ? 'bg-indigo-500/15 border-indigo-500/60 text-indigo-300'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-semibold">Analyst</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('responder')}
                      className={`p-2 rounded-xl border text-center transition ${
                        role === 'responder'
                          ? 'bg-rose-500/15 border-rose-500/60 text-rose-300'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-xs font-semibold">Responder</div>
                    </button>
                  </div>
                </div>

                {/* Primary Zone */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Monitored District
                  </label>
                  <select
                    value={primaryZone}
                    onChange={(e) => setPrimaryZone(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                  >
                    <option value="zone-1">Zone 1 — North District</option>
                    <option value="zone-2">Zone 2 — East Corridor</option>
                    <option value="zone-3">Zone 3 — Metro Core & Station</option>
                    <option value="zone-4">Zone 4 — South Valley</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account & Enter</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-500">
        CityPulse Live Civic Health Platform &bull; Built for AmiHacks 2026 &bull; Track B: Industry / Open Innovation
      </footer>
    </div>
  )
}
