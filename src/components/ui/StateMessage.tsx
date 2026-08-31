import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-neutral-600">
      <Loader2 className="h-8 w-8 animate-spin text-black" />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  )
}

export function StateMessage({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-navy-200 bg-navy-50/40 px-6 py-12 text-center">
      {icon && <div className="text-neutral-400">{icon}</div>}
      <p className="text-base font-semibold text-black">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-neutral-600">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default StateMessage