import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useToastStore } from '../../stores/toastStore'
import { cn } from '../../lib/utils'

const styles = {
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    icon: 'text-emerald-500',
    Icon: CheckCircle2,
  },
  error: {
    container: 'border-red-200 bg-red-50 text-red-800',
    icon: 'text-red-500',
    Icon: XCircle,
  },
  info: {
    container: 'border-sky-200 bg-sky-50 text-sky-800',
    icon: 'text-sky-500',
    Icon: Info,
  },
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const s = styles[t.type]
        const Icon = s.Icon
        return (
          <div
            key={t.id}
            className={cn(
              'animate-fade-in-up flex items-start gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-medium shadow-lg backdrop-blur',
              s.container,
            )}
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', s.icon)} />
            <span className="flex-1 leading-snug">{t.message}</span>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick()
                  removeToast(t.id)
                }}
                className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-navy-900 shadow-sm transition-transform hover:scale-105"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="shrink-0 opacity-50 transition-opacity hover:opacity-100"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Toaster