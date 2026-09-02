import { create, type StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, DeliveryOption, Product } from '../types'

export interface CartCustomer {
  name: string
  phone: string
  address: string
  titikLokasi: string
  notes: string
  delivery: DeliveryOption
}

interface CartState {
  items: CartItem[]
  customer: CartCustomer
  addItem: (product: Product) => { ok: boolean; message: string }
  increment: (productId: string) => void
  decrement: (productId: string) => void
  setQuantity: (productId: string, qty: number) => void
  removeItem: (productId: string) => void
  setCustomer: (customer: Partial<CartCustomer>) => void
  clear: () => void
  getTotal: () => number
  getItemCount: () => number
}

const emptyCustomer: CartCustomer = {
  name: '',
  phone: '',
  address: '',
  titikLokasi: '',
  notes: '',
  delivery: 'pickup',
}

const cartStore: StateCreator<CartState> = (set, get) => ({
  items: [],
  customer: emptyCustomer,

  addItem: (product) => {
    const state = get()
    const existing = state.items.find((i) => i.product.id === product.id)

    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        return {
          ok: false,
          message: `Stok ${product.name} tidak mencukupi (tersisa ${product.stock}).`,
        }
      }
      set({
        items: state.items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
      })
      return { ok: true, message: `${product.name} ditambahkan.` }
    }

    if (product.stock <= 0) {
      return { ok: false, message: `Stok ${product.name} habis.` }
    }

    const item: CartItem = {
      product: {
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        price: product.price,
        stock: product.stock,
        image_url: product.image_url,
        description: product.description,
      },
      quantity: 1,
    }
    set({ items: [...state.items, item] })
    return { ok: true, message: `${product.name} ditambahkan.` }
  },

  increment: (productId) => {
    set({
      items: get().items.map((i) => {
        if (i.product.id === productId && i.quantity < i.product.stock) {
          return { ...i, quantity: i.quantity + 1 }
        }
        return i
      }),
    })
  },

  decrement: (productId) => {
    set({
      items: get()
        .items.map((i) =>
          i.product.id === productId
            ? { ...i, quantity: Math.max(1, i.quantity - 1) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    })
  },

  setQuantity: (productId, qty) => {
    set({
      items: get()
        .items.map((i) =>
          i.product.id === productId
            ? {
                ...i,
                quantity: Math.min(
                  i.product.stock,
                  Math.max(1, Math.floor(qty)),
                ),
              }
            : i,
        )
        .filter((i) => i.quantity > 0),
    })
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.product.id !== productId) })
  },

  setCustomer: (customer) => {
    set({ customer: { ...get().customer, ...customer } })
  },

  clear: () => set({ items: [], customer: emptyCustomer }),

  getTotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
})

export const useCartStore = create<CartState>()(
  persist(cartStore, {
    name: 'pbf-pos-cart',
    version: 2,
  }),
)