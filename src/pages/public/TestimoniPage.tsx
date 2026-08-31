import { MessageSquareQuote, PackageSearch, RefreshCw } from 'lucide-react'
import { listActiveTestimonials } from '../../services/testimonials'
import { useAsyncData } from '../../hooks/useAsyncData'
import Reveal from '../../components/shared/Reveal'
import SectionTitle from '../../components/public/SectionTitle'
import { Snowfall } from '../../components/shared/Snowflakes'
import StarRating from '../../components/ui/StarRating'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import { Button } from '../../components/ui/Button'

function TestimonialsGrid() {
  const { data: testimonials, error, loading, refetch } = useAsyncData(
    listActiveTestimonials,
  )

  if (loading) return <Spinner label="Memuat testimoni..." />
  if (error)
    return (
      <StateMessage
        icon={<PackageSearch className="h-10 w-10" />}
        title="Gagal mengambil data testimoni."
        description={error}
        action={
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
          </Button>
        }
      />
    )
  if (!testimonials || testimonials.length === 0)
    return (
      <StateMessage
        icon={<MessageSquareQuote className="h-10 w-10" />}
        title="Belum ada testimoni."
        description="Testimoni pelanggan akan tampil setelah dikelola oleh admin."
      />
    )

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t, i) => (
        <Reveal key={t.id} delay={(i % 3) * 80}>
          <figure className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <StarRating rating={t.rating} />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-navy-700">
              “{t.message}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-navy-50 pt-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
                {t.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-bold text-navy-900">{t.name}</p>
                <p className="text-xs text-navy-400">{t.job || 'Pelanggan'}</p>
              </div>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  )
}

export function TestimoniPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 to-royal-800 py-16 text-white">
        <Snowfall count={12} />
        <div className="container-site relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ice-300">
            Testimoni
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Testimoni Pelanggan
          </h1>
          <p className="mt-3 max-w-xl text-sm text-navy-200">
            Apa kata pelanggan kami tentang Putra Bengawan Frozen Food.
          </p>
        </div>
      </section>

      <div className="container-site py-14">
        <SectionTitle
          eyebrow="Apa Kata Mereka"
          title="Kepercayaan Pelanggan"
          description="Ulasan nyata dari pelanggan setia kami di Brebes dan sekitarnya."
        />
        <div className="mt-10">
          <TestimonialsGrid />
        </div>
      </div>
    </>
  )
}

export default TestimoniPage