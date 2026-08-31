import { MessageCircle, MapPin, Clock, Phone } from 'lucide-react'
import { InstagramIcon } from '../shared/InstagramIcon'
import { Snowfall } from '../shared/Snowflakes'
import Reveal from '../shared/Reveal'
import { STORE_SETTINGS, waLink } from '../../utils/constants'

export function ContactCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-royal-800 py-16 text-white">
      <Snowfall count={14} />
      <div className="container-site relative">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Ada Pertanyaan?
              <span className="block text-ice-200">Siap Membantu Anda!</span>
            </h2>
            <p className="mt-3 max-w-md text-navy-200">
              Tim kami siap menjawab pertanyaan Anda tentang produk, harga, dan
              pemesanan.
            </p>
            <a
              href={waLink(
                'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk Anda.',
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <MessageCircle className="h-5 w-5" />
              Chat WhatsApp
            </a>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <MapPin className="h-5 w-5 text-ice-200" />
                  </span>
                  <span className="leading-relaxed text-navy-100">
                    {STORE_SETTINGS.address}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Clock className="h-5 w-5 text-ice-200" />
                  </span>
                  <span className="text-navy-100">{STORE_SETTINGS.open_hours}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Phone className="h-5 w-5 text-ice-200" />
                  </span>
                  <a
                    href={`https://wa.me/${STORE_SETTINGS.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-navy-100 transition-colors hover:text-white"
                  >
                    {STORE_SETTINGS.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <InstagramIcon className="h-5 w-5 text-ice-200" />
                  </span>
                  <a
                    href={`https://instagram.com/${STORE_SETTINGS.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-navy-100 transition-colors hover:text-white"
                  >
                    {STORE_SETTINGS.instagram}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default ContactCta