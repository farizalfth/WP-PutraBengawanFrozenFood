import type { Profile } from '../types'
import { getSupabaseClient } from './supabase'

export async function getProfileByUserId(
  userId: string,
): Promise<{ data: Profile | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) return { data: null, error: error.message }
    return { data: (data as Profile) ?? null, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function listProfiles(): Promise<{
  data: Profile[] | null
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return { data: null, error: error.message }
    return { data: data as Profile[], error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function updateProfileRole(
  userId: string,
  role: Profile['role'],
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('profiles')
      .update({ role })
      .eq('user_id', userId)
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deleteProfile(userId: string): Promise<{
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { error: dbError } = await client
      .from('profiles')
      .delete()
      .eq('user_id', userId)
    if (dbError) return { error: dbError.message }

    const { error: authError } = await client.auth.admin.deleteUser(userId)
    if (authError) return { error: authError.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function inviteUser(
  email: string,
  name: string,
  role: Profile['role'],
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data: invite, error: inviteError } =
      await client.auth.admin.inviteUserByEmail(email, {
        data: { name, role },
      })
    if (inviteError) return { error: inviteError.message }
    if (!invite.user) return { error: 'Gagal membuat pengguna.' }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function updateProfileName(
  userId: string,
  name: string,
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('profiles')
      .update({ name })
      .eq('user_id', userId)
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}