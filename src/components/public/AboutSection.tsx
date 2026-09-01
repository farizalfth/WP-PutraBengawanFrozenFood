import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Store, Wallet } from 'lucide-react'
import Reveal from '../shared/Reveal'
import { DefaultProductImage } from '../ui/ImageWithFallback'

const features = [
  {
    icon: BadgeCheck,
    title: 'Produk Berkualitas',
    text: 'Produk terjamin segar, halal dan higienis untuk keluarga Anda.',
  },
  {
    icon: Wallet,
    title: 'Harga Bersahabat',
    text: 'Harga terjangkau untuk semua kalangan masyarakat.',
  },
]

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="container-site grid items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <div className="about-img relative mb-8 ml-8">
            <div className="absolute -top-8 right-0 h-2.5 w-full rounded-[10px] bg-royal-600" />
            <div className="absolute -left-8 bottom-8 top-0 w-2.5 rounded-[10px] bg-royal-600" />
            <div className="overflow-hidden rounded-[10px] shadow-2xl">
              <div className="relative aspect-[4/3] bg-navy-50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Store className="h-28 w-28 text-royal-200" />
                </div>
                <DefaultProductImage className="absolute inset-0 opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-950/50 to-transparent" />
              </div>
            </div>
            <div className="absolute -left-8 -top-8 rounded-[10px] border border-royal-600 bg-royal-600 px-6 py-6 text-white shadow-xl">
              <p className="font-display text-2xl font-bold leading-tight">
                Toko
                <br />
                Terpercaya
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-ice-400">
            Tentang Kami
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold capitalize leading-tight sm:text-4xl md:text-[2.6rem]">
            Kami Menyediakan Frozen Food Berkualitas Terbaik.
          </h2>
          <p className="mt-4 leading-relaxed text-navy-500">
            Putra Bengawan Frozen Food adalah toko frozen food yang berlokasi
            di Brebes, Jawa Tengah. Kami menyediakan berbagai produk frozen
            food berkualitas dengan harga terjangkau untuk memenuhi kebutuhan
            keluarga Anda.
          </p>

          <div className="mt-7 space-y-4">
            {features.map((f) => (
              <Reveal key={f.title}>
                <div className="flex items-center gap-5 rounded-[10px] bg-navy-50 p-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ice-400 text-white">
                    <f.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-navy-950">
                      {f.title}
                    </p>
                    <p className="text-sm text-navy-500">{f.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Link
            to="/tentang-kami"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-royal-600 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-ice-400 hover:text-navy-950"
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
