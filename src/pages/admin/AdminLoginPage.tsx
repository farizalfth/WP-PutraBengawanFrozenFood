import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react'
import Logo from '../../components/shared/Logo'
import { Snowfall, SnowflakeIcon } from '../../components/shared/Snowflakes'
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-navy-50 text-neutral-600">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-navy-800" />
        <p className="text-sm font-medium">Memeriksa profil...</p>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4 py-10">
      {/* Animated background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-royal-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,209,249,0.22),transparent_55%)]" />

      {/* Moving aurora blobs */}
      <div
        className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-ice-400/20 blur-3xl"
        style={{ animation: 'float-slow 12s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-royal-500/30 blur-3xl"
        style={{ animation: 'float-slow 14s ease-in-out infinite reverse' }}
      />
      <div
        className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-ice-300/10 blur-3xl"
        style={{ animation: 'float-slow 10s ease-in-out infinite' }}
      />

      {/* Spinning snowflake watermark */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 opacity-[0.06]">
        <SnowflakeIcon
          className="h-96 w-96 text-white"
          style={{ animation: 'spin-snow 30s linear infinite' }}
        />
      </div>
      <div className="pointer-events-none absolute -top-20 -left-20 opacity-[0.05]">
        <SnowflakeIcon
          className="h-72 w-72 text-white"
          style={{ animation: 'spin-snow 40s linear infinite reverse' }}
        />
      </div>

      <Snowfall count={20} />

      <div className="animate-fade-in-up relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          {/* Rotating glow ring behind the logo */}
          <div className="relative mb-5 flex h-24 w-24 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg, #00d1f9, #19409a, #00d1f9, #19409a, #00d1f9)',
                animation: 'spin-snow 8s linear infinite',
                filter: 'blur(14px)',
                opacity: 0.55,
              }}
            />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-navy-900/80 shadow-xl backdrop-blur">
              <SnowflakeIcon className="h-10 w-10 text-ice-300" />
            </div>
          </div>
          <Logo variant="light" size="lg" />
        </div>

        <div className="relative rounded-3xl p-px">
          {/* Gradient / animated border */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,209,249,0.8), rgba(25,64,154,0.4), rgba(0,209,249,0.6))',
              opacity: 0.7,
            }}
          />
          <div className="relative rounded-[calc(1.5rem-1px)] bg-white/95 p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="absolute -inset-1 rounded-full bg-ice-400/50 blur-md"
                  style={{ animation: 'float-slow 3s ease-in-out infinite' }}
                />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-ice-400 text-navy-950">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-xl font-extrabold text-black">
                  Masuk Dashboard
                </h1>
                <p className="text-xs text-neutral-600">
                  Khusus admin &amp; kasir
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-black">
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
                <label className="block text-sm font-semibold text-black">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-black"
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
        </div>

        <div className="mt-7 flex justify-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-navy-200 backdrop-blur transition-all duration-300 hover:border-ice-300/50 hover:bg-ice-400 hover:text-navy-950 hover:shadow-lg hover:shadow-ice-400/25"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage