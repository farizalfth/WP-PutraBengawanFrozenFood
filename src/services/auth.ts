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

const RESET_PASSWORD_PATH = '/admin/reset-password'

/**
 * Global base URL (dev: http://localhost:5173, prod: https://site.vercel.app).
 * Dipakai untuk redirect link reset password dari email.
 */
export function getAuthRedirectUrl(): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}${RESET_PASSWORD_PATH}`
}

export async function resetPassword(
  email: string,
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthRedirectUrl(),
    })
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function updatePassword(
  newPassword: string,
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function changeEmail(
  newEmail: string,
): Promise<{ error: string | null; needsConfirmation: boolean }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client.auth.updateUser({ email: newEmail })
    if (error) return { error: error.message, needsConfirmation: false }
    return { error: null, needsConfirmation: true }
  } catch (e) {
    return { error: (e as Error).message, needsConfirmation: false }
  }
}