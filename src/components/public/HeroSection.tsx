import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Snowflake } from 'lucide-react'
import { SnowflakeIcon } from '../shared/Snowflakes'
import { waLink } from '../../utils/constants'
import { DefaultProductImage } from '../ui/ImageWithFallback'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <DefaultProductImage className="absolute inset-0 opacity-[0.06]" />
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

      <button
        type="button"
        aria-label="Slide sebelumnya"
        className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-r-[50px] bg-ice-400 px-5 py-6 transition-colors hover:bg-royal-600 md:flex"
        style={{ padding: '25px 22px' }}
      >
        <ChevronLeft className="h-7 w-7" />
      </button>
      <button
        type="button"
        aria-label="Slide berikutnya"
        className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-l-[50px] bg-ice-400 px-5 py-6 transition-colors hover:bg-royal-600 md:flex"
        style={{ padding: '25px 22px' }}
      >
        <ChevronRight className="h-7 w-7" />
      </button>

      <div className="container-site relative grid min-h-[92vh] items-center py-28">
        <div className="max-w-2xl">
          <p
            className="animate-fade-in-up inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.28em] text-ice-300"
            style={{ animationDelay: '1s' }}
          >
            <SnowflakeIcon className="h-5 w-5" />
            Frozen Food Brebes
          </p>

          <h1
            className="animate-fade-in-up mt-6 font-display text-4xl font-extrabold capitalize leading-[1.1] sm:text-5xl lg:text-[3.6rem]"
            style={{ animationDelay: '1.2s' }}
          >
            Selamat Datang di{' '}
            <span className="text-ice-300">Putra Bengawan</span> Frozen Food
          </h1>

          <p
            className="animate-fade-in-up mt-4 max-w-xl text-sm font-medium leading-relaxed text-navy-200 sm:text-base"
            style={{ animationDelay: '1.4s' }}
          >
            Menyediakan berbagai macam Frozen Food praktis, enak dan higienis
            untuk keluarga Anda. Kualitas terbaik dengan harga yang
            bersahabat.
          </p>

          <div
            className="animate-fade-in-up mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '1.6s' }}
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
            style={{ animationDelay: '1.8s' }}
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
      </div>
    </section>
  )
}

export default HeroSection
