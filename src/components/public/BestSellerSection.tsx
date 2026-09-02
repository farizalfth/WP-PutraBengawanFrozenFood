import { Link } from 'react-router-dom'
import { ArrowRight, PackageSearch, RefreshCw } from 'lucide-react'
import { listBestSellers } from '../../services/products'
import { useAsyncData } from '../../hooks/useAsyncData'
import ProductCard from './ProductCard'
import Reveal from '../shared/Reveal'
import SectionTitle from './SectionTitle'
import { Spinner, StateMessage } from '../ui/StateMessage'
import { Button } from '../ui/Button'

export function BestSellerSection() {
  const { data: products, error, loading, refetch } = useAsyncData(listBestSellers)

  return (
    <section className="relative bg-white py-20 sm:py-24">
      <div className="container-site">
        <Reveal>
          <SectionTitle
            eyebrow="Favorit Pelanggan"
            title="Produk Best Seller"
            description="Produk pilihan yang paling laris dan disukai pelanggan kami."
          />
        </Reveal>

        <div className="mt-10">
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

          {!loading && !error && (!products || products.length === 0) && (
            <StateMessage
              icon={<PackageSearch className="h-10 w-10" />}
              title="Belum ada produk."
              description="Produk best seller akan tampil di sini setelah admin menambahkannya."
            />
          )}

          {!loading && !error && products && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link
                  to="/produk"
                  className="inline-flex items-center gap-2 rounded-full bg-royal-600 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-ice-400 hover:text-navy-950"
                >
                  Lihat Semua Produk
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default BestSellerSection