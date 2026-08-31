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
    <section className="relative bg-navy-50/60 py-16">
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
                    <figure className="flex h-full flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <StarRating rating={t.rating} />
                        <MessageSquareQuote className="h-6 w-6 text-navy-200" />
                      </div>
                      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-navy-700">
                        “{t.message}”
                      </blockquote>
                      <figcaption className="mt-5 flex items-center gap-3 border-t border-navy-50 pt-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
                          {t.name.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-navy-900">
                            {t.name}
                          </p>
                          <p className="text-xs text-navy-400">
                            {t.job || 'Pelanggan'}
                          </p>
                        </div>
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
                          ? 'w-6 bg-navy-800'
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