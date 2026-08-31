import type { SVGProps } from 'react'

export function SnowflakeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <polyline points="4.93 4.93 8.36 8.36 15.64 15.64 19.071 19.071" />
      <polyline points="4.93 19.07 8.36 15.64 15.64 8.36 19.071 4.93" />
    </svg>
  )
}

export function Snowfall({
  count = 12,
  className = '',
}: {
  count?: number
  className?: string
}) {
  const flakes = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: (i * 97) % 100,
    top: (i * 53) % 100,
    size: 8 + ((i * 7) % 14),
    opacity: 0.08 + ((i * 13) % 10) / 100,
    duration: 4 + ((i * 5) % 6),
  }))

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {flakes.map((f) => (
        <SnowflakeIcon
          key={f.id}
          className="absolute animate-float-slow text-white"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${(f.id % 5) * 0.7}s`,
          }}
        />
      ))}
    </div>
  )
}

export function SnowDivider({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <SnowflakeIcon
          key={i}
          className="absolute animate-spin-slow text-navy-700"
          style={{
            width: 14 + i * 4,
            height: 14 + i * 4,
            top: `${50 - i * 12}%`,
            left: `${8 + i * 18}%`,
            opacity: 0.1,
            animation: `spin-snow 14s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

declare module 'react' {
  interface CSSProperties {
    animationDuration?: string
    animationDelay?: string
  }
}