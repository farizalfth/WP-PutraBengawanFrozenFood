import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { cn } from '../../lib/utils'

const fieldBase =
  'w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 shadow-sm outline-none transition-colors placeholder:text-navy-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-100'

interface FieldProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}

export function Field({ label, error, hint, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-navy-800">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-navy-400">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return <input className={cn(fieldBase, className)} {...props} />
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return (
    <textarea className={cn(fieldBase, 'min-h-[96px] resize-y', className)} {...props} />
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className = '', ...props }: SelectProps) {
  return <select className={cn(fieldBase, 'cursor-pointer', className)} {...props} />
}

export function Badge({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({
  active,
}: {
  active: boolean
}) {
  return (
    <Badge
      className={
        active
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-red-100 text-red-700'
      }
    >
      {active ? 'Aktif' : 'Nonaktif'}
    </Badge>
  )
}

export function RoleBadge({ role }: { role: 'admin' | 'cashier' }) {
  return (
    <Badge
      className={
        role === 'admin' ? 'bg-navy-100 text-navy-700' : 'bg-ice-100 text-sky-700'
      }
    >
      {role === 'admin' ? 'Admin' : 'Kasir'}
    </Badge>
  )
}