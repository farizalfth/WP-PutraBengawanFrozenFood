import type { ReactNode } from 'react'

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-black">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-neutral-600">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function AdminCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        {children}
      </table>
    </div>
  )
}

export function Th({
  children,
  className = '',
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <th
      className={`border-b border-navy-100 bg-navy-50/60 px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600 ${className}`}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  className = '',
}: {
  children?: ReactNode
  className?: string
}) {
  return <td className={`border-b border-navy-50 px-4 py-3 text-black ${className}`}>{children}</td>
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Cari...',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-56 max-w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
    />
  )
}