import { Database, ExternalLink } from 'lucide-react'
import { Button } from '../ui/Button'

export function SetupWarning() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-navy-100 bg-white p-8 text-center shadow-xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50 text-navy-600">
        <Database className="h-8 w-8" />
      </div>
      <h2 className="mt-5 font-display text-xl font-bold text-navy-900">
        Supabase Belum Dikonfigurasi
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-navy-500">
        Halaman ini membutuhkan koneksi ke Supabase. Salin{' '}
        <code className="rounded bg-navy-50 px-1.5 py-0.5 text-xs">.env.example</code>{' '}
        menjadi <code className="rounded bg-navy-50 px-1.5 py-0.5 text-xs">.env</code>{' '}
        lalu isi <code className="rounded bg-navy-50 px-1.5 py-0.5 text-xs">VITE_SUPABASE_URL</code>{' '}
        dan <code className="rounded bg-navy-50 px-1.5 py-0.5 text-xs">VITE_SUPABASE_ANON_KEY</code>.
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <Button
          variant="outline"
          onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
          Buka Supabase Dashboard
        </Button>
        <Button
          variant="ghost"
          onClick={() => window.location.reload()}
        >
          Muat Ulang
        </Button>
      </div>
      <p className="mt-4 text-xs text-navy-400">
        Panduan lengkap ada di <code>supabase/README.md</code>.
      </p>
    </div>
  )
}

export default SetupWarning