import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, MessageSquareQuote, PackageSearch, RefreshCw } from 'lucide-react'
import { listActiveTestimonials } from '../../services/testimonials'
import { useAsyncData } from '../../hooks/useAsyncData'
import Reveal from '../shared/Reveal'
import SectionTitle from './SectionTitle'
import StarRating from '../ui/StarRating'
import { Spinner, StateMessage } from '../ui/StateMessage'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

const PER_PAGE = 3

export function TestimonialSection() {
  const { data: testimonials, error, loading, refetch } = useAsyncData(
    listActiveTestimonials,
  )
  const [page, setPage] = useState(0)
  const maxPage = testimonials ? Math.max(0, Math.ceil(testimonials.length / PER_PAGE) - 1) : 0

  useEffect(() => {
    setPage(0)
  }, [testimonials])

  const visible = testimonials?.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE) ?? []

  return (
    <section className="relative bg-navy-50/50 py-20 sm:py-24">
      <div className="container-site">
        <Reveal>
          <SectionTitle
            eyebrow="Apa Kata Mereka"
            title="Testimoni Pelanggan"
            description="Kepercayaan pelanggan adalah prioritas kami."
          />
        </Reveal>

        <div className="mt-10">
          {loading && <Spinner label="Memuat testimoni..." />}

          {error && (
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
          )}

          {!loading && !error && (!testimonials || testimonials.length === 0) && (
            <StateMessage
              icon={<MessageSquareQuote className="h-10 w-10" />}
              title="Belum ada testimoni."
              description="Testimoni pelanggan akan tampil setelah dikelola oleh admin."
            />
          )}

          {!loading && !error && testimonials && testimonials.length > 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((t, i) => (
                  <Reveal key={t.id} delay={i * 80}>
                    <figure className="flex h-full flex-col items-center rounded-[10px] border border-navy-100 bg-white p-8 text-center transition-shadow duration-300 hover:shadow-[0_0_45px_rgba(0,0,0,0.08)]">
                      <StarRating rating={t.rating} />
                      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-navy-500">
                        “{t.message}”
                      </blockquote>
                      <figcaption className="flex flex-col items-center">
                        <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border-4 border-ice-400 bg-royal-600 font-display text-lg font-bold text-white">
                          {t.name.charAt(0).toUpperCase()}
                        </span>
                        <p className="text-sm font-bold text-navy-950">
                          {t.name}
                        </p>
                        <p className="text-xs text-navy-400">
                          {t.job || 'Pelanggan'}
                        </p>
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>

              {maxPage > 0 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    aria-label="Sebelumnya"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: maxPage + 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPage(i)}
                      className={cn(
                        'h-2.5 rounded-full transition-all',
                        i === page
                          ? 'w-6 bg-royal-600'
                          : 'w-2.5 bg-navy-200 hover:bg-navy-300',
                      )}
                      aria-label={`Halaman ${i + 1}`}
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                    disabled={page === maxPage}
                    aria-label="Berikutnya"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection