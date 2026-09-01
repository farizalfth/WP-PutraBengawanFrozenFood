import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Box,
  MessageCircle,
  Minus,
  PackageSearch,
  Plus,
  Snowflake,
  Tag,
} from 'lucide-react'
import { getProductById } from '../../services/products'
import { formatRupiah } from '../../utils/format'
import { waLink, WA_PRODUCT_MESSAGE } from '../../utils/constants'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { Button } from '../../components/ui/Button'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import { useCartStore } from '../../stores/cartStore'
import { useToast } from '../../stores/toastStore'

export function ProdukDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Awaited<
    ReturnType<typeof getProductById>
  >['data']>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const toast = useToast()

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    getProductById(id).then((res) => {
      if (cancelled) return
      if (res.error) {
        setError('Gagal mengambil data produk.')
      } else if (!res.data) {
        setError('Produk tidak ditemukan.')
      } else {
        setProduct(res.data)
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [id])

  const handleAdd = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      const res = addItem(product)
      if (!res.ok) {
        toast.error(res.message)
        return
      }
    }
    toast.success(`${product.name} ditambahkan ke keranjang.`)
  }

  if (loading) {
    return (
      <div className="container-site py-16">
        <Spinner label="Memuat produk..." />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container-site py-16">
        <StateMessage
          icon={<PackageSearch className="h-10 w-10" />}
          title={error ?? 'Produk tidak ditemukan.'}
          action={
            <Link to="/produk">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" /> Kembali ke Produk
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  const outOfStock = product.stock <= 0

  return (
    <div className="bg-navy-50/40">
      <div className="container-site py-8">
        <Link
          to="/produk"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 transition-colors hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Produk
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-sm">
            <div className="relative aspect-square">
              <ImageWithFallback
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.is_best_seller && (
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 shadow">
                  <Snowflake className="h-3.5 w-3.5" /> BEST SELLER
                </span>
              )}
            </div>
          </div>

          <div>
            {product.categories?.name && (
              <span className="inline-flex items-center gap-1 rounded-full bg-navy-100 px-3 py-1 text-xs font-bold text-navy-700">
                <Tag className="h-3 w-3" /> {product.categories.name}
              </span>
            )}
            <h1 className="mt-3 font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">
              {product.name}
            </h1>

            <p className="mt-3 font-display text-3xl font-extrabold text-navy-800">
              {formatRupiah(product.price)}
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  outOfStock
                    ? 'bg-red-100 text-red-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <Box className="h-3.5 w-3.5" />
                {outOfStock ? 'Stok Habis' : `Stok tersedia: ${product.stock}`}
              </span>
            </div>

            {product.description && (
              <p className="mt-5 leading-relaxed text-navy-600">
                {product.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 rounded-xl border border-navy-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-lg p-2 text-navy-700 transition-colors hover:bg-navy-50"
                  disabled={outOfStock}
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-navy-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(product.stock, q + 1),
                    )
                  }
                  className="rounded-lg p-2 text-navy-700 transition-colors hover:bg-navy-50"
                  disabled={outOfStock}
                  aria-label="Tambah jumlah"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={handleAdd}
                disabled={outOfStock || product.stock < quantity}
                size="lg"
              >
                {outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
              </Button>
            </div>

            <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-4">
              <p className="text-sm font-bold text-navy-900">
                Ingin bertanya / order?
              </p>
              <a
                href={waLink(WA_PRODUCT_MESSAGE(product.name))}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProdukDetailPage