/**
 * CityPulse API Client Service
 * Connects React UI to FastAPI endpoints.
 */

const API_BASE = '/api/v1'

export async function fetchAllZones(windowMinutes = 30, asOf = null) {
  let url = `${API_BASE}/zones?window_minutes=${windowMinutes}`
  if (asOf) url += `&as_of=${encodeURIComponent(asOf)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch zone statuses')
  return res.json()
}

export async function fetchZoneDetail(zoneId, windowMinutes = 30, asOf = null) {
  let url = `${API_BASE}/zones/${zoneId}?window_minutes=${windowMinutes}`
  if (asOf) url += `&as_of=${encodeURIComponent(asOf)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch details for ${zoneId}`)
  return res.json()
}

export async function fetchZoneEvents(zoneId, windowMinutes = 60, asOf = null) {
  let url = `${API_BASE}/zones/${zoneId}/events?window_minutes=${windowMinutes}`
  if (asOf) url += `&as_of=${encodeURIComponent(asOf)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch events for ${zoneId}`)
  return res.json()
}

export async function fetchSystemHealth() {
  const res = await fetch(`${API_BASE}/health`)
  if (!res.ok) throw new Error('Failed to fetch health')
  return res.json()
}

export async function triggerScenario(scenario, zone = 'zone-3') {
  const res = await fetch(`${API_BASE}/simulate/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario, zone })
  })
  if (!res.ok) throw new Error('Failed to trigger scenario')
  return res.json()
}

export async function toggleFeedStatus(feed, status) {
  const res = await fetch(`${API_BASE}/simulate/toggle-feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feed, status })
  })
  if (!res.ok) throw new Error('Failed to toggle feed status')
  return res.json()
}

export async function resetSimulationDatabase() {
  const res = await fetch(`${API_BASE}/simulate/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  if (!res.ok) throw new Error('Failed to reset simulation database')
  return res.json()
}

export async function fetchHistoryTimeline() {
  const res = await fetch(`${API_BASE}/history/timeline`)
  if (!res.ok) throw new Error('Failed to fetch timeline')
  return res.json()
}

export async function injectCustomEvent(eventPayload) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventPayload)
  })
  if (!res.ok) throw new Error('Failed to inject custom event')
  return res.json()
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Authentication failed')
  return data
}

export async function signupUser(userData) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Sign up failed')
  return data
}

export async function fetchCurrentUser(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Session invalid or expired')
  return res.json()
}

export async function fetchDemoUsers() {
  const res = await fetch(`${API_BASE}/auth/demo-users`)
  if (!res.ok) throw new Error('Failed to fetch demo users')
  return res.json()
}

