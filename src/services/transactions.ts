import type { Transaction, TransactionItem } from '../types'
import { getSupabaseClient } from './supabase'

export interface TransactionItemInput {
  product_id: string
  quantity: number
  price: number
  subtotal: number
}

export interface CreateTransactionInput {
  invoice_number: string
  cashier_id: string
  total_amount: number
  payment_amount: number
  change_amount: number
  items: TransactionItemInput[]
}

export interface TransactionFilter {
  from?: string
  to?: string
  cashierId?: string
  invoice?: string
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<{ data: Transaction | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.rpc('create_transaction', {
      invoice_number: input.invoice_number,
      cashier_id: input.cashier_id,
      total_amount: input.total_amount,
      payment_amount: input.payment_amount,
      change_amount: input.change_amount,
      items:
        input.items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price: i.price,
          subtotal: i.subtotal,
        })) as never,
    })
    if (error) return { data: null, error: error.message }
    return { data: data as Transaction, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function listTransactions(
  filter?: TransactionFilter,
): Promise<{ data: Transaction[] | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    let query = client
      .from('transactions')
      .select('*, profiles ( id, name )')
      .order('created_at', { ascending: false })

    if (filter?.invoice) {
      query = query.ilike('invoice_number', `%${filter.invoice}%`)
    }
    if (filter?.cashierId) {
      query = query.eq('cashier_id', filter.cashierId)
    }
    if (filter?.from) {
      query = query.gte('created_at', filter.from)
    }
    if (filter?.to) {
      query = query.lte('created_at', filter.to)
    }

    const { data, error } = await query.limit(200)
    if (error) return { data: null, error: error.message }
    return { data: data as Transaction[], error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function getTransactionById(
  id: string,
): Promise<{ data: Transaction | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('transactions')
      .select('*, profiles ( id, name )')
      .eq('id', id)
      .maybeSingle()
    if (error) return { data: null, error: error.message }
    return { data: (data as Transaction) ?? null, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function getTransactionItems(
  transactionId: string,
): Promise<{ data: TransactionItem[] | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('transaction_items')
      .select('*, products ( id, name, barcode )')
      .eq('transaction_id', transactionId)
    if (error) return { data: null, error: error.message }
    return { data: data as TransactionItem[], error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function deleteTransaction(
  transactionId: string,
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client.rpc('delete_transaction', {
      p_transaction_id: transactionId,
    })
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalTransactions: number
  todayRevenue: number
  lowStockProducts: Array<{ id: string; name: string; stock: number; image_url: string | null }>
  recentTransactions: Transaction[]
}

export async function getDashboardStats(): Promise<{
  data: DashboardStats | null
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.rpc('get_dashboard_stats')
    if (error) return { data: null, error: error.message }
    return { data: data as DashboardStats, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}