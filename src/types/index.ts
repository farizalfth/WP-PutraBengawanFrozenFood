export type Role = 'admin' | 'cashier'

export interface Profile {
  id: string
  user_id: string
  name: string
  email: string
  role: Role
  created_at: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
  products?: Array<{ count: number }> | null
}

export interface Product {
  id: string
  barcode: string
  name: string
  description: string | null
  category_id: string | null
  price: number
  stock: number
  image_url: string | null
  is_best_seller: boolean
  created_at: string
  updated_at: string
  categories?: Pick<Category, 'id' | 'name' | 'image_url'> | null
}

export interface Testimonial {
  id: string
  name: string
  job: string | null
  message: string
  rating: number
  image_url: string | null
  is_active: boolean
  created_at: string
}

export interface Transaction {
  id: string
  invoice_number: string
  cashier_id: string
  total_amount: number
  payment_amount: number
  change_amount: number
  created_at: string
  profiles?: Pick<Profile, 'id' | 'name'> | null
}

export interface TransactionItem {
  id: string
  transaction_id: string
  product_id: string
  quantity: number
  price: number
  subtotal: number
  products?: Pick<Product, 'id' | 'name' | 'barcode'> | null
}

export interface CartItem {
  product: Pick<
    Product,
    | 'id'
    | 'barcode'
    | 'name'
    | 'price'
    | 'stock'
    | 'image_url'
    | 'description'
  >
  quantity: number
}

export interface StoreSettings {
  name: string
  tagline: string
  address: string
  phone: string
  whatsapp: string
  owner_instagram: string
  instagram: string
  open_hours: string
  maps_url: string
  map_embed: string
  bank_name?: string
  bank_account?: string
  bank_holder?: string
  qris_image_url?: string | null
  shopee_url?: string | null
  gojek_url?: string | null
}

export interface OrderItem {
  product_id: string
  name: string
  quantity: number
  price: number
  subtotal: number
}

export type DeliveryOption = 'pickup' | 'gojek' | 'shopee' | 'courier'
export type PaymentMethod = 'qris' | 'transfer' | 'cash'

export interface Order {
  id: string
  number: string
  created_at: string
  items: OrderItem[]
  total: number
  customer_name: string
  customer_phone: string
  address: string
  titik_lokasi?: string
  notes: string
  delivery: DeliveryOption
  payment: PaymentMethod
  status: 'menunggu' | 'diproses' | 'selesai' | 'batal'
}

export interface WebOrderItem {
  product_id: string
  name: string
  quantity: number
  price: number
  subtotal: number
}

export interface WebOrder {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  address: string
  titik_lokasi: string | null
  notes: string | null
  delivery: string
  payment: string
  total_amount: number
  status: 'pending' | 'accepted' | 'done'
  payment_proof?: string | null
  payment_confirmed_at?: string | null
  synced_transaction_id?: string | null
  created_at: string
}

export interface WebOrderItemRow {
  id: string
  web_order_id: string
  product_id: string
  name: string
  quantity: number
  price: number
  subtotal: number
}

export type WebOrderStatus = WebOrder['status']