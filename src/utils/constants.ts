import type { StoreSettings } from '../types'

export const STORE_NAME = 'PUTRA BENGAWAN'
export const STORE_TAGLINE = 'TOKO MAKANAN BEKU TERBAIK'

export const STORE_SETTINGS: StoreSettings = {
  name: STORE_NAME,
  tagline: STORE_TAGLINE,
  address:
    '42HR+6P8, Jl. Ps. Induk, Kaumanpasar, Brebes, Kec. Brebes, Kabupaten Brebes, Jawa Tengah 52212',
  phone: '0882-0050-26495',
  whatsapp: '62882005026495',
  owner_instagram: '@anggipasha24',
  instagram: '@putrabengawanfrozenfood',
  open_hours: 'Senin - Minggu 08.00 - 21.00',
  maps_url:
    'https://www.google.com/maps/place/PUTRA+BENGAWAN+FROZEN+FOOD/@-6.8719502,109.0418229,17z',
  map_embed:
    'https://maps.google.com/maps?q=-6.8719502,109.0418229&z=17&output=embed',
  bank_name: 'BCA',
  bank_account: '1230000000',
  bank_holder: 'Putra Bengawan Frozen Food',
  qris_image_url: null,
  shopee_url: null,
  gojek_url: null,
}

export function waLink(message?: string): string {
  return waLinkTo(message, STORE_SETTINGS.whatsapp)
}

export function waLinkTo(message: string | undefined, number: string): string {
  const phone = number.replace(/\D/g, '')
  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : ''
  return `https://wa.me/${phone}${text}`
}

export const WA_PRODUCT_MESSAGE = (name: string) =>
  `Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk ${name}.`

export const WA_GENERAL_MESSAGE =
  'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk Anda.'

export function buildOrderMessage(
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  delivery: string,
): string {
  const lines = items
    .map((i) => `• ${i.name} x${i.quantity} = ${i.price * i.quantity}`)
    .join('\n')
  return [
    'Halo Putra Bengawan Frozen Food, saya ingin order:',
    '',
    lines,
    '',
    `Total: Rp ${total.toLocaleString('id-ID')}`,
    `Pengiriman: ${delivery}`,
  ].join('\n')
}