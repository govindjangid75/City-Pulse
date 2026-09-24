/**
 * CityPulse API Client Service
 */

const API_BASE = '/api/v1'

export async function fetchAllZones() {
  const res = await fetch(`${API_BASE}/zones`)
  if (!res.ok) throw new Error('Failed to fetch zone statuses')
  return res.json()
}

export async function fetchZoneDetail(zoneId) {
  const res = await fetch(`${API_BASE}/zones/${zoneId}`)
  if (!res.ok) throw new Error(`Failed to fetch details for ${zoneId}`)
  return res.json()
}

export async function fetchZoneEvents(zoneId, windowMinutes = 30) {
  const res = await fetch(`${API_BASE}/zones/${zoneId}/events?window_minutes=${windowMinutes}`)
  if (!res.ok) throw new Error(`Failed to fetch events for ${zoneId}`)
  return res.json()
}

export async function fetchSystemHealth() {
  const res = await fetch(`${API_BASE}/health`)
  if (!res.ok) throw new Error('Failed to fetch health')
  return res.json()
}
