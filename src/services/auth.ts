import type { AuthError, Session } from '@supabase/supabase-js'
import { getSupabaseClient } from './supabase'

export interface AuthResult {
  session: Session | null
  error: AuthError | null
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })
    if (error) return { session: null, error }
    return { session: data.session, error: null }
  } catch (e) {
    return {
      session: null,
      error: e as AuthError,
    }
  }
}

export async function signOut(): Promise<AuthError | null> {
  try {
    const client = getSupabaseClient()
    const { error } = await client.auth.signOut()
    return error
  } catch {
    return null
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const client = getSupabaseClient()
    const { data } = await client.auth.getSession()
    return data.session
  } catch {
    return null
  }
}

export function onAuthStateChange(
  callback: (session: Session | null) => void,
) {
  try {
    const client = getSupabaseClient()
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })
    return subscription
  } catch {
    return { unsubscribe: () => undefined }
  }
}