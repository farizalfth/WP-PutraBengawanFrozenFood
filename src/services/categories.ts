import type { Category } from '../types'
import { getSupabaseClient } from './supabase'

export interface CategoryInput {
  name: string
  description?: string | null
  image_url?: string | null
}

export async function listCategories(): Promise<{
  data: Category[] | null
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('categories')
      .select('*, products(count)')
      .order('name', { ascending: true })
    if (error) return { data: null, error: error.message }
    return { data: data as Category[], error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function getCategoryById(
  id: string,
): Promise<{ data: Category | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) return { data: null, error: error.message }
    return { data: (data as Category) ?? null, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function createCategory(
  input: CategoryInput,
): Promise<{ data: Category | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('categories')
      .insert(input)
      .select('*')
      .single()
    if (error) return { data: null, error: error.message }
    return { data: data as Category, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>,
): Promise<{ data: Category | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('categories')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()
    if (error) return { data: null, error: error.message }
    return { data: data as Category, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function deleteCategory(id: string): Promise<{
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('categories')
      .delete()
      .eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}