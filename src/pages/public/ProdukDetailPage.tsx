import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  BadgeCheck,
  Barcode,
  Box,
  CheckCircle2,
  Clock,
  MessageCircle,
  Minus,
  PackageSearch,
  Plus,
  ShieldCheck,
  Snowflake,
  Tag,
  Truck,
  UtensilsCrossed,
} from 'lucide-react'
import { getProductById } from '../../services/products'
import { formatRupiah } from '../../utils/format'
import { waLink, WA_PRODUCT_MESSAGE } from '../../utils/constants'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { Button } from '../../components/ui/Button'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import { useCartStore } from '../../stores/cartStore'
import { useToast } from '../../stores/toastStore'
import { SnowflakeIcon } from '../../components/shared/Snowflakes'

export function ProdukDetailPage() {
  const navigate = useNavigate()
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
    toast.success(`${product.name} ditambahkan ke keranjang.`, {
      label: 'Lihat Keranjang',
      onClick: () => navigate('/keranjang'),
    })
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
        />
      </div>
    )
  }

  const outOfStock = product.stock <= 0

  const trustPoints = [
    { icon: ShieldCheck, label: 'Halal & Higienis' },
    { icon: Snowflake, label: 'Beku Optimal' },
    { icon: Truck, label: 'Pengiriman Aman' },
  ]

  return (
    <div className="relative overflow-hidden bg-navy-50/40">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-ice-400/10 blur-3xl" />
      <div className="container-site relative py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-ice-400/30 to-royal-500/20 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white p-3 shadow-xl shadow-navy-950/10">
              <div className="relative aspect-[1170/1463] overflow-hidden rounded-3xl bg-gradient-to-br from-navy-50 to-ice-100">
                <ImageWithFallback
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
                {product.is_best_seller && (
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-amber-950 shadow-lg">
                    <BadgeCheck className="h-4 w-4" /> BEST SELLER
                  </span>
                )}
              </div>
            </div>

            {product.categories?.name && (
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-white px-3.5 py-1.5 text-xs font-bold text-royal-600 shadow-sm">
                  <Tag className="h-3.5 w-3.5" /> {product.categories.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-ice-400 to-royal-500 text-white shadow-lg shadow-ice-400/25">
                <UtensilsCrossed className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-ice-500">
                  Putra Bengawan Frozen Food
                </p>
                <h1 className="mt-0.5 font-display text-2xl font-extrabold leading-tight text-navy-900 sm:text-3xl">
                  {product.name}
                </h1>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-navy-100">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Harga
                </p>
                <p className="mt-1 font-display text-3xl font-extrabold text-navy-900">
                  {formatRupiah(product.price)}
                </p>
              </div>
              <div className="h-10 w-px bg-navy-100" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Stok
                </p>
                <span
                  className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
                    outOfStock
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  <Box className="h-4 w-4" />
                  {outOfStock ? 'Stok Habis' : `${product.stock} tersedia`}
                </span>
              </div>
              <div className="h-10 w-px bg-navy-100" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Kode Produk
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-navy-800">
                  <Barcode className="h-4 w-4 text-navy-400" />
                  {product.barcode}
                </p>
              </div>
            </div>

            {product.description && (
              <div className="mt-6">
                <h2 className="font-display text-base font-bold text-navy-900">
                  Deskripsi
                </h2>
                <p className="mt-2 leading-relaxed text-navy-600">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-6">
              <div className="flex flex-wrap gap-3">
                {trustPoints.map((t) => (
                  <span
                    key={t.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 shadow-sm ring-1 ring-navy-100"
                  >
                    <t.icon className="h-4 w-4 text-ice-500" />
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 rounded-2xl border border-navy-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-xl p-2.5 text-navy-700 transition-all hover:bg-navy-50 active:scale-95"
                  disabled={outOfStock}
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-base font-bold text-navy-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="rounded-xl p-2.5 text-navy-700 transition-all hover:bg-navy-50 active:scale-95"
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
                className="flex-1 sm:flex-none"
              >
                {outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
              </Button>
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-navy-800 to-royal-950 p-5 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">Ingin bertanya / order?</p>
                  <p className="text-xs text-navy-300">
                    Tim kami siap membantu via WhatsApp.
                  </p>
                </div>
              </div>
              <a
                href={waLink(WA_PRODUCT_MESSAGE(product.name))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" /> Chat via WhatsApp
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-navy-400">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Pembelian eceran &amp; grosir
              </span>
              <span className="inline-flex items-center gap-1.5">
                <SnowflakeIcon className="h-4 w-4 text-ice-400" />
                Kemasan styrofoam beku
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-royal-400" />
                Buka Senin - Minggu 08.00 - 21.00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProdukDetailPage