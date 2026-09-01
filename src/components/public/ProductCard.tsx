import { Link } from 'react-router-dom'
import { ArrowRight, Snowflake } from 'lucide-react'
import type { Product } from '../../types'
import { formatRupiah } from '../../utils/format'
import ImageWithFallback from '../ui/ImageWithFallback'

export function ProductCard({ product }: { product: Product }) {
  const { id, name, price, stock, image_url, categories, is_best_seller } =
    product

  return (
    <Link
      to={`/produk/${id}`}
      className="group flex flex-col overflow-hidden rounded-[10px] border border-[#c4d3d3] bg-white transition-shadow duration-300 hover:shadow-[0_0_45px_rgba(0,0,0,0.1)]"
    >
      <div className="relative aspect-square overflow-hidden bg-navy-50">
        <ImageWithFallback
          src={image_url}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {is_best_seller && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-ice-400 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            <Snowflake className="h-3 w-3" />
            BEST SELLER
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center bg-navy-50/40 p-4 text-center">
        {categories?.name && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-400">
            {categories.name}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 font-display text-[17px] font-bold leading-snug text-navy-950">
          {name}
        </h3>
        <p className="mt-2 font-display text-lg font-bold text-ice-400">
          {formatRupiah(price)}
        </p>
        <p
          className={`mt-0.5 text-xs ${
            stock > 0 ? 'text-emerald-600' : 'text-red-500'
          }`}
        >
          {stock > 0 ? `Stok ${stock}` : 'Stok Habis'}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-royal-600 px-5 py-2 text-xs font-bold text-white transition-colors group-hover:bg-ice-400 group-hover:text-navy-950">
          Lihat Detail
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

export default ProductCard