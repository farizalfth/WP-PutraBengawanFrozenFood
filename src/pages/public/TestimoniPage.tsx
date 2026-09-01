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
          <figure className="flex h-full flex-col items-center rounded-[10px] border border-navy-100 bg-white p-7 text-center shadow-sm transition-shadow hover:shadow-md">
            <StarRating rating={t.rating} />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-navy-700">
              “{t.message}”
            </blockquote>
            <figcaption className="mt-5 flex flex-col items-center">
              <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border-4 border-ice-400 bg-royal-600 text-base font-bold text-white">
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
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,209,249,0.15),transparent_55%)]" />
        <Snowfall count={12} />
        <div className="container-site relative">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-ice-300">
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