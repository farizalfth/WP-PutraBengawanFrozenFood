import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChefHat,
  MessageCircle,
  Snowflake,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react'
import { SnowflakeIcon } from '../shared/Snowflakes'
import { waLink } from '../../utils/constants'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="hero-snow-pattern"
              x="0"
              y="0"
              width="56"
              height="56"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="12" cy="12" r="1.5" fill="#fff" />
              <circle cx="40" cy="36" r="1" fill="#fff" />
              <circle cx="28" cy="52" r="1.5" fill="#fff" />
              <circle cx="50" cy="10" r="1" fill="#fff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-snow-pattern)" />
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,209,249,0.14),transparent_55%)]" />

        <div className="pointer-events-none absolute -right-10 top-24 opacity-20">
          <SnowflakeIcon
            className="h-56 w-56 text-ice-300"
            style={{ animation: 'spin-snow 40s linear infinite' }}
          />
        </div>
        <div className="pointer-events-none absolute -left-8 bottom-16 opacity-10">
          <SnowflakeIcon
            className="h-40 w-40 text-ice-300"
            style={{ animation: 'spin-snow 50s linear infinite' }}
          />
        </div>
      </div>

      <div className="container-site relative grid min-h-[92vh] items-center gap-14 py-24 lg:grid-cols-2">
        <div className="max-w-2xl">
          <p
            className="animate-fade-in-up inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.28em] text-ice-300"
            style={{ animationDelay: '0.2s' }}
          >
            <SnowflakeIcon className="h-5 w-5" />
            Frozen Food Brebes
          </p>

          <h1
            className="animate-fade-in-up mt-6 font-display text-4xl font-extrabold capitalize leading-[1.1] sm:text-5xl lg:text-[3.6rem]"
            style={{ animationDelay: '0.35s' }}
          >
            Selamat Datang di{' '}
            <span className="text-ice-300">Putra Bengawan</span> Frozen Food
          </h1>

          <p
            className="animate-fade-in-up mt-4 max-w-xl text-sm font-medium leading-relaxed text-navy-200 sm:text-base"
            style={{ animationDelay: '0.5s' }}
          >
            Menyediakan berbagai macam Frozen Food praktis, enak dan higienis
            untuk keluarga Anda. Kualitas terbaik dengan harga yang
            bersahabat.
          </p>

          <div
            className="animate-fade-in-up mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '0.65s' }}
          >
            <Link
              to="/produk"
              className="inline-flex items-center gap-2 rounded-full bg-ice-400 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-ice-400/25 transition-colors hover:bg-royal-600"
            >
              Order Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={waLink(
                'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk Anda.',
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-royal-600 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-ice-400"
            >
              <MessageCircle className="h-4 w-4" />
              Hubungi Kami
            </a>
          </div>

          <div
            className="animate-fade-in-up mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-dotted border-white/15 pt-7"
            style={{ animationDelay: '0.8s' }}
          >
            {[
              { icon: Snowflake, label: '100%+', sub: 'Varian Produk' },
              { icon: Snowflake, label: 'Halal', sub: 'Terjamin' },
              { icon: Snowflake, label: 'Beku', sub: 'Optimal' },
            ].map((f) => (
              <div key={f.sub} className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ice-400 text-navy-950">
                  <f.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-xl font-extrabold text-white">
                    {f.label}
                  </span>
                  <span className="block text-xs uppercase tracking-widest text-navy-300">
                    {f.sub}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <div
            className="animate-fade-in-up absolute h-[26rem] w-[26rem] rounded-full bg-ice-400/25 blur-3xl"
            style={{ animationDelay: '0.5s' }}
            aria-hidden="true"
          />

          <div
            className="animate-fade-in-up animate-hero-float relative"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="relative flex h-[26rem] w-[26rem] items-center justify-center rounded-full border-2 border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-6 rounded-full border border-dashed border-ice-400/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <SnowflakeIcon
                  className="h-64 w-64 text-ice-300/70"
                  style={{ animation: 'spin-snow 45s linear infinite' }}
                />
              </div>

              <div className="relative flex h-48 w-48 flex-col items-center justify-center rounded-full bg-gradient-to-br from-ice-400 to-royal-600 shadow-2xl shadow-ice-400/40">
                <UtensilsCrossed className="h-14 w-14 text-white" />
                <span className="mt-3 font-display text-lg font-extrabold tracking-wide text-white">
                  Frozen Food
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Brebes
                </span>
              </div>

              <div className="absolute -left-10 top-14 rounded-2xl bg-white/[0.06] px-5 py-4 text-center shadow-xl backdrop-blur">
                <p className="font-display text-2xl font-extrabold text-ice-300">
                  100%+
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
                  Varian Produk
                </p>
              </div>

              <div className="absolute -right-8 top-20 rounded-2xl bg-white/[0.06] px-5 py-4 text-center shadow-xl backdrop-blur">
                <ChefHat className="mx-auto mb-1 h-6 w-6 text-ice-300" />
                <p className="text-xs font-bold text-white">Higienis</p>
                <p className="text-[10px] uppercase tracking-widest text-white/60">
                  Terjamin
                </p>
              </div>
            </div>

            <div className="animate-hero-float-delayed absolute -bottom-6 -right-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ice-400 text-navy-950">
                <Snowflake className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-bold text-navy-900">
                  Halal Terjamin
                </span>
                <span className="block text-xs font-medium text-navy-500">
                  Beku Optimal
                </span>
              </span>
            </div>

            <div className="absolute -left-6 -top-6 flex items-center gap-1.5 rounded-full bg-royal-600 px-4 py-2 shadow-xl">
              <Sparkles className="h-4 w-4 text-ice-300" />
              <span className="text-xs font-bold text-white">
                Kualitas Terbaik
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
