import { getSupabaseClient } from './supabase'

export interface PublicCounters {
  products: number
  customers: number
  deliveries: number
  years: number
}

const STORE_OPENED = '2026-06-01'

export function getStoreYears(now = new Date()): number {
  const open = new Date(STORE_OPENED)
  const diff = now.getTime() - open.getTime()
  const years = diff / (1000 * 60 * 60 * 24 * 365.25)
  return Math.max(1, Math.floor(years) || 1)
}

export async function getPublicCounters(): Promise<{
  data: PublicCounters
  error: string | null
}> {
  const fallback: PublicCounters = {
    products: 0,
    customers: 0,
    deliveries: 0,
    years: getStoreYears(),
  }

  try {
    const client = getSupabaseClient()

    const [{ count: productCount }, { count: txCount }] = await Promise.all([
      client
        .from('products')
        .select('id', { count: 'exact', head: true }),
      client
        .from('transactions')
        .select('id', { count: 'exact', head: true }),
    ])

    return {
      data: {
        products: productCount ?? 0,
        customers: txCount ?? 0,
        deliveries: txCount ?? 0,
        years: getStoreYears(),
      },
      error: null,
    }
  } catch {
    return { data: fallback, error: null }
  }
}
