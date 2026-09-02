import { create, type StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order, OrderItem, DeliveryOption, PaymentMethod } from '../types'

export interface CreateOrderInput {
  items: OrderItem[]
  total: number
  customer_name: string
  customer_phone: string
  address: string
  titik_lokasi?: string
  notes: string
  delivery: DeliveryOption
  payment: PaymentMethod
}

interface OrderState {
  orders: Order[]
  createOrder: (input: CreateOrderInput) => Order
  getOrder: (id: string) => Order | undefined
}

function pad(n: number, len = 2): string {
  return String(n).padStart(len, '0')
}

export function generateOrderNumber(): string {
  const now = new Date()
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  return `PBFF-${datePart}-${timePart}`
}

const orderStore: StateCreator<OrderState> = (set, get) => ({
  orders: [],

  createOrder: (input) => {
    const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
    const order: Order = {
      id,
      number: generateOrderNumber(),
      created_at: new Date().toISOString(),
      items: input.items,
      total: input.total,
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      address: input.address,
      titik_lokasi: input.titik_lokasi,
      notes: input.notes,
      delivery: input.delivery,
      payment: input.payment,
      status: 'menunggu',
    }
    set({ orders: [order, ...get().orders] })
    return order
  },

  getOrder: (id) => get().orders.find((o) => o.id === id),
})

export const useOrderStore = create<OrderState>()(
  persist(orderStore, {
    name: 'pbf-orders',
    version: 2,
  }),
)