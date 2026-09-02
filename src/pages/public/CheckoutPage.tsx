import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Bike,
  CheckCircle2,
  ClipboardList,
  HandCoins,
  Landmark,
  MapPin,
  MessageCircle,
  QrCode,
  ShoppingCart,
  Store,
  Truck,
  UserRound,
} from 'lucide-react'
import { formatRupiah } from '../../utils/format'
import { STORE_SETTINGS } from '../../utils/constants'
import { useCartStore } from '../../stores/cartStore'
import { useOrderStore } from '../../stores/orderStore'
import { createWebOrder } from '../../services/webOrders'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { Button } from '../../components/ui/Button'
import Reveal from '../../components/shared/Reveal'
import { Snowfall } from '../../components/shared/Snowflakes'
import { cn } from '../../lib/utils'
import type { DeliveryOption, PaymentMethod } from '../../types'

const deliveryOptions: {
  id: DeliveryOption
  label: string
  desc: string
  icon: typeof Store
}[] = [
  {
    id: 'pickup',
    label: 'Ambil di Toko',
    desc: 'Pasar Induk Kaumanpasar, Brebes',
    icon: Store,
  },
  {
    id: 'gojek',
    label: 'Dikirim Gojek / GoSend',
    desc: STORE_SETTINGS.gojek_url
      ? 'Pesan via link toko GoFood'
      : 'Anda bayar ongkir ke driver',
    icon: Bike,
  },
  {
    id: 'shopee',
    label: 'Dikirim ShopeeFood',
    desc: STORE_SETTINGS.shopee_url
      ? 'Pesan via link toko ShopeeFood'
      : 'Pengiriman via ShopeeFood',
    icon: Truck,
  },
  {
    id: 'courier',
    label: 'Kurir Lain / Ekspedisi',
    desc: 'JNE, J&T, atau kurir pilihan Anda',
    icon: Truck,
  },
]

const paymentOptions: {
  id: PaymentMethod
  label: string
  desc: string
  icon: typeof QrCode
}[] = [
  {
    id: 'qris',
    label: 'QR Code (QRIS)',
    desc: 'Scan QRIS lewat semua m-Banking / e-wallet',
    icon: QrCode,
  },
  {
    id: 'transfer',
    label: 'Transfer Bank',
    desc: `${STORE_SETTINGS.bank_name ?? 'Bank'} — bukti transfer via WA`,
    icon: Landmark,
  },
  {
    id: 'cash',
    label: 'Tunai / COD',
    desc: 'Bayar saat pengambilan atau saat kurir tiba',
    icon: Banknote,
  },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const customer = useCartStore((s) => s.customer)
  const clear = useCartStore((s) => s.clear)
  const createOrder = useOrderStore((s) => s.createOrder)

  const [name, setName] = useState(customer.name)
  const [phone, setPhone] = useState(customer.phone)
  const [address, setAddress] = useState(customer.address)
  const [titikLokasi, setTitikLokasi] = useState(customer.titikLokasi)
  const [notes, setNotes] = useState(customer.notes)
  const [delivery, setDelivery] = useState<DeliveryOption>(customer.delivery)
  const [payment, setPayment] = useState<PaymentMethod>('qris')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  if (count === 0 && !submitting) {
    return (
      <div className="bg-white">
        <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
          <Snowfall count={12} />
          <div className="container-site relative text-center">
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
              Checkout
            </h1>
          </div>
        </section>
        <div className="container-site py-16">
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-navy-200 bg-navy-50/40 px-6 py-12 text-center">
            <ShoppingCart className="h-10 w-10 text-neutral-400" />
            <p className="text-base font-semibold text-black">
              Keranjang masih kosong.
            </p>
            <p className="text-sm text-neutral-600">
              Tambahkan produk terlebih dahulu sebelum checkout.
            </p>
            <Link to="/produk" className="mt-2">
              <Button size="lg">Lihat Produk</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Nama wajib diisi.')
      return
    }
    if (!/^[0-9+\s-]{10,}$/.test(phone.replace(/\D/g, ''))) {
      setError('Nomor WhatsApp tidak valid.')
      return
    }
    if (delivery !== 'pickup' && !address.trim()) {
      setError('Alamat pengiriman wajib diisi.')
      return
    }
    setError(null)
    setSubmitting(true)

    const itemList = items.map((i) => ({
      product_id: i.product.id,
      name: i.product.name,
      quantity: i.quantity,
      price: i.product.price,
      subtotal: i.product.price * i.quantity,
    }))

    const created = createOrder({
      items: itemList,
      total,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      address: address.trim(),
      titik_lokasi: titikLokasi.trim(),
      notes: notes.trim(),
      delivery,
      payment,
    })

    void createWebOrder({
      order_number: created.number,
      customer_name: created.customer_name,
      customer_phone: created.customer_phone,
      address: created.address,
      titik_lokasi: created.titik_lokasi,
      notes: created.notes,
      delivery,
      payment,
      total_amount: total,
      items: itemList,
    })

    clear()
    navigate(`/pesanan/${created.id}`)
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,209,249,0.18),transparent_55%)]" />
        <Snowfall count={12} />
        <div className="container-site relative text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-ice-300">
            Checkout
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Selesaikan Pesanan
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-navy-200">
            Lengkapi data pemesan, pilih pengiriman & pembayaran, lalu kami
            proses.
          </p>
        </div>
      </section>

      <div className="container-site py-12">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid items-start gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Reveal>
                <SectionCard
                  icon={<UserRound className="h-5 w-5" />}
                  title="Data Pemesan"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-navy-900">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="cth: Siti Rahayu"
                        className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-navy-900">
                        No. WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="cth: 0812xxxxxxxx"
                        className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <label className="block text-sm font-semibold text-navy-900">
                      Alamat Pengiriman
                      {delivery !== 'pickup' && (
                        <span className="text-red-500"> *</span>
                      )}
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      disabled={delivery === 'pickup'}
                      placeholder={
                        delivery === 'pickup'
                          ? 'Tidak diperlukan jika ambil di toko.'
                          : 'cth: Jl. Sudirman No. 12, Brebes'
                      }
                      className="w-full resize-none rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100 disabled:cursor-not-allowed disabled:bg-navy-50"
                    />
                    {delivery === 'pickup' && (
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
                      value={titikLokasi}
                      onChange={(e) => setTitikLokasi(e.target.value)}
                      placeholder="cth: https://www.google.com/maps?q=-6.87,109.04"
                      className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
                    />
                    {titikLokasi && (
                      <a
                        href={titikLokasi}
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
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="cth: sertakan es batu / kertas pembungkus"
                      className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
                    />
                  </div>
                </SectionCard>
              </Reveal>

              <Reveal delay={60}>
                <SectionCard
                  icon={<Truck className="h-5 w-5" />}
                  title="Cara Pengiriman"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    {deliveryOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDelivery(opt.id)}
                        className={cn(
                          'flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors',
                          delivery === opt.id
                            ? 'border-royal-500 bg-royal-50'
                            : 'border-navy-200 hover:border-navy-400',
                        )}
                      >
                        <opt.icon
                          className={cn(
                            'mt-0.5 h-5 w-5 shrink-0',
                            delivery === opt.id
                              ? 'text-royal-600'
                              : 'text-navy-400',
                          )}
                        />
                        <span>
                          <span className="block text-sm font-bold text-navy-900">
                            {opt.label}
                          </span>
                          <span className="block text-xs text-navy-500">
                            {opt.desc}
                          </span>
                        </span>
                        {delivery === opt.id && (
                          <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-royal-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </SectionCard>
              </Reveal>

              <Reveal delay={120}>
                <SectionCard
                  icon={<HandCoins className="h-5 w-5" />}
                  title="Metode Pembayaran"
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    {paymentOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPayment(opt.id)}
                        className={cn(
                          'flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors',
                          payment === opt.id
                            ? 'border-royal-500 bg-royal-50'
                            : 'border-navy-200 hover:border-navy-400',
                        )}
                      >
                        <opt.icon
                          className={cn(
                            'h-6 w-6 shrink-0',
                            payment === opt.id
                              ? 'text-royal-600'
                              : 'text-navy-400',
                          )}
                        />
                        <span>
                          <span className="block text-sm font-bold text-navy-900">
                            {opt.label}
                          </span>
                          <span className="block text-xs text-navy-500">
                            {opt.desc}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>

                  {payment === 'transfer' && STORE_SETTINGS.bank_account && (
                    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-navy-50 px-4 py-3 text-sm">
                      <Landmark className="h-5 w-5 text-royal-600" />
                      <span className="font-semibold text-navy-800">
                        {STORE_SETTINGS.bank_name} •{' '}
                        {STORE_SETTINGS.bank_account}
                      </span>
                      <span className="text-navy-500">
                        a.n. {STORE_SETTINGS.bank_holder}
                      </span>
                    </div>
                  )}

                  {payment === 'qris' && (
                    <div className="mt-5 rounded-2xl border border-navy-200 bg-navy-50 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-royal-600">
                          <QrCode className="h-6 w-6" />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-navy-900">
                            Total yang harus dibayar via QRIS
                          </p>
                          <p className="font-display text-2xl font-extrabold text-royal-600">
                            {formatRupiah(total)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-start gap-2 border-t border-dashed border-navy-200 pt-3 text-sm text-navy-600">
                        <QrCode className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
                        {STORE_SETTINGS.qris_image_url
                          ? 'Kode QR sudah siap dan akan ditampilkan saat konfirmasi pesanan.'
                          : 'Scan QRIS via m-Banking / e-wallet sesuai nominal di atas, lalu kirim bukti bayar via WhatsApp.'}
                      </div>
                    </div>
                  )}
                </SectionCard>
              </Reveal>
            </div>

            <Reveal delay={80}>
              <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-md lg:sticky lg:top-24">
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Ringkasan Pesanan
                </h3>
                <p className="mt-1 text-xs text-navy-500">{count} item.</p>

                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-navy-50">
                        <ImageWithFallback
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy-800">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-navy-400">
                          {item.quantity} × {formatRupiah(item.product.price)}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-navy-900">
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
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-6 w-full"
                  loading={submitting}
                >
                  {submitting ? 'Membuat pesanan...' : (
                    <>
                      <ClipboardList className="h-5 w-5" /> Buat Pesanan
                    </>
                  )}
                </Button>

                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-navy-50 px-4 py-3 text-xs text-navy-500">
                  <MessageCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                  Kami konfirmasi via WhatsApp ke nomor yang Anda isi.
                </div>
              </div>
            </Reveal>
          </div>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/keranjang"
            className="inline-flex items-center gap-2 text-sm font-bold text-royal-600 transition-colors hover:text-royal-800"
          >
            <ArrowRight className="h-4 w-4 rotate-180" /> Kembali ke Keranjang
          </Link>
        </div>
      </div>
    </div>
  )
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ice-400 to-royal-500 text-white">
          {icon}
        </span>
        <h3 className="font-display text-lg font-bold text-navy-900">
          {title}
        </h3>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

export default CheckoutPage