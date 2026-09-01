import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ChevronDown, LayoutDashboard, LogOut, ShoppingCart } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import Logo from '../components/shared/Logo'
import { SnowflakeIcon } from '../components/shared/Snowflakes'
import ScrollToTop from '../components/shared/ScrollToTop'
import { cn } from '../lib/utils'

export function CashierLayout() {
  const profile = useAuthStore((s) => s.profile)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate('/admin/login')
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-navy-50/70">
      <ScrollToTop />
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-navy-100 bg-white px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-3">
          <Logo variant="dark" size="sm" />
          <span className="hidden rounded-full bg-navy-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600 sm:inline-flex">
            <SnowflakeIcon className="mr-1 h-3 w-3" /> Point of Sale
          </span>
        </div>

        <nav className="flex items-center gap-1" aria-label="Menu kasir">
          <NavLink
            to="/kasir"
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-royal-600 text-white'
                  : 'text-black hover:bg-navy-50 hover:text-royal-600',
              )
            }
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Kasir</span>
          </NavLink>
        </nav>

        <div className="relative flex items-center gap-2" ref={menuRef}>
          <div className="hidden text-right md:block">
            <p className="text-xs font-bold text-black">{profile?.name || '-'}</p>
            <p className="text-[10px] capitalize text-neutral-500">{profile?.role ?? '-'}</p>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-navy-200 px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-navy-50"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <span className="hidden sm:inline">Menu</span>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', menuOpen && 'rotate-180')}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-navy-100 bg-white shadow-lg">
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-royal-50 hover:text-royal-600"
              >
                <LayoutDashboard className="h-4 w-4 text-royal-600" />
                Dashboard Admin
              </Link>
              <div className="border-t border-navy-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 p-3 lg:p-5">
        <Outlet />
      </main>
    </div>
  )
}

export default CashierLayout
