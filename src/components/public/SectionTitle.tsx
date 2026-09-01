import { cn } from '../../lib/utils'

interface SectionTitleProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
  light?: boolean
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
}: SectionTitleProps) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={cn('max-w-3xl', alignment)}>
      {eyebrow && (
        <p
          className={cn(
            'mb-3 text-xs font-bold uppercase tracking-[0.24em]',
            light ? 'text-ice-300' : 'text-ice-400',
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'font-display text-3xl font-extrabold capitalize leading-[1.15] sm:text-4xl md:text-[2.6rem]',
          light ? 'text-white' : 'text-navy-950',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-sm leading-relaxed sm:text-base',
            light ? 'text-navy-200' : 'text-navy-500',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionTitle