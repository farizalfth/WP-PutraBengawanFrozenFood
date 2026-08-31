import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  ReceiptText,
  MessageSquareQuote,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Store,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import Logo from '../components/shared/Logo'
import ScrollToTop from '../components/shared/ScrollToTop'
import { cn } from '../lib/utils'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/produk', label: 'Produk', icon: Package },
  { to: '/admin/kategori', label: 'Kategori', icon: Tags },
  { to: '/admin/transaksi', label: 'Transaksi', icon: ReceiptText },
  { to: '/admin/testimoni', label: 'Testimoni', icon: MessageSquareQuote },
  { to: '/admin/pengguna', label: 'Pengguna', icon: Users },
]

function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void
}) {
  const profile = useAuthStore((s) => s.profile)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Logo variant="dark" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Menu admin">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-navy-800 text-white shadow-sm'
                  : 'text-black hover:bg-navy-50 hover:text-black',
              )
            }
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-navy-100 p-3">
        <NavLink
          to="/kasir"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-navy-50 hover:text-black"
        >
          <Store className="h-4.5 w-4.5" />
          Buka Kasir
          <ExternalLink className="ml-auto h-3.5 w-3.5" />
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4.5 w-4.5" />
          Logout
        </button>
      </div>

      <div className="border-t border-navy-100 px-5 py-4">
        <p className="text-xs font-bold text-black">
          {profile?.name || 'Pengguna'}
        </p>
        <p className="text-xs capitalize text-neutral-500">{profile?.role ?? '-'}</p>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const profile = useAuthStore((s) => s.profile)

  return (
    <div className="flex min-h-screen bg-navy-50/70">
      <ScrollToTop />

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-navy-100 bg-white lg:block">
        <SidebarContent />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="animate-fade-in-up absolute inset-y-0 left-0 w-72 bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-neutral-600 hover:bg-navy-50"
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-navy-100 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg p-2 text-black hover:bg-navy-50 lg:hidden"
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-bold text-black">
              Dashboard Admin
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-black">
                {profile?.name || '-'}
              </p>
              <p className="text-xs capitalize text-neutral-500">
                {profile?.role ?? '-'}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
              {(profile?.name ?? 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout