import type { Testimonial } from '../types'
import { getSupabaseClient } from './supabase'

export interface TestimonialInput {
  name: string
  job?: string | null
  message: string
  rating: number
  image_url?: string | null
  is_active?: boolean
}

export async function listActiveTestimonials(): Promise<{
  data: Testimonial[] | null
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (error) return { data: null, error: error.message }
    return { data: data as Testimonial[], error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function listAllTestimonials(): Promise<{
  data: Testimonial[] | null
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return { data: null, error: error.message }
    return { data: data as Testimonial[], error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function createTestimonial(
  input: TestimonialInput,
): Promise<{ data: Testimonial | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('testimonials')
      .insert(input)
      .select('*')
      .single()
    if (error) return { data: null, error: error.message }
    return { data: data as Testimonial, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function updateTestimonial(
  id: string,
  input: Partial<TestimonialInput>,
): Promise<{ data: Testimonial | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('testimonials')
      .update(input)
      .eq('id', id)
      .select('*')
      .single()
    if (error) return { data: null, error: error.message }
    return { data: data as Testimonial, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export async function deleteTestimonial(id: string): Promise<{
  error: string | null
}> {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('testimonials')
      .delete()
      .eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function toggleTestimonial(
  id: string,
  isActive: boolean,
): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('testimonials')
      .update({ is_active: isActive })
      .eq('id', id)
    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}