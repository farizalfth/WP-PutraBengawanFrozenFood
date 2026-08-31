import { Link } from 'react-router-dom'
import { Eye, Snowflake } from 'lucide-react'
import type { Product } from '../../types'
import { formatRupiah } from '../../utils/format'
import ImageWithFallback from '../ui/ImageWithFallback'

export function ProductCard({ product }: { product: Product }) {
  const { id, name, price, stock, image_url, categories, is_best_seller } =
    product

  return (
    <Link
      to={`/produk/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden bg-navy-50">
        <ImageWithFallback
          src={image_url}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {is_best_seller && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950 shadow-sm">
            <Snowflake className="h-3 w-3" />
            BEST SELLER
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-navy-950/0 opacity-0 transition-all duration-300 group-hover:bg-navy-950/25 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-navy-800 shadow-md">
            <Eye className="h-3.5 w-3.5" />
            Detail
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        {categories?.name && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
            {categories.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-navy-900">
          {name}
        </h3>
        <div className="mt-auto flex items-end justify-between pt-1">
          <div>
            <p className="font-display text-base font-extrabold text-navy-800">
              {formatRupiah(price)}
            </p>
            <p
              className={`text-[11px] font-medium ${
                stock > 0 ? 'text-navy-400' : 'text-red-500'
              }`}
            >
              {stock > 0 ? `Stok ${stock}` : 'Stok Habis'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard