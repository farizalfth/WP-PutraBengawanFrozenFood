import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import Logo from '../shared/Logo'
import { InstagramIcon } from '../shared/InstagramIcon'
import { STORE_NAME, STORE_SETTINGS } from '../../utils/constants'

export function Footer() {
  return (
    <footer className="bg-navy-950">
      <div className="mx-auto w-full max-w-5xl grid gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div>
          <Logo variant="light" />
          <p className="mt-5 max-w-xs text-sm leading-[1.9] text-navy-300">
            Menyediakan berbagai macam Frozen Food praktis, enak dan higienis
            untuk keluarga Anda. Kualitas terbaik, harga bersahabat.
          </p>
        </div>

        <div>
          <h4 className="mb-5 font-display text-xl font-bold text-white">
            Jam Operasional
          </h4>
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-3 text-navy-300">
              <Clock className="h-4 w-4 shrink-0 text-ice-300" />
              <span className="text-white">{STORE_SETTINGS.open_hours}</span>
            </div>
            <div className="flex items-start gap-3 text-navy-300">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-ice-300" />
              <span className="max-w-[16rem] leading-[1.7]">{STORE_SETTINGS.address}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-5 font-display text-xl font-bold text-white">
            Info Kontak
          </h4>
          <div className="flex flex-col gap-3 text-sm">
            <a
              href={`https://wa.me/${STORE_SETTINGS.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-navy-300 transition-all duration-300 hover:tracking-wide hover:text-ice-300"
            >
              <Phone className="h-4 w-4 shrink-0 text-ice-300" />
              {STORE_SETTINGS.phone}
            </a>
            <a
              href={`https://instagram.com/${STORE_SETTINGS.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-navy-300 transition-all duration-300 hover:tracking-wide hover:text-ice-300"
            >
              <InstagramIcon className="h-4 w-4 shrink-0 text-ice-300" />
              {STORE_SETTINGS.instagram}
            </a>
            <a
              href={`mailto:info@putrabengawan.com`}
              className="flex items-center gap-3 text-navy-300 transition-all duration-300 hover:tracking-wide hover:text-ice-300"
            >
              <Mail className="h-4 w-4 shrink-0 text-ice-300" />
              info@putrabengawan.com
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="mx-auto max-w-5xl px-4 text-center text-xs text-navy-400 sm:px-6">
          <span className="text-white">© 2026 {STORE_NAME}</span> Frozen Food.
          All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
