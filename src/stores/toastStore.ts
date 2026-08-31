import { create, type StateCreator } from 'zustand'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastState {
  toasts: Toast[]
  showToast: (type: ToastType, message: string) => void
  removeToast: (id: number) => void
}

let toastId = 0

const toastStore: StateCreator<ToastState> = (set) => ({
  toasts: [],
  showToast: (type, message) => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3800)
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
})

export const useToastStore = create(toastStore)

export function useToast() {
  const showToast = useToastStore((s) => s.showToast)
  return {
    success: (msg: string) => showToast('success', msg),
    error: (msg: string) => showToast('error', msg),
    info: (msg: string) => showToast('info', msg),
  }
}