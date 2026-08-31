export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function formatWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function validateBarcode(barcode: string): boolean {
  return /^[0-9]{8,20}$/.test(barcode.trim())
}

export function isValidImageUrl(url: string): boolean {
  if (!url) return false
  return /^(https?:\/\/|data:|blob:|\/)/.test(url)
}

export function getSupabasePublicUrl(
  supabaseUrl: string | undefined,
  bucket: string,
  path: string,
): string {
  if (!supabaseUrl || !path) return ''
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}