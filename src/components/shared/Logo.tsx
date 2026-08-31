import { cn } from '../../lib/utils'
import { SnowflakeIcon } from './Snowflakes'

export function Logo({
  variant = 'light',
  size = 'md',
}: {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}) {
  const textColor = variant === 'light' ? 'text-white' : 'text-navy-900'
  const subColor = variant === 'light' ? 'text-navy-200' : 'text-navy-500'
  const sizes = {
    sm: { icon: 26, title: 'text-sm', tagline: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 34, title: 'text-base', tagline: 'text-[10px]', gap: 'gap-2.5' },
    lg: { icon: 44, title: 'text-lg', tagline: 'text-[11px]', gap: 'gap-3' },
  }
  const s = sizes[size]

  return (
    <div className={cn('flex items-center', s.gap)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-xl shadow-md',
          variant === 'light'
            ? 'bg-white text-navy-800'
            : 'bg-navy-800 text-white',
        )}
        style={{ width: s.icon, height: s.icon }}
      >
        <SnowflakeIcon style={{ width: s.icon * 0.6, height: s.icon * 0.6 }} />
      </div>
      <div className="leading-tight">
        <p className={cn('font-display font-extrabold tracking-wide', s.title, textColor)}>
          PUTRA BENGAWAN
        </p>
        <p className={cn('font-semibold tracking-[0.2em]', s.tagline, subColor)}>
          FROZEN FOOD STORE
        </p>
      </div>
    </div>
  )
}

export default Logo