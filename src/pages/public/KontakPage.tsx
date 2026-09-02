import { useState } from 'react'
import {
  AtSign,
  Clock,
  Crown,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  Store,
  UserRound,
} from 'lucide-react'
import Reveal from '../../components/shared/Reveal'
import { Snowfall, SnowflakeIcon } from '../../components/shared/Snowflakes'
import { waLinkTo, STORE_SETTINGS } from '../../utils/constants'

const waNumbers = [
  {
    label: 'Putra Bengawan',
    display: '0882-0050-26495',
    number: STORE_SETTINGS.whatsapp,
  },
]

const infoItems = [
  {
    icon: MapPin,
    title: 'Alamat',
    value: 'Pasar Induk Kaumanpasar, Kec. Brebes, Kabupaten Brebes, Jawa Tengah',
  },
  { icon: Phone, title: 'Telepon', value: STORE_SETTINGS.phone },
  { icon: Clock, title: 'Jam Buka', value: STORE_SETTINGS.open_hours },
  { icon: AtSign, title: 'Instagram', value: STORE_SETTINGS.instagram },
]

export function KontakPage() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = `Halo Putra Bengawan Frozen Food${name ? `, saya ${name}` : ''}. ${message}`
    window.open(
      waLinkTo(text.trim(), waNumbers[0].number),
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,209,249,0.18),transparent_55%)]" />
        <Snowfall count={12} />
        <div className="container-site relative text-center">
          <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-ice-300">
            Kontak
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Hubungi Kami
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-navy-200">
            Ada pertanyaan? Kami siap membantu Anda setiap hari.
          </p>
        </div>
      </section>

      <div className="container-site py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {infoItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <div className="group flex h-full items-center gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ice-400 to-royal-500 text-white">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-navy-400">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-navy-800">
                    {item.value}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-navy-800 p-6 text-white shadow-lg">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-ice-400/20 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30">
                      <MessageCircle className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold">
                        Ada Pertanyaan?
                      </h3>
                      <p className="text-sm text-navy-300">
                        Chat langsung ke WhatsApp kami.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5">
                    {waNumbers.map((wa) => (
                      <a
                        key={wa.number}
                        href={waLinkTo(
                          'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk Anda.',
                          wa.number,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-between rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-3 text-left transition-colors hover:bg-[#25D366]/20"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]">
                            <MessageCircle className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block text-sm font-bold">
                              {wa.label}
                            </span>
                            <span className="block text-xs text-navy-300">
                              {wa.display}
                            </span>
                          </span>
                        </span>
                        <span className="rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90">
                          Chat
                        </span>
                      </a>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-navy-300">
                      Owner
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2.5">
                      <a
                        href="https://www.instagram.com/anggipasha24/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-ice-300 transition-colors hover:bg-white/20 hover:text-white"
                      >
                        <UserRound className="h-4 w-4" />
                        @anggipasha24
                      </a>
                      <a
                        href="https://www.instagram.com/asri_4/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-ice-300 transition-colors hover:bg-white/20 hover:text-white"
                      >
                        <UserRound className="h-4 w-4" />
                        @asri_4
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-navy-100 bg-white p-6 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-royal-600 text-white">
                    <Send className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-900">
                      Kirim Pesan Cepat
                    </h3>
                    <p className="text-xs text-navy-500">
                      Pesan langsung terkirim ke WhatsApp kami.
                    </p>
                  </div>
                </div>

                <label className="mt-5 block">
                  <span className="mb-1.5 block text-sm font-semibold text-navy-800">
                    Nama Anda
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama..."
                    className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-1.5 block text-sm font-semibold text-navy-800">
                    Pesan
                  </span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                    placeholder="Tulis pertanyaan Anda tentang produk, harga, atau pemesanan..."
                    className="w-full resize-none rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition-colors placeholder:text-navy-300 focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-royal-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-ice-400 hover:text-navy-950"
                >
                  <Send className="h-4 w-4" /> Kirim ke WhatsApp
                </button>
              </form>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-3">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 shadow-sm">
              <div className="relative flex items-center gap-3 bg-navy-50 px-5 py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ice-400 text-navy-950">
                  <Store className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base font-bold text-navy-900">
                    Lokasi Kami
                  </p>
                  <p className="text-xs text-navy-500">
                    42HR+6P8, Jl. Ps. Induk, Kaumanpasar, Brebes
                  </p>
                </div>
                <a
                  href={STORE_SETTINGS.maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto hidden rounded-full border border-navy-200 px-4 py-2 text-xs font-bold text-royal-600 transition-colors hover:bg-royal-600 hover:text-white sm:inline-flex"
                >
                  <Navigation className="mr-1.5 h-4 w-4" /> Buka di Maps
                </a>
              </div>

              <div className="relative flex-1">
                <iframe
                  title="Lokasi Putra Bengawan Frozen Food"
                  src={STORE_SETTINGS.map_embed}
                  className="h-full min-h-[360px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                  <div className="flex flex-col items-center">
                    <span className="flex flex-col items-center">
                      <span className="absolute -inset-4 animate-ping rounded-full bg-ice-400/40" />
                      <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-ice-400 to-royal-500 shadow-xl shadow-royal-900/40">
                        <Crown className="h-6 w-6 text-white" />
                      </span>
                    </span>
                    <span className="relative -mt-2 flex items-center gap-1 whitespace-nowrap rounded-full bg-navy-950 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                      <SnowflakeIcon className="h-3 w-3 text-ice-300" />
                      Putra Bengawan
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-navy-100 bg-navy-50/60 p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ice-500" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-navy-400">
                        Alamat
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-navy-800">
                        42HR+6P8, Jl. Ps. Induk, Kaumanpasar, Brebes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ice-500" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-navy-400">
                        Jam Buka
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-navy-800">
                        {STORE_SETTINGS.open_hours}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ice-500" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-navy-400">
                        Telepon
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-navy-800">
                        {STORE_SETTINGS.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}

export default KontakPage
