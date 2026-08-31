import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { isSupabaseConfigured } from '../../services/supabase'
import { SetupWarning } from '../shared/SetupWarning'

function RoleGuard({
  allowedRoles,
}: {
  allowedRoles: Array<'admin' | 'cashier'>
}) {
  const session = useAuthStore((s) => s.session)
  const profile = useAuthStore((s) => s.profile)
  const initialized = useAuthStore((s) => s.initialized)
  const location = useLocation()

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 p-6">
        <SetupWarning />
      </div>
    )
  }

  if (!initialized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-neutral-600">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-navy-800" />
        <p className="text-sm font-medium">Memuat sesi...</p>
      </div>
    )
  }

  if (!session?.user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 p-6 text-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-black">
            Akses Ditolak
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Outlet />
    </>
  )
}

export function AdminRoute() {
  return <RoleGuard allowedRoles={['admin']} />
}

export function StaffRoute() {
  return <RoleGuard allowedRoles={['admin', 'cashier']} />
}

export function CashierRoute() {
  return <RoleGuard allowedRoles={['admin', 'cashier']} />
}

export default RoleGuard