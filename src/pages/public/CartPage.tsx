import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ClipboardList,
  LocateFixed,
  MapPin,
  Minus,
  PackageSearch,
  Plus,
  ShoppingBasket,
  ShoppingCart,
  Trash2,
  UserRound,
} from 'lucide-react'
import { formatRupiah } from '../../utils/format'
import { STORE_SETTINGS } from '../../utils/constants'
import { useCartStore } from '../../stores/cartStore'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { Button } from '../../components/ui/Button'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import Reveal from '../../components/shared/Reveal'
import { Snowfall, SnowflakeIcon } from '../../components/shared/Snowflakes'
import { cn } from '../../lib/utils'
import type { DeliveryOption } from '../../types'

const deliveryOptions: { id: DeliveryOption; label: string }[] = [
  { id: 'pickup', label: 'Ambil di Toko' },
  { id: 'gojek', label: 'Dikirim Gojek' },
  { id: 'shopee', label: 'Dikirim ShopeeFood' },
  { id: 'courier', label: 'Kurir / Ekspedisi' },
]

interface PointPosition {
  latitude: number
  longitude: number
}

interface GeolocationPosition {
  coords: PointPosition
}

interface Geolocate {
  getCurrentPosition?: (
    resolve: (pos: GeolocationPosition) => void,
    reject?: () => void,
    options?: {
      enableHighAccuracy?: boolean
      timeout?: number
      maximumAge?: number
    },
  ) => void
}

export function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const customer = useCartStore((s) => s.customer)
  const setCustomer = useCartStore((s) => s.setCustomer)
  const increment = useCartStore((s) => s.increment)
  const decrement = useCartStore((s) => s.decrement)
  const removeItem = useCartStore((s) => s.removeItem)

  const [error, setError] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  const pickup = customer.delivery === 'pickup'

  const useMyLocation = () => {
    const navGeo = (navigator as unknown as { geolocation?: Geolocate }).geolocation
    if (!navGeo || !navGeo.getCurrentPosition) {
      setError(
        'Browser/blokir tidak menyediakan lokasi otomatis. Buka Google Maps lalu paste link Share (Bagikan) di kolom di atas.',
      )
      return
    }
    setLocating(true)
    setError(null)
    navGeo.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords?.latitude
        const longitude = pos.coords?.longitude
        if (latitude == null || longitude == null) {
          setLocating(false)
          setError(
            'Gagal mendapat koordinat lokasi. Coba izinkan kembali akses lokasi, atau paste link dari Google Maps.',
          )
          return
        }
        const coords = `${latitude},${longitude}`
        setCustomer({
          titikLokasi: `https://www.google.com/maps?q=${coords}`,
        })
        setError(null)
        setLocating(false)
      },
      () => {
        setLocating(false)
        setError(
          'Gagal mengambil lokasi. Pastikan izin lokasi diizinkan & GPS/Lokasi hidup, atau paste link tempat dari Google Maps.',
        )
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  const goToCheckout = () => {
    if (!customer.name.trim()) {
      setError('Nama wajib diisi.')
      return
    }
    if (!/^[0-9+\s-]{10,}$/.test(customer.phone.replace(/\D/g, ''))) {
      setError('Nomor HP / WhatsApp tidak valid.')
      return
    }
    if (!pickup && !customer.address.trim()) {
      setError('Alamat pengiriman wajib diisi.')
      return
    }
    setError(null)
    navigate('/checkout')
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,209,249,0.18),transparent_55%)]" />
        <Snowfall count={12} />
        <div className="container-site relative text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-ice-300">
            <ShoppingCart className="h-4 w-4" /> Keranjang
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Keranjang Belanja
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-navy-200">
            Periksa pesanan Anda, lalu lanjut ke checkout untuk memilih cara
            pengiriman & pembayaran.
          </p>
        </div>
      </section>

      <div className="container-site py-12">
        {count === 0 ? (
          <StateMessage
            icon={<ShoppingCart className="h-10 w-10" />}
            title="Keranjang Anda masih kosong."
            description="Jelajahi katalog produk kami dan pilih frozen food favorit Anda."
            action={
              <Link to="/produk">
                <Button variant="primary" size="lg">
                  Lihat Produk <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            }
          />
        ) : (
          <>
            <Reveal>
              <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ice-400 to-royal-500 text-white">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-navy-900">
                    Data Pemesan
                  </h3>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-navy-900">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ name: e.target.value })}
                      placeholder="cth: Siti Rahayu"
                      className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-navy-900">
                      No. HP / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ phone: e.target.value })}
                      placeholder="cth: 0812xxxxxxxx"
                      className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <label className="block text-sm font-semibold text-navy-900">
                    Cara Pengiriman
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {deliveryOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCustomer({ delivery: opt.id })}
                        className={cn(
                          'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                          customer.delivery === opt.id
                            ? 'border-royal-500 bg-royal-50 text-royal-800'
                            : 'border-navy-200 text-navy-700 hover:border-navy-400',
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <label className="block text-sm font-semibold text-navy-900">
                    Alamat Pengiriman
                    {!pickup && <span className="text-red-500"> *</span>}
                  </label>
                  <textarea
                    value={customer.address}
                    onChange={(e) => setCustomer({ address: e.target.value })}
                    rows={2}
                    disabled={pickup}
                    placeholder={
                      pickup
                        ? 'Tidak diperlukan jika ambil di toko.'
                        : 'cth: Jl. Sudirman No. 12, Brebes'
                    }
                    className="w-full resize-none rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100 disabled:cursor-not-allowed disabled:bg-navy-50"
                  />
                  {pickup && (
                    <p className="flex items-center gap-1.5 text-xs text-navy-400">
                      <MapPin className="h-3.5 w-3.5" />
                      Alamat toko: {STORE_SETTINGS.address}
                    </p>
                  )}
                </div>

                <div className="mt-4 space-y-1.5">
                  <label className="block text-sm font-semibold text-navy-900">
                    Titik Lokasi (real, via Google Maps)
                  </label>
                  <input
                    type="text"
                    value={customer.titikLokasi}
                    onChange={(e) =>
                      setCustomer({ titikLokasi: e.target.value })
                    }
                    placeholder="cth: https://www.google.com/maps?q=-6.87,109.04"
                    className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={useMyLocation}
                      disabled={locating}
                      className="inline-flex items-center gap-1.5 rounded-full border border-royal-500 bg-royal-50 px-3 py-1.5 text-xs font-semibold text-royal-700 transition-colors hover:bg-royal-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {locating ? (
                        <Spinner label="" />
                      ) : (
                        <LocateFixed className="h-3.5 w-3.5" />
                      )}
                      {locating ? 'Mendeteksi...' : 'Gunakan Lokasi Saya'}
                    </button>
                    <span className="text-xs text-navy-400">
                      Pin alamat Anda di Google Maps, klik Share/Bagikan, copy
                      link-nya, lalu paste di kolom atas. Atau pakai tombol
                      otomatis.
                    </span>
                  </div>
                  {customer.titikLokasi && (
                    <a
                      href={customer.titikLokasi}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-royal-600 hover:text-royal-800"
                    >
                      <MapPin className="h-3.5 w-3.5" /> Buka titik lokasi
                    </a>
                  )}
                </div>

                <div className="mt-4 space-y-1.5">
                  <label className="block text-sm font-semibold text-navy-900">
                    Catatan (opsional)
                  </label>
                  <input
                    type="text"
                    value={customer.notes}
                    onChange={(e) => setCustomer({ notes: e.target.value })}
                    placeholder="cth: sertakan es batu / kertas pembungkus"
                    className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
                  />
                </div>
              </div>
            </Reveal>

            <div className="mt-12 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-ice-400 to-royal-500 text-white">
                <ShoppingBasket className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Detail Pesanan
                </h3>
                <p className="text-xs text-navy-400">
                  Review produk yang Anda pilih sebelum lanjut checkout.
                </p>
              </div>
            </div>

            <div className="mt-6 grid items-start gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {items.map((item, i) => (
                  <Reveal key={item.product.id} delay={i * 50}>
                    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
                      <Link
                        to={`/produk/${item.product.id}`}
                        className="block h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-navy-50"
                      >
                        <ImageWithFallback
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                          {item.product.barcode}
                        </p>
                        <Link
                          to={`/produk/${item.product.id}`}
                          className="mt-0.5 block truncate font-display text-base font-bold text-navy-900 hover:text-royal-600"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-sm font-bold text-royal-600">
                          {formatRupiah(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-xl border border-navy-200 bg-white p-1">
                          <button
                            type="button"
                            onClick={() => decrement(item.product.id)}
                            className="rounded-lg p-2 text-navy-700 transition-colors hover:bg-navy-50"
                            aria-label={`Kurangi ${item.product.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-9 text-center text-sm font-bold text-navy-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increment(item.product.id)}
                            className="rounded-lg p-2 text-navy-700 transition-colors hover:bg-navy-50"
                            aria-label={`Tambah ${item.product.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                          aria-label={`Hapus ${item.product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="w-full text-right sm:w-28">
                        <p className="text-xs text-navy-400">Subtotal</p>
                        <p className="font-display text-base font-extrabold text-navy-900">
                          {formatRupiah(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={100}>
                <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-md lg:sticky lg:top-24">
                  <h3 className="font-display text-lg font-bold text-navy-900">
                    Ringkasan Pesanan
                  </h3>
                  <p className="mt-1 text-xs text-navy-500">
                    {count} item dalam keranjang.
                  </p>

                  <div className="mt-5 space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="truncate text-navy-600">
                          {item.product.name}{' '}
                          <span className="font-semibold text-navy-400">
                            ×{item.quantity}
                          </span>
                        </span>
                        <span className="shrink-0 font-semibold text-navy-800">
                          {formatRupiah(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-dashed border-navy-200 pt-4">
                    <span className="font-display text-base font-bold text-navy-900">
                      Total
                    </span>
                    <span className="font-display text-xl font-extrabold text-royal-600">
                      {formatRupiah(total)}
                    </span>
                  </div>

                  {error && (
                    <p className="mt-4 flex items-start gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                      <ArrowRight className="mt-0.5 h-4 w-4 rotate-180 shrink-0" />
                      {error}
                    </p>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    className="mt-6 w-full"
                    onClick={goToCheckout}
                  >
                    <ClipboardList className="h-5 w-5" /> Lanjut ke Checkout
                  </Button>

                  <Link
                    to="/produk"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-navy-200 py-2.5 text-sm font-bold text-navy-700 transition-colors hover:border-royal-500 hover:text-royal-600"
                  >
                    <PackageSearch className="h-4 w-4" /> Tambah Produk Lain
                  </Link>

                  <div className="mt-4 flex items-center gap-2 rounded-2xl bg-navy-50 px-4 py-3 text-xs text-navy-500">
                    <SnowflakeIcon className="h-4 w-4 shrink-0 text-ice-400" />
                    Pengiriman via Gojek / ShopeeFood / kurir & pembayaran QRIS,
                    transfer, atau COD bisa dipilih di halaman checkout.
                  </div>
                </div>
              </Reveal>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage