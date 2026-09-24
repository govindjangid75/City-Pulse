/**
 * CityPulse Supabase Client & Realtime Service
 * Provides cloud authentication and Postgres realtime event subscriptions.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') && 
    !supabaseUrl.includes('placeholder')
  )
}

// Fallback dummy client if keys not yet set so the app never crashes
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key')

/**
 * Register a user via Supabase Auth with custom civic metadata
 */
export async function supabaseSignUp({ email, password, fullName, role, primaryZone }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured yet. Please add VITE_SUPABASE_URL in .env.')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role || 'citizen',
        primary_zone: primaryZone || 'zone-1'
      }
    }
  })

  if (error) throw error

  const user = data.user
  return {
    token: data.session?.access_token || `cptkn_${user?.id || 'new'}`,
    user: {
      id: user?.id,
      email: user?.email,
      full_name: fullName,
      role: role || 'citizen',
      primary_zone: primaryZone || 'zone-1',
      created_at: user?.created_at || new Date().toISOString()
    }
  }
}

/**
 * Sign in existing user via Supabase Auth
 */
export async function supabaseSignIn({ email, password }) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured yet. Please add VITE_SUPABASE_URL in .env.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error

  const user = data.user
  const meta = user?.user_metadata || {}

  return {
    token: data.session.access_token,
    user: {
      id: user.id,
      email: user.email,
      full_name: meta.full_name || email.split('@')[0],
      role: meta.role || 'citizen',
      primary_zone: meta.primary_zone || 'zone-1',
      created_at: user.created_at
    }
  }
}

/**
 * Sign out current Supabase session
 */
export async function supabaseSignOut() {
  if (isSupabaseConfigured()) {
    await supabase.auth.signOut()
  }
}

/**
 * Subscribe to Supabase Postgres Realtime changes on 'events' table
 */
export function subscribeToRealtimeEvents(onInsert) {
  if (!isSupabaseConfigured()) return null

  const channel = supabase
    .channel('citypulse-events-stream')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'events' },
      (payload) => {
        console.log('[Supabase Realtime] Ingested event:', payload.new)
        if (onInsert) onInsert(payload.new)
      }
    )
    .subscribe()

  return channel
}
