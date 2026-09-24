import React, { useState, useEffect } from 'react'
import { 
  X, Mail, Lock, User, Eye, EyeOff, ShieldCheck, 
  Building2, Siren, CheckCircle2, AlertCircle, ArrowRight, Sparkles
} from 'lucide-react'
import { loginUser, signupUser, fetchDemoUsers } from '../services/api'
import { isSupabaseConfigured } from '../services/supabase'

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode) // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('citizen') // 'citizen' | 'analyst' | 'responder'
  const [primaryZone, setPrimaryZone] = useState('zone-1')
  const [rememberMe, setRememberMe] = useState(true)
  const [demoProfiles, setDemoProfiles] = useState([])

  // Load demo profiles on mount
  useEffect(() => {
    fetchDemoUsers()
      .then(data => setDemoProfiles(data || []))
      .catch(() => {
        // Fallback default demo profiles
        setDemoProfiles([
          { email: 'citizen@citypulse.org', password: 'citizen123', full_name: 'Maya Lin', role: 'citizen', title: 'Resident', badge: '👤 Citizen', zone: 'zone-1' },
          { email: 'analyst@citypulse.gov', password: 'analyst123', full_name: 'David Vance', role: 'analyst', title: 'Urban Planner', badge: '🏛️ Analyst', zone: 'zone-3' },
          { email: 'ops@citypulse.gov', password: 'dispatch123', full_name: 'Capt. Sarah Chen', role: 'responder', title: 'Emergency Ops', badge: '🚨 Responder', zone: 'zone-2' }
        ])
      })
  }, [])

  // Sync initial mode
  useEffect(() => {
    setMode(initialMode)
    setErrorMsg('')
    setSuccessMsg('')
  }, [initialMode, isOpen])

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Password strength calculation
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

  // Handle 1-click Demo Fill
  const handleQuickDemoFill = (demo) => {
    setEmail(demo.email)
    setPassword(demo.password)
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
      setSuccessMsg('Authentication successful! Welcome to CityPulse.')
      if (rememberMe) {
        localStorage.setItem('citypulse_token', data.token)
        localStorage.setItem('citypulse_user', JSON.stringify(data.user))
      }
      setTimeout(() => {
        onAuthSuccess(data.user, data.token)
        onClose()
      }, 600)
    } catch (err) {
      // Local demo fallback if backend is offline
      const matchedDemo = demoProfiles.find(d => d.email.toLowerCase() === email.trim().toLowerCase() && d.password === password)
      if (matchedDemo) {
        const fallbackUser = {
          id: `usr_${matchedDemo.role}`,
          email: matchedDemo.email,
          full_name: matchedDemo.full_name,
          role: matchedDemo.role,
          primary_zone: matchedDemo.zone || 'zone-1',
          created_at: new Date().toISOString()
        }
        const fallbackToken = `cptkn_${matchedDemo.role}_demo`
        if (rememberMe) {
          localStorage.setItem('citypulse_token', fallbackToken)
          localStorage.setItem('citypulse_user', JSON.stringify(fallbackUser))
        }
        setSuccessMsg('Logged in with Demo Profile.')
        setTimeout(() => {
          onAuthSuccess(fallbackUser, fallbackToken)
          onClose()
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
      setSuccessMsg('Account registered successfully!')
      localStorage.setItem('citypulse_token', data.token)
      localStorage.setItem('citypulse_user', JSON.stringify(data.user))
      setTimeout(() => {
        onAuthSuccess(data.user, data.token)
        onClose()
      }, 700)
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Dimmed backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-950/50 backdrop-blur-xl overflow-hidden z-10 transition-all">
        {/* Top Gradient Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-sky-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header & Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white tracking-tight">CityPulse</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase font-semibold">
                  Civic ID
                </span>
                {isSupabaseConfigured() && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-2.5 h-2.5 text-sky-400" />
                    Supabase Auth
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {mode === 'signin' 
                  ? 'Access live zone telemetry, alerts, and incident analytics.' 
                  : 'Join citizens, city planners, and first responders monitoring urban health.'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md font-bold'
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
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ══════════════════════════════════════════════
              SIGN IN FORM
              ══════════════════════════════════════════════ */}
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
                    placeholder="name@citypulse.org"
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">
                    (or use 1-click demo profile below)
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

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-0"
                  />
                  <span>Remember this session</span>
                </label>
                <span className="text-emerald-400/80 hover:text-emerald-300 cursor-pointer">
                  AmiHacks Track B
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to CityPulse</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Demo Profiles */}
              <div className="pt-4 border-t border-slate-800/80 mt-6">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1-Click Hackathon Demo Personas</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {demoProfiles.map((p) => (
                    <button
                      key={p.email}
                      type="button"
                      onClick={() => handleQuickDemoFill(p)}
                      className="text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/40 transition group"
                    >
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition flex items-center justify-between">
                        <span>{p.badge}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.full_name}</p>
                      <p className="text-[9px] text-slate-500 truncate font-mono">{p.email}</p>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* ══════════════════════════════════════════════
               SIGN UP FORM
               ══════════════════════════════════════════════ */
            <form onSubmit={handleSignUp} className="space-y-4">
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
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
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
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="space-y-1 pt-1">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                      style={{ width: `${pwdStrength.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Password Strength</span>
                    <span className="font-semibold">{pwdStrength.label}</span>
                  </div>
                </div>
              )}

              {/* Civic Role Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Select Civic Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('citizen')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      role === 'citizen'
                        ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-sm'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4 mb-1 text-emerald-400" />
                    <div className="text-xs font-semibold">Resident</div>
                    <div className="text-[10px] text-slate-400">Citizen</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('analyst')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      role === 'analyst'
                        ? 'bg-indigo-500/15 border-indigo-500/60 text-indigo-300 shadow-sm'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mb-1 text-indigo-400" />
                    <div className="text-xs font-semibold">Analyst</div>
                    <div className="text-[10px] text-slate-400">Municipal</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('responder')}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      role === 'responder'
                        ? 'bg-rose-500/15 border-rose-500/60 text-rose-300 shadow-sm'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Siren className="w-4 h-4 mb-1 text-rose-400" />
                    <div className="text-xs font-semibold">Responder</div>
                    <div className="text-[10px] text-slate-400">Emergency Ops</div>
                  </button>
                </div>
              </div>

              {/* Primary Monitored Zone */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Zone of Interest
                </label>
                <select
                  value={primaryZone}
                  onChange={(e) => setPrimaryZone(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                >
                  <option value="zone-1">Zone 1 — North District (Uptown, Highland Park)</option>
                  <option value="zone-2">Zone 2 — East Corridor (Riverfront, Tech Quarter)</option>
                  <option value="zone-3">Zone 3 — Metro Core & Station (Downtown, 5th & Main)</option>
                  <option value="zone-4">Zone 4 — South Valley (Suburbs, Industrial Park)</option>
                </select>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Civic Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="mt-5 text-center text-[11px] text-slate-500">
            {mode === 'signin' ? (
              <p>
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMsg(''); }}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
