import {
  HeartHandshake,
  Layers,
  MapPin,
  ShieldCheck,
  Snowflake,
  Store,
  UserRound,
  Wallet,
} from 'lucide-react'
import { Snowfall, SnowflakeIcon } from '../../components/shared/Snowflakes'
import Reveal from '../../components/shared/Reveal'
import SectionTitle from '../../components/public/SectionTitle'

const features = [
  { icon: HeartHandshake, title: 'Kenyamanan & Kebersihan', text: 'Makanan beku praktis, higienis, dan tersimpan dalam kondisi beku optimal.' },
  { icon: Wallet, title: 'Harga Terjangkau', text: 'Kualitas terbaik tanpa membebani kantong keluarga Anda.' },
  { icon: Layers, title: 'Keragaman Produk', text: 'Banyak pilihan nugget, sosis, dan olahan siap masak.' },
]

const values = [
  { icon: Snowflake, title: 'Retensi Nutrisi', text: 'Proses beku menjaga gizi dan cita rasa tetap alami.' },
  { icon: ShieldCheck, title: 'Higienis & Halal', text: 'Produk disimpan dalam kondisi beku optimal agar kesegaran selalu terjaga.' },
  { icon: UserRound, title: 'Terpercaya', text: 'Melayani masyarakat Brebes dengan produk yang konsisten berkualitas.' },
]

const stats = [
  { label: 'Produk Pilihan', value: '100+' },
  { label: 'Halal & Higienis', value: 'Terjamin' },
  { label: 'Kualitas Beku', value: 'Optimal' },
]

export function TentangKamiPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,209,249,0.18),transparent_55%)]" />
        <Snowfall count={12} />
        <div className="container-site relative text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-ice-300">
            Tentang Kami
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Putra Bengawan Frozen Food
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-navy-200">
            Putra Bengawan Frozen Food Store — toko makanan beku terbaik di
            Brebes, Jawa Tengah.
          </p>
        </div>
      </section>

      <div className="container-site py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-navy-100 shadow-lg">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-navy-50 to-ice-100">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-navy-200">
                  <SnowflakeIcon className="h-24 w-24 text-ice-400/70" />
                  <Store className="h-16 w-16" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-44 w-44 flex-col items-center justify-center rounded-full bg-white/80 text-center shadow-xl backdrop-blur">
                    <Snowflake className="h-8 w-8 text-ice-500" />
                    <p className="mt-1 font-display text-sm font-extrabold text-royal-700">
                      Putra Bengawan
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-navy-500">
                      Frozen Food
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ice-400 text-white">
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
                <div key={f.title} className="flex items-center gap-4 rounded-2xl border border-navy-100 bg-navy-50/40 p-3.5 transition-colors hover:bg-ice-100/40">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ice-400 to-royal-500 text-white">
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
                <div className="flex h-full flex-col items-center rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-ice-400 to-royal-500 text-white shadow-lg shadow-ice-400/25">
                    <v.icon className="h-6 w-6" />
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

        <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-royal-700 to-royal-950 p-8 text-white">
          <div className="grid gap-8 sm:grid-cols-3">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="text-center">
                  <p className="font-display text-2xl font-extrabold text-ice-300">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-white/80">
                    {s.label}
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
