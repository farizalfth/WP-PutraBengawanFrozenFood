import { SnowflakeIcon } from '../shared/Snowflakes'

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
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p
          className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${
            light ? 'text-ice-300' : 'text-navy-500'
          } ${align === 'center' ? 'justify-center' : ''}`}
        >
          <SnowflakeIcon className="h-4 w-4" />
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-2xl font-extrabold sm:text-3xl md:text-4xl ${
          light ? 'text-white' : 'text-navy-900'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 text-sm leading-relaxed sm:text-base ${
            light ? 'text-navy-200' : 'text-navy-500'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionTitle