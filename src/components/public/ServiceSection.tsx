import { Beef, Croissant, Dumbbell, Fish, Pizza, Snowflake, Soup } from 'lucide-react'
import Reveal from '../shared/Reveal'
import SectionTitle from './SectionTitle'
import { DefaultProductImage } from '../ui/ImageWithFallback'

interface ServiceItem {
  icon: typeof Beef
  title: string
  text: string
}

const leftServices: ServiceItem[] = [
  {
    icon: Beef,
    title: 'Daging & Sapi',
    text: 'Daging segar pilihan yang dibekukan tanpa kehilangan kualitas.',
  },
  {
    icon: Fish,
    title: 'Ikan & Seafood',
    text: 'Beragam pilihan ikan dan seafood beku yang higienis.',
  },
  {
    icon: Croissant,
    title: 'Olahan Roti & Pastry',
    text: 'Roti, pastry dan kue beku siap saji untuk kebutuhan Anda.',
  },
]

const rightServices: ServiceItem[] = [
  {
    icon: Pizza,
    title: 'Nugget & Olahan',
    text: 'Nugget, sosis dan bakso beku favorit keluarga.',
  },
  {
    icon: Soup,
    title: 'Frozen Sayur',
    text: 'Sayuran beku praktis yang menjaga nutrisi dan kesegaran.',
  },
  {
    icon: Dumbbell,
    title: 'Pesanan Custom',
    text: 'Bantu kami antar pesanan grosir untuk usaha Anda.',
  },
]

function ServiceItem({ s, side }: { s: ServiceItem; side: 'left' | 'right' }) {
  const isLeft = side === 'left'
  return (
    <div className="group service-item relative mb-4 overflow-hidden rounded-[10px] bg-white p-5 shadow-[0_0_45px_rgba(0,0,0,0.07)]">
      <span className="absolute inset-x-0 bottom-0 h-0 w-full rounded-[10px] bg-ice-400 transition-all duration-500 group-hover:h-full" />
      <div className={`relative z-10 flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'} ${isLeft ? 'pr-4' : 'pl-4'}`}>
          <p className="mb-2 font-display text-base font-bold text-navy-950 transition-colors duration-500 group-hover:text-navy-950">
            {s.title}
          </p>
          <p className="mb-0 text-sm leading-relaxed text-navy-500 transition-colors duration-500 group-hover:text-white">
            {s.text}
          </p>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[50px] bg-ice-400 transition-all duration-500 group-hover:bg-white">
          <s.icon className="h-7 w-7 text-white transition-transform duration-500 group-hover:rotate-[360deg] group-hover:text-ice-400" />
        </div>
      </div>
    </div>
  )
}

export function ServiceSection() {
  return (
    <section className="relative overflow-hidden bg-navy-50/60 py-20 sm:py-24">
      <div className="container-site">
        <Reveal>
          <SectionTitle
            eyebrow="Layanan Kami"
            title="Lindungi Keluarga dengan Frozen Food Terbaik"
            description="Beragam layanan dan pilihan produk untuk memenuhi kebutuhan harian keluarga Anda."
          />
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-3">
          <div>
            {leftServices.map((s) => (
              <Reveal key={s.title}>
                <ServiceItem s={s} side="left" />
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <div className="relative mx-auto aspect-square max-w-xs overflow-hidden rounded-[10px] border border-navy-100 shadow-2xl lg:max-w-full">
              <div className="absolute inset-0">
                <Snowflake className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 text-ice-200" />
                <DefaultProductImage className="absolute inset-0 opacity-80" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/40" />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-royal-600 px-5 py-2 text-xs font-bold text-white">
                Putra Bengawan Frozen Food
              </span>
            </div>
          </Reveal>

          <div>
            {rightServices.map((s) => (
              <Reveal key={s.title}>
                <ServiceItem s={s} side="right" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceSection
