import { create, type StateCreator } from 'zustand'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  type: ToastType
  message: string
  action?: { label: string; onClick: () => void }
}

interface ToastState {
  toasts: Toast[]
  showToast: (
    type: ToastType,
    message: string,
    action?: { label: string; onClick: () => void },
  ) => void
  removeToast: (id: number) => void
}

let toastId = 0

const toastStore: StateCreator<ToastState> = (set) => ({
  toasts: [],
  showToast: (type, message, action) => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, type, message, action }] }))
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
    success: (
      msg: string,
      action?: { label: string; onClick: () => void },
    ) => showToast('success', msg, action),
    error: (msg: string, action?: { label: string; onClick: () => void }) =>
      showToast('error', msg, action),
    info: (msg: string, action?: { label: string; onClick: () => void }) =>
      showToast('info', msg, action),
  }
}