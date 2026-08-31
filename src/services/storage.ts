import { getSupabaseClient, IMAGES_BUCKET } from './supabase'

export async function uploadImage(
  file: File,
  folder: string,
): Promise<{ url: string | null; error: string | null }> {
  try {
    const client = getSupabaseClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`
    const { error: uploadError } = await client.storage
      .from(IMAGES_BUCKET)
      .upload(path, file, { upsert: false })

    if (uploadError) return { url: null, error: uploadError.message }

    const { data } = client.storage.from(IMAGES_BUCKET).getPublicUrl(path)
    return { url: data.publicUrl, error: null }
  } catch (e) {
    return { url: null, error: (e as Error).message }
  }
}

export async function deleteImage(path: string): Promise<{ error: string | null }> {
  try {
    const client = getSupabaseClient()
    const cleanPath = path.split(`/object/public/${IMAGES_BUCKET}/`)[1]
    if (!cleanPath) return { error: null }
    const { error } = await client.storage.from(IMAGES_BUCKET).remove([cleanPath])
    return { error: error?.message ?? null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export function extractStoragePath(url: string): string {
  const marker = `/object/public/${IMAGES_BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return ''
  return url.slice(idx + marker.length)
}