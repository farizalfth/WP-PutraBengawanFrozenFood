import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle } from 'lucide-react'
import Logo from '../shared/Logo'
import { waLink } from '../../utils/constants'
import { cn } from '../../lib/utils'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/tentang-kami', label: 'Tentang Kami' },
  { to: '/produk', label: 'Produk' },
  { to: '/cara-order', label: 'Cara Order' },
  { to: '/testimoni', label: 'Testimoni' },
  { to: '/kontak', label: 'Hubungi Kami' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white/95 backdrop-blur transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm',
      )}
    >
      <div className="flex items-center justify-between gap-6 py-3 pl-4 pr-3 lg:px-8">
        <Link to="/" aria-label="Putra Bengawan Frozen Food" className="shrink-0">
          <Logo variant="dark" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Menu utama">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-navy-50 text-navy-800'
                    : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={waLink(
              'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk Anda.',
            )}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-xl bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-navy-900 hover:shadow-md sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            Hubungi Kami
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-navy-100 p-2 text-navy-800 lg:hidden"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full border-t border-navy-100 bg-white shadow-lg lg:hidden">
          <nav className="container-site flex flex-col gap-1 py-4" aria-label="Menu mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-3 text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-navy-50 text-navy-800'
                      : 'text-navy-600 hover:bg-gray-50',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href={waLink(
                'Halo Putra Bengawan Frozen Food, saya ingin bertanya tentang produk Anda.',
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-4 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Hubungi Kami
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar