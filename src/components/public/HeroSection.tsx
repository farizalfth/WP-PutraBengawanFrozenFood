import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  MessageCircle,
  PackageSearch,
  Zap,
} from 'lucide-react'
import { Snowfall, SnowflakeIcon } from '../shared/Snowflakes'
import { waLink } from '../../utils/constants'

const heroFacts = [
  {
    icon: BadgeCheck,
    title: 'Bahan Berkualitas',
    text: 'Pilihan bahan segar & higienis',
  },
  {
    icon: PackageSearch,
    title: 'Higienis & Halal',
    text: 'Terjamin kebersihan prosesnya',
  },
  {
    icon: Zap,
    title: 'Praktis & Lezat',
    text: 'Siap saji untuk keluarga',
  },
]

function DefaultVisual({ type }: { type: number }) {
  return (
    <span aria-hidden="true" className="text-lg font-black leading-none">
      {type === 0 ? '\u25a0' : type === 1 ? '\u25cf' : '\u25c8'}
    </span>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-royal-800 text-white">
      <Snowfall count={18} />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-ice-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-navy-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-site relative grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-14">
        <div className="animate-fade-in-up max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-ice-200 backdrop-blur">
            <SnowflakeIcon className="h-4 w-4" />
            Frozen Food Brebes
          </p>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            PUTRA BENGAWAN
            <span className="mt-1 block bg-gradient-to-r from-ice-200 to-white bg-clip-text text-transparent">
              FROZEN FOOD
            </span>
          </h1>
          <p className="mt-4 font-display text-lg font-semibold text-ice-100 sm:text-xl">
            Kualitas Terbaik, Harga Bersahabat
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-200 sm:text-base">
            Menyediakan berbagai macam Frozen Food praktis, enak dan higienis
            untuk keluarga Anda.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/produk"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-navy-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Lihat Produk
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={waLink(
                'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk Anda.',
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-all hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" />
              Hubungi Kami
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {heroFacts.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ice-400/20 text-ice-200">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">{f.title}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-navy-300">
                    {f.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in-up relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="animate-float-slow relative">
            <div className="overflow-hidden rounded-3xl border border-white/20 bg-white p-4 shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-ice-100 via-white to-navy-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <SnowflakeIcon className="h-40 w-40 animate-spin-slow text-navy-100" style={{ animation: 'spin-snow 30s linear infinite' }} />
              </div>
              <div className="absolute inset-0 grid grid-cols-3 gap-4 p-8">
                {['Nugget', 'Sosis', 'Bakso'].map((label, idx) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-navy-100 bg-white/80 shadow-sm backdrop-blur"
                    style={{ transform: `translateY(${idx * 14}px)` }}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-600'
                          : idx === 1
                            ? 'bg-red-100 text-red-500'
                            : 'bg-teal-100 text-teal-600'
                      }`}
                    >
                      <DefaultVisual type={idx} />
                    </span>
                    <p className="text-[10px] font-bold text-navy-800">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/35 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy-800 backdrop-blur">
                Segar &amp; Higienis
              </span>
            </div>

              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 rounded-xl bg-navy-50 px-2 py-2.5"
                  >
                    <SnowflakeIcon className="h-4 w-4 text-navy-400" />
                    <p className="text-[10px] font-semibold leading-tight text-navy-700">
                      {['Penyimpanan','Beku Optimal','Berbagai Varian'][i]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-float-slow absolute -left-4 -top-4 rounded-2xl bg-white p-3 shadow-xl" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <BadgeCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-navy-900">Halal</p>
                  <p className="text-[9px] text-navy-400">Terjamin</p>
                </div>
              </div>
            </div>

            <div className="animate-float-slow absolute -bottom-4 -right-3 rounded-2xl bg-white p-3 shadow-xl" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ice-100 text-navy-600">
                  <Zap className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-navy-900">Harga</p>
                  <p className="text-[9px] text-navy-400">Bersahabat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection