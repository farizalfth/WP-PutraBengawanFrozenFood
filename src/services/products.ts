import type { Product } from '../types'
import { getSupabaseClient } from './supabase'

const productSelect = `
  id, barcode, name, description, category_id, price, stock, image_url,
  is_best_seller, created_at, updated_at,
  categories ( id, name, image_url )
`

export interface ProductInput {
  barcode: string
  name: string
  description?: string | null
  category_id?: string | null
  price: number
  stock: number
  image_url?: string | null
  is_best_seller?: boolean
}

export async function listProducts(): Promise<{
  data: Product[] | null
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('products')
      .select(productSelect)
      .order('created_at', { ascending: false })
    if (error) return { data: null, error: error.message }
    return { data: data as unknown as Product[], error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function listBestSellers(): Promise<{
  data: Product[] | null
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('products')
      .select(productSelect)
      .eq('is_best_seller', true)
      .order('created_at', { ascending: false })
      .limit(8)
    if (error) return { data: null, error: error.message }
    return { data: data as unknown as Product[], error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function getProductById(
  id: string,
): Promise<{ data: Product | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('products')
      .select(productSelect)
      .eq('id', id)
      .maybeSingle()
    if (error) return { data: null, error: error.message }
    return { data: (data as unknown as Product) ?? null, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function getProductByBarcode(
  barcode: string,
): Promise<{ data: Product | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('products')
      .select(productSelect)
      .eq('barcode', barcode)
      .maybeSingle()
    if (error) return { data: null, error: error.message }
    return { data: (data as unknown as Product) ?? null, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function listProductsByCategory(
  categoryId: string,
): Promise<{ data: Product[] | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('products')
      .select(productSelect)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
    if (error) return { data: null, error: error.message }
    return { data: data as unknown as Product[], error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function searchProducts(query: string): Promise<{
  data: Product[] | null
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('products')
      .select(productSelect)
      .ilike('name', `%${query}%`)
      .order('created_at', { ascending: false })
    if (error) return { data: null, error: error.message }
    return { data: data as unknown as Product[], error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function createProduct(
  input: ProductInput,
): Promise<{ data: Product | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('products')
      .insert(input)
      .select(productSelect)
      .single()
    if (error) return { data: null, error: error.message }
    return { data: data as unknown as Product, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>,
): Promise<{ data: Product | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('products')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(productSelect)
      .single()
    if (error) return { data: null, error: error.message }
    return { data: data as unknown as Product, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function deleteProduct(id: string): Promise<{
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { error } = await client.from('products').delete().eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deleteAllProducts(): Promise<{
  error: string | null
}> {
  try {
    const client = getSupabaseClient()

    // Ambil seluruh ID produk yang akan dihapus
    const { data: productKeys, error: listErr } = await client
      .from('products')
      .select('id')
    if (listErr) return { error: listErr.message }

    const ids = (productKeys ?? []).map((p) => (p as { id: string }).id)
    if (ids.length > 0) {
      // Hapus dulu referensi pada transaction_items agar tidak melanggar FK
      const { error: itemsErr } = await client
        .from('transaction_items')
        .delete()
        .in('product_id', ids)
      if (itemsErr) return { error: itemsErr.message }
    }

    const { error } = await client.from('products').delete().neq('id', '')
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function adjustStock(
  id: string,
  newStock: number,
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('products')
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}