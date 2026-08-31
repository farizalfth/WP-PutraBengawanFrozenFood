import { Clock, MapPin } from 'lucide-react'
import { InstagramIcon } from '../shared/InstagramIcon'
import { STORE_SETTINGS } from '../../utils/constants'

export function TopBar() {
  return (
    <div className="bg-navy-950 text-white">
      <div className="container-site flex items-center justify-between gap-4 py-2 text-xs">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="hidden items-center gap-1.5 opacity-90 sm:inline-flex">
            <MapPin className="h-3.5 w-3.5 text-ice-300" />
            {STORE_SETTINGS.address.split(',')[1]?.trim() ?? 'Brebes, Jawa Tengah'}
          </span>
          <span className="inline-flex items-center gap-1.5 opacity-90">
            <Clock className="h-3.5 w-3.5 text-ice-300" />
            {STORE_SETTINGS.open_hours}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`https://instagram.com/${STORE_SETTINGS.instagram.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:bg-white/10"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{STORE_SETTINGS.instagram}</span>
          </a>
          <a
            href={`https://wa.me/${STORE_SETTINGS.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#25D366] px-2.5 py-1 font-semibold text-white transition-opacity hover:opacity-90"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopBar