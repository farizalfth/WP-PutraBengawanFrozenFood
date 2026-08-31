import { BadgeCheck, MapPin, Store, UserRound, Wallet } from 'lucide-react'
import { Snowfall, SnowflakeIcon } from '../../components/shared/Snowflakes'
import Reveal from '../../components/shared/Reveal'
import SectionTitle from '../../components/public/SectionTitle'

const features = [
  { icon: BadgeCheck, title: 'Produk Berkualitas', text: 'Setiap produk dipilih dari merek terpercaya, halal, dan higienis.' },
  { icon: Wallet, title: 'Harga Bersahabat', text: 'Harga terjangkau tanpa mengorbankan kualitas.' },
  { icon: UserRound, title: 'Pelayanan Terbaik', text: 'Staf ramah dan siap melayani kebutuhan Anda.' },
]

const values = [
  { title: 'Kepuasan Pelanggan', text: 'Prioritas utama kami adalah kepuasan pelanggan dalam setiap transaksi.' },
  { title: 'Higienis & Halal', text: 'Produk disimpan dalam kondisi beku optimal agar kesegaran selalu terjaga.' },
  { title: 'Terpercaya', text: 'Melayani masyarakat Brebes dengan produk yang konsisten berkualitas.' },
]

export function TentangKamiPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 to-royal-800 py-16 text-white">
        <Snowfall count={12} />
        <div className="container-site relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ice-300">
            Tentang Kami
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Putra Bengawan Frozen Food
          </h1>
          <p className="mt-3 max-w-xl text-sm text-navy-200">
            Toko frozen food terpercaya di Brebes, Jawa Tengah.
          </p>
        </div>
      </section>

      <div className="container-site py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-navy-100 shadow-lg">
              <div className="relative aspect-[4/3] bg-navy-50">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-navy-200">
                  <Store className="h-20 w-20" />
                  <SnowflakeIcon className="h-10 w-10 animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-800 text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-900">Brebes, Jawa Tengah</p>
                    <p className="text-xs text-navy-500">Pasar Induk Kaumanpasar</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="font-display text-2xl font-extrabold text-navy-900 sm:text-3xl">
              Tentang Kami
            </h2>
            <p className="mt-4 leading-relaxed text-navy-600">
              Putra Bengawan Frozen Food adalah toko frozen food yang berlokasi
              di Brebes, Jawa Tengah. Kami menyediakan berbagai produk frozen
              food berkualitas dengan harga terjangkau untuk memenuhi kebutuhan
              keluarga Anda.
            </p>
            <p className="mt-3 leading-relaxed text-navy-600">
              Melayani penjualan eceran maupun grosir, kami menawarkan produk
              mulai dari nugget, sosis, bakso, hingga berbagai olahan siap
              masak yang selalu segar dan higienis.
            </p>
            <div className="mt-6 space-y-3">
              {features.map((f) => (
                <div key={f.title} className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-navy-50/40 p-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-800 text-white">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-900">{f.title}</p>
                    <p className="text-xs text-navy-500">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-16">
          <Reveal>
            <SectionTitle
              eyebrow="Nilai Kami"
              title="Komitmen Kami"
              description="Hal yang selalu kami jaga dalam melayani Anda."
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                    <SnowflakeIcon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-navy-900">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">
                    {v.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TentangKamiPage