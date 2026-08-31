import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react'
import Logo from '../../components/shared/Logo'
import { Snowfall } from '../../components/shared/Snowflakes'
import { useAuthStore } from '../../stores/authStore'
import { Input } from '../../components/ui/FormControls'
import { Button } from '../../components/ui/Button'
import { isSupabaseConfigured } from '../../services/supabase'
import { SetupWarning } from '../../components/shared/SetupWarning'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const session = useAuthStore((s) => s.session)
  const profile = useAuthStore((s) => s.profile)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from

  useEffect(() => {
    if (!session?.user) return
    if (!profile) return
    const target =
      profile.role === 'admin'
        ? from?.startsWith('/admin') || from === '/kasir'
          ? from
          : '/admin'
        : '/kasir'
    navigate(target, { replace: true })
  }, [session, profile, navigate, from])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi.')
      return
    }
    setSubmitting(true)
    setError(null)
    const result = await login(email.trim(), password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 p-6">
        <SetupWarning />
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-navy-50 text-navy-500">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-navy-800" />
        <p className="text-sm font-medium">Memeriksa profil...</p>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-royal-900 px-4 py-10">
      <Snowfall count={16} />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo variant="light" size="lg" />
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/95 p-8 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold text-navy-900">
                Masuk Dashboard
              </h1>
              <p className="text-xs text-navy-500">
                Khusus admin &amp; kasir
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-navy-800">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-navy-800">
                Kata Sandi
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 transition-colors hover:text-navy-700"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              {!submitting && <LogIn className="h-4 w-4" />}
              Masuk
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-navy-200">
          Kembali ke{' '}
          <Link to="/" className="font-semibold text-white underline">
            halaman utama
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AdminLoginPage