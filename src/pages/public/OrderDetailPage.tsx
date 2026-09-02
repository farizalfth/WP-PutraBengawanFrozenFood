import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Banknote,
  Bike,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Home,
  Info,
  Landmark,
  MapPin,
  PackageCheck,
  QrCode,
  Store,
  Truck,
  UserRound,
} from 'lucide-react'
import { formatRupiah, formatDateTime } from '../../utils/format'
import { STORE_SETTINGS } from '../../utils/constants'
import { useOrderStore } from '../../stores/orderStore'
import { Button } from '../../components/ui/Button'
import { Snowfall } from '../../components/shared/Snowflakes'
import Reveal from '../../components/shared/Reveal'
import {
  confirmWebOrderPayment,
  getWebOrderByNumber,
} from '../../services/webOrders'
import { cn } from '../../lib/utils'
import type { DeliveryOption, PaymentMethod, WebOrder } from '../../types'

const deliveryLabels: Record<DeliveryOption, string> = {
  pickup: 'Ambil di Toko',
  gojek: 'Dikirim Gojek / GoSend',
  shopee: 'Dikirim ShopeeFood',
  courier: 'Kurir Lain / Ekspedisi',
}

const paymentLabels: Record<PaymentMethod, string> = {
  qris: 'QR Code (QRIS)',
  transfer: 'Transfer Bank',
  cash: 'Tunai / COD',
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const order = useOrderStore((s) => s.getOrder(id ?? ''))

  const [webOrder, setWebOrder] = useState<WebOrder | null>(null)
  const [proof, setProof] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)

  useEffect(() => {
    if (!order) return
    let active = true
    void (async () => {
      if (!webOrder) {
        const res = await getWebOrderByNumber(order.number)
        if (active && res.data) setWebOrder(res.data)
      }
    })()
    return () => {
      active = false
    }
  }, [order])

  const paid = Boolean(
    webOrder?.payment_confirmed_at || webOrder?.status !== 'pending',
  )

  const handleConfirmPayment = async () => {
    if (!order || !webOrder) return
    if (order.payment === 'transfer' && !proof.trim()) {
      setConfirmError('Isi bukti / detail transfer Anda terlebih dahulu.')
      return
    }
    setConfirming(true)
    setConfirmError(null)
    const res = await confirmWebOrderPayment(webOrder.id, proof.trim())
    setConfirming(false)
    if (res.error) {
      setConfirmError(res.error)
      return
    }
    setWebOrder({ ...webOrder, payment_confirmed_at: new Date().toISOString(), status: 'accepted', payment_proof: proof.trim() || null })
  }

  if (!order) {
    return (
      <div className="bg-white">
        <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
          <Snowfall count={12} />
          <div className="container-site relative text-center">
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
              Pesanan
            </h1>
          </div>
        </section>
        <div className="container-site flex flex-col items-center gap-3 py-16 text-center">
          <PackageCheck className="h-12 w-12 text-neutral-400" />
          <p className="text-base font-semibold text-black">
            Pesanan tidak ditemukan.
          </p>
          <Link to="/produk">
            <Button size="lg">
              Lihat Produk <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,209,249,0.18),transparent_55%)]" />
        <Snowfall count={12} />
        <div className="container-site relative text-center">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-extrabold sm:text-4xl">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-navy-200">
            Terima kasih, {order.customer_name}. Pesanan Anda kerimkan
            aladmin toko untuk diproses & dikonfirmasi.
          </p>
        </div>
      </section>

      <div className="container-site py-12">
        <div className="grid items-start gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Reveal>
              <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-navy-400">
                      No. Pesanan
                    </p>
                    <p className="font-display text-lg font-extrabold text-navy-900">
                      {order.number}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold',
                      paid
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800',
                    )}
                  >
                    {paid ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Pembayaran Dikonfirmasi
                      </>
                    ) : (
                      <>
                        <Clock className="h-3.5 w-3.5" /> Menunggu Pembayaran
                      </>
                    )}
                  </span>
                </div>
                <p className="mt-4 flex items-center gap-1.5 text-sm text-navy-500">
                  <ClipboardList className="h-4 w-4 text-ice-500" />
                  Dibuat {formatDateTime(order.created_at)}
                </p>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
                  <Info className="h-5 w-5 text-ice-500" /> Detail Pesanan
                </h3>
                <div className="mt-4 divide-y divide-navy-100">
                  {order.items.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <span className="text-sm font-semibold text-navy-800">
                        {item.name}{' '}
                        <span className="font-medium text-navy-400">
                          ×{item.quantity}
                        </span>
                      </span>
                      <span className="text-sm font-bold text-navy-900">
                        {formatRupiah(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-dashed border-navy-200 pt-4">
                  <span className="font-display text-base font-bold text-navy-900">
                    Total
                  </span>
                  <span className="font-display text-xl font-extrabold text-royal-600">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy-900">
                    <UserRound className="h-5 w-5 text-ice-500" /> Data Pemesan
                  </h3>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                        Nama
                      </dt>
                      <dd className="font-semibold text-navy-800">
                        {order.customer_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                        WhatsApp
                      </dt>
                      <dd className="font-semibold text-navy-800">
                        {order.customer_phone}
                      </dd>
                    </div>
                    {order.address && (
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                          Alamat
                        </dt>
                        <dd className="flex items-start gap-1.5 text-navy-600">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ice-500" />
                          {order.address}
                        </dd>
                      </div>
                    )}
                    {order.titik_lokasi && (
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                          Titik Lokasi
                        </dt>
                        <dd className="flex items-start gap-1.5 text-navy-600">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ice-500" />
                          <a
                            href={order.titik_lokasi}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-royal-600 hover:text-royal-800"
                          >
                            {order.titik_lokasi}
                          </a>
                        </dd>
                      </div>
                    )}
                    {order.notes && (
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                          Catatan
                        </dt>
                        <dd className="text-navy-600">{order.notes}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 font-display text-base font-bold text-navy-900">
                    <Truck className="h-5 w-5 text-ice-500" /> Pengiriman &
                    Pembayaran
                  </h3>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                        Pengiriman
                      </dt>
                      <dd className="flex items-center gap-1.5 font-semibold text-navy-800">
                        <DeliveryIcon delivery={order.delivery} />
                        {deliveryLabels[order.delivery]}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                        Pembayaran
                      </dt>
                      <dd className="flex items-center gap-1.5 font-semibold text-navy-800">
                        <PaymentIcon payment={order.payment} />
                        {paymentLabels[order.payment]}
                      </dd>
                    </div>
                  </dl>

                  {order.delivery === 'gojek' &&
                    STORE_SETTINGS.gojek_url && (
                      <a
                        href={STORE_SETTINGS.gojek_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00AA13] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                      >
                        <Bike className="h-4 w-4" /> Pesan via GoFood
                      </a>
                    )}

                  {order.delivery === 'shopee' &&
                    STORE_SETTINGS.shopee_url && (
                      <a
                        href={STORE_SETTINGS.shopee_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#EE4D2D] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                      >
                        <Truck className="h-4 w-4" /> Pesan via ShopeeFood
                      </a>
                    )}
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <PaymentInstructions
                payment={order.payment}
                total={order.total}
              />
            </Reveal>

            {webOrder && (
              <Reveal delay={220}>
                <PaymentConfirmationCard
                  payment={order.payment}
                  total={order.total}
                  paid={paid}
                  confirming={confirming}
                  error={confirmError}
                  proof={proof}
                  onProofChange={setProof}
                  onConfirm={handleConfirmPayment}
                />
              </Reveal>
            )}
          </div>

          <Reveal delay={80}>
            <div className="rounded-3xl bg-gradient-to-br from-navy-800 to-royal-950 p-6 text-white shadow-xl lg:sticky lg:top-24">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Langkah Berikutnya
              </h3>
              <ol className="mt-4 space-y-4 text-sm text-navy-200">
                <Step n={1}>
                  Pesanan Anda kerimkan aladmin toko untuk diproses.
                </Step>
                <Step n={2}>
                  Staff kami berkontakt via WhatsApp dengan total & petunjuk
                  pembayaran yang Anda pilih.
                </Step>
                <Step n={3}>
                  Setelah pembayaran terverifikasi, pesanan segera kami
                  kemas beku & kirim.
                </Step>
              </ol>
              <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-xs text-navy-200">
                Simpan nomor pesanan{' '}
                <span className="font-bold text-white">{order.number}</span>{' '}
                untuk memudahkan pengecekan.
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 rounded-full bg-royal-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-ice-400 hover:text-navy-950 hover:scale-[1.02]"
          >
            <Home className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ice-400 text-xs font-bold text-navy-950">
        {n}
      </span>
      <span className="pt-0.5">{children}</span>
    </li>
  )
}

function DeliveryIcon({ delivery }: { delivery: DeliveryOption }) {
  const Icon = { pickup: Store, gojek: Bike, shopee: Truck, courier: Truck }[
    delivery
  ]
  return <Icon className="h-4 w-4 text-ice-500" />
}

function PaymentIcon({ payment }: { payment: PaymentMethod }) {
  const Icon = { qris: QrCode, transfer: Landmark, cash: Banknote }[payment]
  return <Icon className="h-4 w-4 text-ice-500" />
}

function PaymentConfirmationCard({
  payment,
  total,
  paid,
  confirming,
  error,
  proof,
  onProofChange,
  onConfirm,
}: {
  payment: PaymentMethod
  total: number
  paid: boolean
  confirming: boolean
  error: string | null
  proof: string
  onProofChange: (v: string) => void
  onConfirm: () => void
}) {
  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        Konfirmasi Pembayaran
      </h3>

      {paid ? (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          Terima kasih! Konfirmasi pembayaran Anda sudah kami terima.
          Pesanan akan segera kami proses & kirim.
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm text-navy-600">
            Sudah melakukan pembayaran{' '}
            <b className="text-navy-900">{formatRupiah(total)}</b> via{' '}
            <b className="text-navy-900">
              {payment === 'transfer'
                ? 'Transfer Bank'
                : payment === 'qris'
                  ? 'QRIS'
                  : 'Tunai / COD'}
            </b>
            ?
            {payment === 'cash' ? (
              <>
                {' '}
                Klik tombol di bawah setelah Anda membayar tunai.
              </>
            ) : (
              <>
                {' '}
                Isi bukti/detail transfer, lalu klik konfirmasi agar admin
                langsung memproses pesanan Anda.
              </>
            )}
          </p>

          {payment !== 'cash' && (
            <textarea
              value={proof}
              onChange={(e) => onProofChange(e.target.value)}
              rows={2}
              placeholder="cth: Transfer BCA a.n. Joko, no. ref 9238471 / screenshot link"
              className="mt-4 w-full resize-none rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
            />
          )}

          {error && (
            <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <Button
            type="button"
            variant="primary"
            className="mt-4"
            onClick={onConfirm}
            loading={confirming}
          >
            {confirming ? 'Mengirim...' : (
              <>
                <Check className="h-4 w-4" /> Saya Sudah Bayar
              </>
            )}
          </Button>
        </>
      )}
    </div>
  )
}

function PaymentInstructions({
  payment,
  total,
}: {
  payment: PaymentMethod
  total: number
}) {
  if (payment === 'transfer') {
    return (
      <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
          <Landmark className="h-5 w-5 text-ice-500" /> Pembayaran Transfer Bank
        </h3>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-2xl bg-navy-50 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
              Bank
            </p>
            <p className="mt-1 font-display text-lg font-extrabold text-navy-900">
              {STORE_SETTINGS.bank_name ?? '-'}
            </p>
          </div>
          <div className="rounded-2xl bg-navy-50 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
              No. Rekening
            </p>
            <p className="mt-1 font-display text-lg font-extrabold text-navy-900">
              {STORE_SETTINGS.bank_account ?? '-'}
            </p>
          </div>
          <div className="rounded-2xl bg-navy-50 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
              A.n.
            </p>
            <p className="mt-1 font-display text-lg font-extrabold text-navy-900">
              {STORE_SETTINGS.bank_holder ?? '-'}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-ice-50 px-4 py-3 text-sm text-navy-700">
          <Info className="h-4 w-4 shrink-0 text-ice-500" />
          Transfer sebesar <b>{formatRupiah(total)}</b>, lalu kirim bukti
          transfer via WhatsApp untuk verifikasi.
        </div>
      </div>
    )
  }

  if (payment === 'qris') {
    return (
      <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
          <QrCode className="h-5 w-5 text-ice-500" /> Pembayaran QRIS
        </h3>
        {STORE_SETTINGS.qris_image_url ? (
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center">
            <img
              src={STORE_SETTINGS.qris_image_url}
              alt="QRIS Putra Bengawan Frozen Food"
              className="h-56 w-56 rounded-2xl border border-navy-100 bg-white object-contain shadow-sm"
            />
            <div className="max-w-xs text-sm text-navy-600">
              <p className="flex items-start gap-1.5">
                <QrCode className="mt-0.5 h-4 w-4 shrink-0 text-ice-500" />
                Scan kode QRIS di atas menggunakan m-Banking atau e-wallet
                Anda.
              </p>
              <p className="mt-2 font-semibold text-navy-800">
                Total bayar: {formatRupiah(total)}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-ice-50 px-4 py-3 text-sm text-navy-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-ice-500" />
            Kode QRIS akan dikirimkan via WhatsApp saat konfirmasi pesanan.
            Bayar sebesar <b>{formatRupiah(total)}</b> dan kirim bukti bayar.
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
        <Banknote className="h-5 w-5 text-ice-500" /> Bayar Tunai / COD
      </h3>
      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-ice-50 px-4 py-3 text-sm text-navy-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ice-500" />
        Siapkan <b>{formatRupiah(total)}</b> untuk dibayarkan saat pengambilan
        di toko atau saat kurir tiba.
      </div>
    </div>
  )
}