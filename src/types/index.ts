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
  instagram: string
  open_hours: string
  maps_url: string
}