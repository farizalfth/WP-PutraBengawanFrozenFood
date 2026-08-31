import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Store, UserRound, Wallet } from 'lucide-react'
import { Snowfall } from '../shared/Snowflakes'
import Reveal from '../shared/Reveal'
import { DefaultProductImage } from '../ui/ImageWithFallback'

const features = [
  {
    icon: BadgeCheck,
    title: 'Produk Berkualitas',
    text: 'Produk terjamin segar, halal dan higienis.',
  },
  {
    icon: Wallet,
    title: 'Harga Bersahabat',
    text: 'Harga terjangkau untuk semua kalangan.',
  },
  {
    icon: UserRound,
    title: 'Pelayanan Terbaik',
    text: 'Staf ramah siap membantu Anda.',
  },
]

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-16 text-white">
      <Snowfall count={10} />
      <div className="container-site relative grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
              <div className="relative aspect-[4/3] bg-navy-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Store className="h-24 w-24 text-navy-600" />
                </div>
                <DefaultProductImage className="absolute inset-0 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ice-400/20 text-ice-200">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Putra Bengawan</p>
                    <p className="text-xs text-navy-200">
                      Ps. Induk, Brebes, Jawa Tengah
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 rounded-2xl bg-white px-5 py-3 shadow-xl">
              <p className="font-display text-2xl font-extrabold text-navy-900">
                100%+
              </p>
              <p className="text-xs font-semibold text-navy-500">
                Produk Pilihan
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ice-300">
            Tentang Kami
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl md:text-4xl">
            Putra Bengawan
            <span className="block text-ice-200">Frozen Food</span>
          </h2>
          <p className="mt-4 leading-relaxed text-navy-200">
            Putra Bengawan Frozen Food adalah toko frozen food yang berlokasi di
            Brebes, Jawa Tengah. Kami menyediakan berbagai produk frozen food
            berkualitas dengan harga terjangkau untuk memenuhi kebutuhan
            keluarga Anda.
          </p>

          <div className="mt-7 space-y-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ice-400/20 text-ice-200">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{f.title}</p>
                    <p className="text-xs text-navy-300">{f.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Link
            to="/tentang-kami"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-navy-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Selengkapnya
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

export default AboutSection