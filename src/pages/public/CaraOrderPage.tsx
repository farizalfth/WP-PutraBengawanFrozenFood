import { Link } from 'react-router-dom'
import {
  Banknote,
  CreditCard,
  Landmark,
  MessageCircle,
  QrCode,
  Package,
  ScanSearch,
  ShoppingCart,
  Truck,
  Upload,
  UserRound,
} from 'lucide-react'
import Reveal from '../../components/shared/Reveal'
import SectionTitle from '../../components/public/SectionTitle'
import { Snowfall } from '../../components/shared/Snowflakes'
import { waLink } from '../../utils/constants'
import { cn } from '../../lib/utils'

const steps = [
  {
    icon: ScanSearch,
    step: '01',
    title: 'Pilih Produk',
    text: 'Jelajahi katalog di halaman Produk, lihat detail & harga, lalu masukkan pilihan Anda ke keranjang.',
  },
  {
    icon: UserRound,
    step: '02',
    title: 'Isi Data Pemesan',
    text: 'Di halaman Keranjang lengkapi nama, no. WhatsApp, alamat, dan titik lokasi (real via Google Maps).',
  },
  {
    icon: ShoppingCart,
    step: '03',
    title: 'Checkout Online',
    text: 'Lanjut ke Checkout, pilih cara pengiriman (ambil di toko, Gojek, ShopeeFood, atau kurir) dan metode pembayaran.',
  },
  {
    icon: CreditCard,
    step: '04',
    title: 'Lakukan Pembayaran',
    text: 'Bayar sesuai total via QRIS, transfer bank (BCA), atau tunai/COD saat pengambilan.',
  },
  {
    icon: Upload,
    step: '05',
    title: 'Kirim Bukti Bayar',
    text: 'Di halaman pesanan, isi bukti transfer lalu klik "Saya Sudah Bayar". Admin akan mengonfirmasi pesanan Anda.',
  },
  {
    icon: Package,
    step: '06',
    title: 'Pesanan Dikirim',
    text: 'Pesanan dikemas dengan styrofoam beku lalu dikirim ke lokasi Anda, atau siap diambil di toko.',
  },
]

const pembayaran = [
  {
    icon: QrCode,
    title: 'QRIS',
    text: 'Scan via m-Banking / e-wallet sesuai total.',
  },
  {
    icon: Landmark,
    title: 'Transfer Bank',
    text: 'BCA — kirim bukti di form pesanan.',
  },
  {
    icon: Banknote,
    title: 'Tunai / COD',
    text: 'Bayar saat pengambilan atau kurir tiba.',
  },
]

export function CaraOrderPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,209,249,0.18),transparent_55%)]" />
        <Snowfall count={12} />
        <div className="container-site relative text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-ice-300">
            Panduan
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Cara Order
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-navy-200">
            Pesan frozen food langsung dari website. Ikuti enam langkah berikut
            &amp; kami proses pesanan Anda.
          </p>
        </div>
      </section>

      <div className="container-site py-14">
        <Reveal>
          <SectionTitle
            eyebrow="Langkah"
            title="6 Langkah Mudah"
            description="Ikuti langkah berikut untuk memesan produk frozen food."
          />
        </Reveal>

        <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 70}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-ice-400/60">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ice-400 to-royal-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute -right-2 -top-2 flex h-20 w-20 items-end justify-end rounded-bl-[40px] bg-navy-50 pb-2 pr-3">
                  <span className="bg-gradient-to-br from-ice-400 to-royal-500 bg-clip-text font-display text-4xl font-black text-transparent">
                    {s.step}
                  </span>
                </div>

                <div className="relative max-w-[85%]">
                  <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-ice-400 to-royal-500 text-white shadow-lg shadow-ice-400/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-navy-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">
                    {s.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-navy-100 bg-navy-50/40 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-royal-600 text-white">
                  <CreditCard className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Metode Pembayaran
                </h3>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {pembayaran.map((p) => (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-navy-100 bg-white p-4 text-center shadow-sm"
                  >
                    <p.icon className="mx-auto h-6 w-6 text-ice-500" />
                    <p className="mt-2 text-sm font-bold text-navy-900">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-xs text-navy-500">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex h-full flex-col justify-between rounded-3xl bg-gradient-to-br from-navy-800 to-royal-950 p-6 text-white shadow-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ice-400 text-navy-950">
                  <UserRound className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-bold">
                  Butuh bantuan?
                </h3>
              </div>
              <p className="mt-3 text-sm text-navy-200">
                Tim kami siap membantu Anda memilih produk dan memproses
                pesanan. Jangan ragu untuk menghubungi kami.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={waLink(
                    'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang cara order.',
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90',
                  )}
                >
                  <MessageCircle className="h-4 w-4" /> Chat WhatsApp
                </a>
                <Link
                  to="/produk"
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-navy-900 transition-opacity hover:opacity-90',
                  )}
                >
                  <Truck className="h-4 w-4" /> Lihat Produk
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-xs text-navy-100">
                <Package className="h-4 w-4 shrink-0 text-ice-300" />
                Pengiriman kemasan styrofoam beku ke Brebes &amp; sekitarnya.
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}

export default CaraOrderPage
