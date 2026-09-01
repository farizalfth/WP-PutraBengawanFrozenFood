import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  Package,
  Search,
  ShoppingCart,
  MessageSquareText,
} from 'lucide-react'
import Reveal from '../../components/shared/Reveal'
import SectionTitle from '../../components/public/SectionTitle'
import { Snowfall } from '../../components/shared/Snowflakes'
import { waLink } from '../../utils/constants'

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Pilih Produk',
    text: 'Jelajahi katalog produk kami di halaman Produk. Anda bisa melihat detail, harga, dan stok produk.',
  },
  {
    icon: MessageSquareText,
    step: '02',
    title: 'Hubungi Kami',
    text: 'Hubungi kami melalui WhatsApp untuk konfirmasi ketersediaan, jumlah, dan stok produk pilihan Anda.',
  },
  {
    icon: ShoppingCart,
    step: '03',
    title: 'Konfirmasi Pesanan',
    text: 'Sebutkan nama produk, jumlah, dan tujuan pengiriman. Kami akan menghitungkan total harga pesanan Anda.',
  },
  {
    icon: ClipboardList,
    step: '04',
    title: 'Pembayaran',
    text: 'Lakukan pembayaran via transfer bank atau tunai. Bukti transfer dikirim melalui WhatsApp.',
  },
  {
    icon: Package,
    step: '05',
    title: 'Pesanan Dikirim',
    text: 'Pesanan Anda kami kemas dengan styrofoam beku dan dikirim ke lokasi Anda di Brebes dan sekitarnya.',
  },
  {
    icon: CheckCircle2,
    step: '06',
    title: 'Pesanan Diterima',
    text: 'Pesanan tiba dengan aman dan tetap beku. Nikmati frozen food praktis kapan saja!',
  },
]

const pembayaran = [
  'Tunai (saat pengambilan di toko)',
  'Transfer Bank (BCA / BRI)',
  'WhatsApp konfirmasi pembayaran',
]

export function CaraOrderPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,209,249,0.15),transparent_55%)]" />
        <Snowfall count={12} />
        <div className="container-site relative">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-ice-300">
            Panduan
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Cara Order
          </h1>
          <p className="mt-3 max-w-xl text-sm text-navy-200">
            Mudah memesan frozen food di Putra Bengawan Frozen Food.
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

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 70}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-md">
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ice-400 transition-transform duration-500 group-hover:scale-y-100" />
                <span className="absolute right-5 top-4 font-display text-4xl font-extrabold text-navy-100 transition-colors duration-500 group-hover:text-white/60">
                  {s.step}
                </span>
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ice-400 text-navy-950 transition-transform duration-500 group-hover:rotate-[360deg]">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy-900 transition-colors duration-500 group-hover:text-navy-950">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500 transition-colors duration-500 group-hover:text-navy-800">
                    {s.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-navy-100 bg-navy-50/40 p-6">
              <h3 className="font-display text-lg font-bold text-navy-900">
                Metode Pembayaran
              </h3>
              <ul className="mt-4 space-y-2.5">
                {pembayaran.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-navy-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-navy-100 bg-navy-800 p-6 text-white">
              <div>
                <h3 className="font-display text-lg font-bold">
                  Butuh bantuan?
                </h3>
                <p className="mt-2 text-sm text-navy-200">
                  Tim kami siap membantu Anda memilih produk dan memproses
                  pesanan. Jangan ragu untuk menghubungi kami.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={waLink(
                    'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang cara order.',
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" /> Chat WhatsApp
                </a>
                <Link
                  to="/produk"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-navy-900 transition-opacity hover:opacity-90"
                >
                  Lihat Produk
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}

export default CaraOrderPage