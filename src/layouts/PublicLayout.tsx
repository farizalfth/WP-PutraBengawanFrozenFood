import { Outlet } from 'react-router-dom'
import Navbar from '../components/public/Navbar'
import Footer from '../components/public/Footer'
import ScrollToTop from '../components/shared/ScrollToTop'
import Toaster from '../components/shared/Toaster'
import { usePageView } from '../hooks/usePageView'

export function PublicLayout() {
  usePageView()

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Toaster />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout