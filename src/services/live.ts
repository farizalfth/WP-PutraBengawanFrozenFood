import type { Transaction } from '../types'
import { getSupabaseClient } from './supabase'

export interface WebStat {
  id: string
  path: string
  created_at: string
}

export interface WebStats {
  today: number
  total: number
  topPaths: Array<{ path: string; count: number }>
  recent: WebStat[]
}

export interface LiveActivity {
  type: 'transaction' | 'pageview'
  id: string
  title: string
  detail: string
  created_at: string
  payload?: Transaction | WebStat
}

async function trackPageView(
  path: string,
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client.rpc('track_page_view', {
      p_path: path,
      p_referrer: document.referrer || null,
      p_user_agent: navigator.userAgent || null,
    })
    return { error: error?.message ?? null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

async function getWebStats(): Promise<{
  data: WebStats | null
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.rpc('get_web_stats')
    if (error) return { data: null, error: error.message }
    return { data: data as WebStats, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

interface ActivityHandlers {
  onTransaction: (tx: Transaction) => void
  onPageView: (view: WebStat) => void
}

function subscribeActivity(handlers: ActivityHandlers): () => void {
  const client = getSupabaseClient()
  const channel = client
    .channel('live-activity')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'transactions' },
      (payload) => {
        handlers.onTransaction(payload.new as Transaction)
      },
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'page_views' },
      (payload) => {
        handlers.onPageView(payload.new as WebStat)
      },
    )
    .subscribe()

  return () => {
    client.removeChannel(channel)
  }
}

export { trackPageView, getWebStats, subscribeActivity }