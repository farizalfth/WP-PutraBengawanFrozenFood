import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGrid, PackageSearch, RefreshCw } from 'lucide-react'
import { listCategories } from '../../services/categories'
import { useAsyncData } from '../../hooks/useAsyncData'
import Reveal from '../shared/Reveal'
import SectionTitle from './SectionTitle'
import ImageWithFallback from '../ui/ImageWithFallback'
import { Spinner, StateMessage } from '../ui/StateMessage'
import { Button } from '../ui/Button'

export function CategorySection() {
  const { data: categories, error, loading, refetch } = useAsyncData(listCategories)

  const ordered = useMemo(() => {
    if (!categories) return []
    const withCount = categories.map((c) => ({
      ...c,
      productCount: c.products?.[0]?.count ?? 0,
    }))
    const withProducts = withCount
      .filter((c) => c.productCount > 0)
      .sort((a, b) => b.productCount - a.productCount)
    const lainnya = withProducts.filter((c) => c.name === 'Lainnya')
    const rest = withProducts.filter((c) => c.name !== 'Lainnya')
    return [...rest, ...lainnya]
  }, [categories])

  const chunked = ordered.length
    ? Array.from({ length: Math.ceil(ordered.length / 5) }, (_, i) =>
        ordered.slice(i * 5, i * 5 + 5),
      )
    : []

  return (
    <section className="relative bg-navy-50 py-20 sm:py-24">
      <div className="container-site">
        <Reveal>
          <SectionTitle
            eyebrow="Kategori"
            title="Kategori Produk"
            description="Temukan produk sesuai kebutuhan Anda."
          />
        </Reveal>

        <div className="mt-10">
          {loading && <Spinner label="Memuat kategori..." />}

          {error && (
            <StateMessage
              icon={<PackageSearch className="h-10 w-10" />}
              title="Gagal mengambil data kategori."
              description={error}
              action={
                <Button variant="outline" size="sm" onClick={refetch}>
                  <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
                </Button>
              }
            />
          )}

          {!loading && !error && (!categories || categories.length === 0) && (
            <StateMessage
              icon={<LayoutGrid className="h-10 w-10" />}
              title="Belum ada kategori."
              description="Kategori akan tampil di sini setelah admin menambahkannya."
            />
          )}

          {!loading && !error && chunked.length > 0 && (
            <div className="space-y-4">
              {chunked.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                >
                  {row.map((cat, idx) => (
                    <Reveal key={cat.id} delay={idx * 60}>
                      <Link
                        to={`/produk?kategori=${encodeURIComponent(cat.name)}`}
                        className="group block overflow-hidden rounded-[20px] border border-navy-100 bg-gradient-to-br from-royal-700 to-royal-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(25,64,154,0.25)]"
                      >
                        <div className="relative aspect-[4/3]">
                          <ImageWithFallback
                            src={cat.image_url}
                            alt={cat.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" />
                        </div>
                        <div className="flex items-center justify-between gap-2 px-4 py-3">
                          <span className="font-display text-sm font-bold text-white">
                            {cat.name}
                          </span>
                          <span className="shrink-0 rounded-full bg-ice-400 px-2.5 py-0.5 text-[10px] font-bold text-navy-950">
                            {cat.productCount} produk
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CategorySection