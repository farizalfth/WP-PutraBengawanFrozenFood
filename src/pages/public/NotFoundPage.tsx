import { Link } from 'react-router-dom'
import { ArrowLeft, PackageX } from 'lucide-react'
import { Snowfall } from '../../components/shared/Snowflakes'

export function NotFoundPage() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-navy-950 py-24 text-center text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-navy-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,209,249,0.12),transparent_55%)]" />
      <Snowfall count={8} />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-ice-400 text-navy-950">
        <PackageX className="h-10 w-10" />
      </div>
      <h1 className="relative mt-6 font-display text-7xl font-extrabold text-white sm:text-8xl">
        404
      </h1>
      <p className="relative mt-2 max-w-sm text-sm text-navy-200">
        Halaman yang Anda cari tidak ditemukan.
      </p>
      <Link
        to="/"
        className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-royal-600 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-ice-400 hover:text-navy-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Beranda
      </Link>
    </div>
  )
}

export default NotFoundPage