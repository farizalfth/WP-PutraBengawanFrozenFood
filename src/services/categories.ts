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

export interface SuggestedCategory {
  name: string
  description?: string | null
}

export async function seedCategories(
  suggestions: SuggestedCategory[],
): Promise<{ added: number; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data: existing, error: listErr } = await client
      .from('categories')
      .select('name')
    if (listErr) return { added: 0, error: listErr.message }

    const existingNames = new Set((existing ?? []).map((c) => c.name))
    const toInsert = suggestions.filter((s) => !existingNames.has(s.name))
    if (toInsert.length === 0) return { added: 0, error: null }

    const { error: insertErr } = await client
      .from('categories')
      .insert(
        toInsert.map((s) => ({
          name: s.name,
          description: s.description || null,
        })),
      )
    if (insertErr) return { added: 0, error: insertErr.message }
    return { added: toInsert.length, error: null }
  } catch (e) {
    return { added: 0, error: (e as Error).message }
  }
}