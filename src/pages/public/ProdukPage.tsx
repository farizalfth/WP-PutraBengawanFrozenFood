import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, PackageSearch, RefreshCw, Search, SnowflakeIcon } from 'lucide-react'
import { listProducts } from '../../services/products'
import { listCategories } from '../../services/categories'
import { useAsyncData } from '../../hooks/useAsyncData'
import ProductCard from '../../components/public/ProductCard'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'

const PER_PAGE = 10

export function ProdukPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('kategori') ?? ''
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

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
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,209,249,0.15),transparent_55%)]" />
        <SnowflakeIcon className="pointer-events-none absolute -right-10 top-10 h-40 w-40 opacity-10" />
        <div className="container-site relative text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-ice-300">
            Katalog
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Produk Kami
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-navy-200">
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
            onClick={() => {
              setSearchParams({})
              setPage(1)
            }}
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
              onClick={() => {
                setSearchParams({ kategori: c.name })
                setPage(1)
              }}
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
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered
                  .slice((page - 1) * PER_PAGE, page * PER_PAGE)
                  .map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
              </div>

              {filtered.length > PER_PAGE && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 transition-colors hover:bg-royal-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-navy-700"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({
                    length: Math.ceil(filtered.length / PER_PAGE),
                  }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        'h-10 w-10 rounded-full text-sm font-bold transition-colors',
                        page === i + 1
                          ? 'bg-royal-600 text-white shadow-md'
                          : 'border border-navy-200 bg-white text-navy-700 hover:bg-navy-50',
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          Math.ceil(filtered.length / PER_PAGE),
                          p + 1,
                        ),
                      )
                    }
                    disabled={page === Math.ceil(filtered.length / PER_PAGE)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 transition-colors hover:bg-royal-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-navy-700"
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProdukPage