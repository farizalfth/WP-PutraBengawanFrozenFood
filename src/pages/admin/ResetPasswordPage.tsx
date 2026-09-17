import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from 'lucide-react'
import { Snowfall, SnowflakeIcon } from '../../components/shared/Snowflakes'
import { useAuthStore } from '../../stores/authStore'
import { Input } from '../../components/ui/FormControls'
import { Button } from '../../components/ui/Button'
import { isSupabaseConfigured } from '../../services/supabase'
import { signOut, updatePassword } from '../../services/auth'
import { SetupWarning } from '../../components/shared/SetupWarning'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const initialized = useAuthStore((s) => s.initialized)
  const session = useAuthStore((s) => s.session)

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const linkInvalid = initialized && !session?.user && !done

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.')
      return
    }
    if (password !== confirm) {
      setError('Konfirmasi kata sandi tidak sama.')
      return
    }
    setSubmitting(true)
    setError(null)
    const res = await updatePassword(password)
    if (res.error) {
      setSubmitting(false)
      setError(res.error)
      return
    }
    await signOut()
    setSubmitting(false)
    setDone(true)
  }

  const handleLogin = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 p-6">
        <SetupWarning />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4 py-10">
      <div className="absolute inset-0 bg-gradient-to-br from-royal-950 via-navy-950 to-royal-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,209,249,0.22),transparent_55%)]" />

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
          <p className="font-display text-lg font-extrabold text-white">
            PUTRA BENGAWAN
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-ice-300">
            Atur Ulang Kata Sandi
          </p>
        </div>

        <div className="relative rounded-3xl p-px">
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,209,249,0.8), rgba(25,64,154,0.4), rgba(0,209,249,0.6))',
              opacity: 0.7,
            }}
          />
          <div className="relative rounded-[calc(1.5rem-1px)] bg-white/95 p-8 shadow-2xl backdrop-blur">
            {!initialized ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-navy-800" />
                <p className="text-sm font-medium text-neutral-600">
                  Memeriksa link reset...
                </p>
              </div>
            ) : linkInvalid ? (
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <KeyRound className="h-7 w-7 text-red-600" />
                </div>
                <h1 className="mt-4 font-display text-xl font-extrabold text-black">
                  Link Tidak Valid
                </h1>
                <p className="mt-1 text-sm text-neutral-600">
                  Link reset tidak valid atau sudah kedaluwarsa. Silakan minta
                  link baru di halaman login.
                </p>
                <Link
                  to="/admin/login"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-royal-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-royal-700"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Minta Link Baru
                </Link>
              </div>
            ) : done ? (
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <h1 className="mt-4 font-display text-xl font-extrabold text-black">
                  Kata Sandi Berhasil Diubah
                </h1>
                <p className="mt-1 text-sm text-neutral-600">
                  Silakan masuk kembali dengan kata sandi baru Anda.
                </p>
                <Button
                  size="lg"
                  className="mt-6 w-full"
                  onClick={handleLogin}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Masuk ke Dashboard
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="absolute -inset-1 rounded-full bg-ice-400/50 blur-md"
                      style={{ animation: 'float-slow 3s ease-in-out infinite' }}
                    />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-ice-400 text-navy-950">
                      <KeyRound className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h1 className="font-display text-xl font-extrabold text-black">
                      Buat Kata Sandi Baru
                    </h1>
                    <p className="text-xs text-neutral-600">
                      Masukkan kata sandi baru untuk akun Anda
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-black">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        autoComplete="new-password"
                        className="pr-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-black"
                        aria-label="Tampilkan kata sandi"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-black">
                      Konfirmasi Kata Sandi
                    </label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      autoComplete="new-password"
                      required
                    />
                  </div>

                  {error && (
                    <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    loading={submitting}
                  >
                    Simpan Kata Sandi
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="mt-7 flex justify-center">
          <Link
            to="/admin/login"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-navy-200 backdrop-blur transition-all duration-300 hover:border-ice-300/50 hover:bg-ice-400 hover:text-navy-950 hover:shadow-lg hover:shadow-ice-400/25"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage