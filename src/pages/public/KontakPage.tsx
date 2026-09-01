import { useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import Reveal from '../../components/shared/Reveal'
import { Snowfall } from '../../components/shared/Snowflakes'
import { waLink } from '../../utils/constants'

export function KontakPage() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = `Halo Putra Bengawan Frozen Food${name ? `, saya ${name}` : ''}. ${message}`
    window.open(waLink(text.trim()), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,209,249,0.15),transparent_55%)]" />
        <Snowfall count={12} />
        <div className="container-site relative">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-ice-300">
            Kontak
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Hubungi Kami
          </h1>
          <p className="mt-3 max-w-xl text-sm text-navy-200">
            Ada pertanyaan? Kami siap membantu Anda setiap hari.
          </p>
        </div>
      </section>

      <div className="container-site py-14">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-navy-100 bg-navy-800 p-6 text-white shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">
                    Ada Pertanyaan?
                  </h3>
                  <p className="text-sm text-navy-300">Siap Membantu Anda!</p>
                </div>
              </div>
              <a
                href={waLink(
                  'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk Anda.',
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> Chat WhatsApp
              </a>
            </div>

            <Reveal>
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-navy-100 bg-white p-6 shadow-md"
              >
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Kirim Pesan Cepat
                </h3>
                <p className="mt-1 text-sm text-navy-500">
                  Isi form, pesan langsung terkirim ke WhatsApp kami.
                </p>

                <label className="mt-5 block">
                  <span className="mb-1.5 block text-sm font-semibold text-navy-800">
                    Nama Anda
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama..."
                    className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none placeholder:text-navy-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
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
                    className="w-full resize-none rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none placeholder:text-navy-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
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
            <div className="h-full overflow-hidden rounded-3xl border border-navy-100 shadow-sm">
              <iframe
                title="Lokasi Putra Bengawan Frozen Food"
                src="https://maps.google.com/maps?q=Kaumanpasar%2C%20Brebes%2C%20Kabupaten%20Brebes%2C%20Jawa%20Tengah&z=16&output=embed"
                className="h-[420px] w-full border-0 lg:h-full lg:min-h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}

export default KontakPage