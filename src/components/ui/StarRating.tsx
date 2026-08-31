import { Star } from 'lucide-react'

export function StarRating({
  rating,
  className = '',
}: {
  rating: number
  className?: string
}) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`Rating ${rating} dari 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'fill-navy-200 text-navy-200'}`}
        />
      ))}
    </div>
  )
}

export default StarRating