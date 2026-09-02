import {
  HeartHandshake,
  Layers,
  Leaf,
  Wallet,
} from 'lucide-react'
import Reveal from '../shared/Reveal'
import SectionTitle from './SectionTitle'

const features = [
  {
    icon: HeartHandshake,
    title: 'Kenyamanan & Kebersihan',
    text: 'Produk beku disimpan higienis dan praktis untuk keluarga Anda.',
  },
  {
    icon: Wallet,
    title: 'Harga Terjangkau',
    text: 'Makanan beku berkualitas dengan harga yang ramah di kantong.',
  },
  {
    icon: Layers,
    title: 'Keragaman Produk',
    text: 'Beragam pilihan frozen food nugget, sosis, dan olahan siap masak.',
  },
  {
    icon: Leaf,
    title: 'Retensi Nutrisi',
    text: 'Proses beku menjaga gizi dan cita rasa tetap awet alami.',
  },
]

export function FeatureSection() {
  return (
    <section className="relative bg-navy-50 py-20 sm:py-24">
      <div className="container-site">
        <Reveal>
          <SectionTitle
            eyebrow="Keuntungan Kami"
            title="Toko Makanan Beku Terbaik"
            description="Putra Bengawan Frozen Food Store hadir untuk memenuhi kebutuhan frozen food keluarga Anda dengan kualitas dan layanan terbaik."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80} className="h-full">
              <div className="group flex h-full flex-col items-center rounded-[10px] bg-white p-8 text-center transition-shadow duration-500 hover:shadow-[0_0_45px_rgba(0,0,0,0.08)]">
                <div className="flex h-[100px] w-[100px] items-center justify-center rounded-[50px] bg-ice-400 transition-transform duration-500">
                  <f.icon className="h-12 w-12 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />
                </div>
                <h3 className="mt-6 font-display text-lg font-bold text-navy-950">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-navy-500">
                  {f.text}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-navy-400 transition-colors duration-500 group-hover:text-ice-400">
                  Selengkapnya
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
