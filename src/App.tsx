import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import CashierLayout from './layouts/CashierLayout'
import { AdminRoute, CashierRoute } from './components/auth/ProtectedRoutes'
import Toaster from './components/shared/Toaster'

import HomePage from './pages/public/HomePage'
import ProdukPage from './pages/public/ProdukPage'
import ProdukDetailPage from './pages/public/ProdukDetailPage'
import TentangKamiPage from './pages/public/TentangKamiPage'
import CaraOrderPage from './pages/public/CaraOrderPage'
import TestimoniPage from './pages/public/TestimoniPage'
import KontakPage from './pages/public/KontakPage'

import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage'
import AdminTestimonialsPage from './pages/admin/AdminTestimonialsPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'

import CashierPage from './pages/cashier/CashierPage'
import NotFoundPage from './pages/public/NotFoundPage'

function AppBootstrap() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => {
    init()
  }, [init])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <AppBootstrap />
      <Toaster />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tentang-kami" element={<TentangKamiPage />} />
          <Route path="/produk" element={<ProdukPage />} />
          <Route path="/produk/:id" element={<ProdukDetailPage />} />
          <Route path="/cara-order" element={<CaraOrderPage />} />
          <Route path="/testimoni" element={<TestimoniPage />} />
          <Route path="/kontak" element={<KontakPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="produk" element={<AdminProductsPage />} />
            <Route path="kategori" element={<AdminCategoriesPage />} />
            <Route path="transaksi" element={<AdminTransactionsPage />} />
            <Route path="testimoni" element={<AdminTestimonialsPage />} />
            <Route path="pengguna" element={<AdminUsersPage />} />
          </Route>
        </Route>

        <Route element={<CashierRoute />}>
          <Route path="/kasir" element={<CashierLayout />}>
            <Route index element={<CashierPage />} />
          </Route>
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App