import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PackageSearch, RefreshCw, Search, SnowflakeIcon } from 'lucide-react'
import { listProducts } from '../../services/products'
import { listCategories } from '../../services/categories'
import { useAsyncData } from '../../hooks/useAsyncData'
import ProductCard from '../../components/public/ProductCard'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'

export function ProdukPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('kategori') ?? ''
  const [query, setQuery] = useState('')

  const {
    data: products,
    error,
    loading,
    refetch,
  } = useAsyncData(listProducts)
  const { data: categories } = useAsyncData(listCategories)

  const filtered = useMemo(() => {
    if (!products) return []
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchCat = activeCategory
        ? p.categories?.name === activeCategory
        : true
      const matchQuery = q
        ? p.name.toLowerCase().includes(q) ||
          (p.categories?.name ?? '').toLowerCase().includes(q)
        : true
      return matchCat && matchQuery
    })
  }, [products, activeCategory, query])

  return (
    <div className="bg-navy-50/40">
      <section className="relative overflow-hidden bg-navy-950 py-14 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,209,249,0.15),transparent_55%)]" />
        <SnowflakeIcon className="pointer-events-none absolute -right-10 top-10 h-40 w-40 opacity-10" />
        <div className="container-site relative">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-ice-300">
            Katalog
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Produk Kami
          </h1>
          <p className="mt-2 max-w-lg text-sm text-navy-200">
            Jelajahi berbagai pilihan frozen food berkualitas untuk keluarga
            Anda.
          </p>
        </div>
      </section>

      <div className="container-site py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full rounded-full border border-navy-200 bg-white py-2.5 pl-10 pr-4 text-sm text-navy-900 shadow-sm outline-none placeholder:text-navy-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
            />
          </div>
        </div>

        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors',
              !activeCategory
                ? 'bg-royal-600 text-white'
                : 'border border-navy-200 bg-white text-navy-600 hover:bg-navy-50',
            )}
          >
            Semua
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSearchParams({ kategori: c.name })}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors',
                activeCategory === c.name
                  ? 'bg-royal-600 text-white'
                  : 'border border-navy-200 bg-white text-navy-600 hover:bg-navy-50',
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading && <Spinner label="Memuat produk..." />}

          {error && (
            <StateMessage
              icon={<PackageSearch className="h-10 w-10" />}
              title="Gagal mengambil data produk."
              description={error}
              action={
                <Button variant="outline" size="sm" onClick={refetch}>
                  <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
                </Button>
              }
            />
          )}

          {!loading && !error && filtered.length === 0 && (
            <StateMessage
              icon={<PackageSearch className="h-10 w-10" />}
              title={
                products && products.length === 0
                  ? 'Belum ada produk.'
                  : 'Produk tidak ditemukan.'
              }
              description="Coba ubah kata kunci pencarian atau pilih kategori lain."
            />
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProdukPage