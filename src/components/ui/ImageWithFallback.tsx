import { useState } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ImageWithFallbackProps {
  src: string | null | undefined
  alt: string
  className?: string
}

export function DefaultProductImage({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-navy-100 to-ice-100 text-navy-400',
        className,
      )}
    >
      <UtensilsCrossed className="h-1/3 w-1/3" />
    </div>
  )
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return <DefaultProductImage className={className} />
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
    />
  )
}

export default ImageWithFallback