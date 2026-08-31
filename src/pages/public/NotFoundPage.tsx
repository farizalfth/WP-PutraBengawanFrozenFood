import { Link } from 'react-router-dom'
import { ArrowLeft, PackageX } from 'lucide-react'
import { Snowfall } from '../../components/shared/Snowflakes'

export function NotFoundPage() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-navy-50 py-24 text-center">
      <Snowfall count={8} />
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-navy-800 text-white">
        <PackageX className="h-10 w-10" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-extrabold text-navy-900">
        404
      </h1>
      <p className="mt-2 max-w-sm text-sm text-navy-500">
        Halaman yang Anda cari tidak ditemukan.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy-800 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-navy-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Beranda
      </Link>
    </div>
  )
}

export default NotFoundPage