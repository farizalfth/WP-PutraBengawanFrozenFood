import { MessageCircle } from 'lucide-react'
import Reveal from '../shared/Reveal'
import { waLink } from '../../utils/constants'

export function ContactCta() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 text-white sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
      <div className="container-site relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ice-300">
            <span className="h-px w-6 bg-ice-400/40" />
            Hubungi Kami
            <span className="h-px w-6 bg-ice-400/40" />
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Ada Pertanyaan?
            <span className="block text-ice-200">Siap Membantu Anda!</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-navy-200">
            Tim kami siap menjawab pertanyaan Anda tentang produk, harga, dan
            pemesanan.
          </p>
          <a
            href={waLink(
              'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk Anda.',
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-ice-400 px-6 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-ice-400/20 transition-all hover:-translate-y-0.5 hover:bg-ice-300 hover:shadow-xl"
          >
            <MessageCircle className="h-5 w-5" />
            Chat WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export default ContactCta