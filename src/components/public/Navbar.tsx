import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LogIn, Menu, Phone, ShoppingCart, X } from 'lucide-react'
import { SnowflakeIcon } from '../shared/Snowflakes'
import { waLink, STORE_SETTINGS } from '../../utils/constants'
import { useCartStore } from '../../stores/cartStore'
import { cn } from '../../lib/utils'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/produk', label: 'Produk' },
  { to: '/cara-order', label: 'Cara Order' },
  { to: '/testimoni', label: 'Testimoni' },
  { to: '/kontak', label: 'Hubungi Kami' },
  { to: '/tentang-kami', label: 'Tentang Kami' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const cartCount = useCartStore(
    (s) => s.items.reduce((sum, i) => sum + i.quantity, 0),
  )
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
        'sticky top-0 z-50 w-full border-b border-white/0 transition-all duration-300',
        scrolled ? 'bg-navy-50/95 shadow-md backdrop-blur' : 'bg-navy-50',
      )}
    >
      <div className="flex items-center justify-between gap-6 py-3 pl-4 pr-3 lg:px-8">
        <Link to="/" aria-label="Putra Bengawan Frozen Food" className="shrink-0">
          <span className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ice-400 text-white">
              <SnowflakeIcon className="h-6 w-6" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-extrabold text-royal-600">
                Putra Bengawan
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.22em] text-navy-500">
                FROZEN FOOD
              </span>
            </span>
          </span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Menu utama"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'nav-item relative px-3 py-2 font-display text-[15px] font-semibold transition-colors',
                  isActive
                    ? 'acuas-active text-royal-600'
                    : 'text-navy-800 hover:text-royal-600',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden flex-col border-r border-ice-400 pr-4 text-right xl:flex">
            <span className="text-xs font-medium text-navy-500">
              Gratis Informasi
            </span>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-bold text-royal-600"
          >
            <Phone className="h-3.5 w-3.5" />
            {STORE_SETTINGS.phone}
          </a>
        </div>

        <CartButton />

        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 rounded-full bg-royal-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-royal-500"
          aria-label="Masuk Admin"
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden md:inline">Admin</span>
        </Link>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-full border border-navy-200 p-2 text-navy-700 lg:hidden"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="inset-x-0 top-full border-t border-navy-100 bg-navy-50 lg:hidden">
          <nav className="container-site flex flex-col gap-1 py-4" aria-label="Menu mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-3 font-display text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-white text-royal-600'
                      : 'text-navy-700 hover:bg-white',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/keranjang"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-royal-600 px-4 py-3 text-sm font-semibold text-white"
            >
              <ShoppingCart className="h-4 w-4" />
              Keranjang ({cartCount})
            </Link>
            <Link
              to="/admin/login"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-royal-600 px-4 py-3 text-sm font-semibold text-white"
            >
              <LogIn className="h-4 w-4" />
              Masuk Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

function CartButton() {
  const count = useCartStore(
    (s) => s.items.reduce((sum, i) => sum + i.quantity, 0),
  )
  return (
    <Link
      to="/keranjang"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 transition-colors hover:border-royal-500 hover:text-royal-600"
      aria-label={`Keranjang (${count} item)`}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ice-400 px-1 text-[10px] font-bold text-white shadow">
          {count}
        </span>
      )}
    </Link>
  )
}

export default Navbar
