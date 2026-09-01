import { useEffect, useRef, useState } from 'react'
import { Package, Snowflake, ThumbsUp, Truck } from 'lucide-react'
import Reveal from '../shared/Reveal'

function Counter({
  to,
  suffix = '+',
}: {
  to: number
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const duration = 2000
            const start = performance.now()
            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              setValue(Math.round(eased * to))
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to])

  return (
    <span ref={ref} className="font-display text-4xl font-extrabold text-white">
      {value}
      <span className="text-ice-300">{suffix}</span>
    </span>
  )
}

const counters = [
  { icon: ThumbsUp, label: 'Pelanggan Puas', to: 1500 },
  { icon: Package, label: 'Varian Produk', to: 100 },
  { icon: Truck, label: 'Pengiriman', to: 500 },
  { icon: Snowflake, label: 'Tahun Pengalaman', to: 5 },
]

export function CounterSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-royal-700 to-royal-950 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,209,249,0.15),transparent_60%)]" />
      <div className="container-site relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {counters.map((c, i) => (
          <Reveal key={c.label} delay={i * 80}>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-[100px] w-[100px] items-center justify-center rounded-[50px] bg-ice-400">
                <c.icon className="h-10 w-10 text-white" />
              </div>
              <h4 className="my-4 font-display text-lg font-bold text-white">
                {c.label}
              </h4>
              <Counter to={c.to} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default CounterSection
