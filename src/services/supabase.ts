import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey)

export const supabaseUrlValue = supabaseUrl ?? ''

export const IMAGES_BUCKET = 'product-images'

let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase belum dikonfigurasi. Salin .env.example ke .env lalu isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.',
    )
  }
  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  return _client
}

export function withClient<T>(
  fn: (client: SupabaseClient) => Promise<T>,
): Promise<T> {
  try {
    return fn(getSupabaseClient())
  } catch (e) {
    return Promise.reject(e)
  }
}