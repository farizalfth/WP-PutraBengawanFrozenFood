import { HeartHandshake, Package, Snowflake, Truck } from 'lucide-react'
import Reveal from '../shared/Reveal'

const services = [
  {
    icon: Truck,
    title: 'Pengiriman Cepat',
    text: 'Melayani pengiriman ke seluruh Brebes dan sekitarnya',
  },
  {
    icon: Package,
    title: 'Produk Berkualitas',
    text: 'Dibuat dari bahan pilihan dan terjamin kualitasnya',
  },
  {
    icon: Snowflake,
    title: 'Simpan Beku',
    text: 'Kesegaran terjaga dengan penyimpanan beku optimal',
  },
  {
    icon: HeartHandshake,
    title: 'Layanan Ramah',
    text: 'Siap membantu Anda setiap saat',
  },
]

export function ServiceHighlight() {
  return (
    <section className="relative bg-white py-16">
      <div className="container-site">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-navy-100 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700 transition-colors group-hover:bg-navy-800 group-hover:text-white">
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-navy-900">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-navy-500">
                    {s.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServiceHighlight