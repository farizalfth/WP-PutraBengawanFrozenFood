import type { WebOrder, WebOrderItemRow, WebOrderStatus } from '../types'
import { getSupabaseClient } from './supabase'

export interface CreateWebOrderInput {
  order_number: string
  customer_name: string
  customer_phone: string
  address: string
  titik_lokasi?: string
  notes?: string
  delivery: string
  payment: string
  total_amount: number
  items: Array<{
    product_id: string
    name: string
    quantity: number
    price: number
    subtotal: number
  }>
}

export async function createWebOrder(
  input: CreateWebOrderInput,
): Promise<{ id: string | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.rpc('create_web_order', {
      p_order_number: input.order_number,
      p_customer_name: input.customer_name,
      p_customer_phone: input.customer_phone,
      p_address: input.address,
      p_titik_lokasi: input.titik_lokasi ?? null,
      p_notes: input.notes ?? '',
      p_delivery: input.delivery,
      p_payment: input.payment,
      p_total_amount: input.total_amount,
      p_items: input.items.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        subtotal: i.subtotal,
      })) as never,
    })
    if (error) return { id: null, error: error.message }
    return { id: (data as { id: string } | null)?.id ?? null, error: null }
  } catch (e) {
    return { id: null, error: (e as Error).message }
  }
}

export async function listWebOrders(): Promise<{
  data: WebOrder[] | null
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('web_orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return { data: null, error: error.message }
    const normalized = ((data as WebOrder[]) ?? []).map((o) => {
      const raw = o.status as string
      return {
        ...o,
        status: (raw === 'menunggu' ? 'pending' : raw) as WebOrderStatus,
      }
    })
return { data: normalized, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function listWebOrderItems(
  orderId: string,
): Promise<{ data: WebOrderItemRow[] | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('web_order_items')
      .select('*')
      .eq('web_order_id', orderId)
    if (error) return { data: null, error: error.message }
    return { data: data as WebOrderItemRow[], error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function updateWebOrderStatus(
  orderId: string,
  status: WebOrderStatus,
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('web_orders')
      .update({ status })
      .eq('id', orderId)
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function getWebOrderByNumber(
  orderNumber: string,
): Promise<{ data: WebOrder | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('web_orders')
      .select('*')
      .eq('order_number', orderNumber)
      .maybeSingle()
    if (error) return { data: null, error: error.message }
    if (!data) return { data: null, error: null }
    const d = data as WebOrder
    d.status = ((d.status as string) === 'menunggu' ? 'pending' : d.status) as WebOrderStatus
    return { data: d, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function confirmWebOrderPayment(
  orderId: string,
  proof?: string,
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client.rpc('confirm_web_order_payment', {
      p_order_id: orderId,
      p_proof: proof?.trim() ? proof.trim() : null,
    })
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function syncWebOrderToTransactions(
  orderId: string,
): Promise<{
  transactionId: string | null
  invoiceNumber: string | null
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.rpc(
      'sync_web_order_to_transactions',
      { p_order_id: orderId },
    )
    if (error) return { transactionId: null, invoiceNumber: null, error: error.message }
    const d = data as { transaction_id: string; invoice_number: string } | null
    return {
      transactionId: d?.transaction_id ?? null,
      invoiceNumber: d?.invoice_number ?? null,
      error: null,
    }
  } catch (e) {
    return {
      transactionId: null,
      invoiceNumber: null,
      error: (e as Error).message,
    }
  }
}

export async function deleteWebOrder(
  orderId: string,
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client.from('web_orders').delete().eq('id', orderId)
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}