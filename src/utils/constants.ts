import type { StoreSettings } from '../types'

export const STORE_NAME = 'PUTRA BENGAWAN'
export const STORE_TAGLINE = 'FROZEN FOOD STORE'

export const STORE_SETTINGS: StoreSettings = {
  name: STORE_NAME,
  tagline: STORE_TAGLINE,
  address:
    '42HR+6P8, Jl. Ps. Induk, Kaumanpasar, Brebes, Kec. Brebes, Kab. Brebes, Jawa Tengah 52212',
  phone: '0857-2706-0000',
  whatsapp: '6285727060000',
  instagram: '@putrabengawanfrozenfood',
  open_hours: 'Senin - Minggu 08.00 - 21.00',
  maps_url:
    'https://www.google.com/maps/search/?api=1&query=-6.872774,109.044196',
}

export function waLink(message?: string): string {
  const phone = STORE_SETTINGS.whatsapp.replace(/\D/g, '')
  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : ''
  return `https://wa.me/${phone}${text}`
}

export const WA_PRODUCT_MESSAGE = (name: string) =>
  `Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk ${name}.`

export const WA_GENERAL_MESSAGE =
  'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk Anda.'