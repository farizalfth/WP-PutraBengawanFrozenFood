import { useState, type FormEvent } from 'react'
import { KeyRound, Mail, Save, UserRound } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from '../../stores/toastStore'
import { changeEmail, updatePassword } from '../../services/auth'
import { updateProfileName } from '../../services/profiles'
import { Button } from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/FormControls'
import {
  AdminPageHeader,
  AdminCard,
} from '../../components/admin/AdminShared'

export function AdminAccountPage() {
  const profile = useAuthStore((s) => s.profile)
  const session = useAuthStore((s) => s.session)
  const refreshProfile = useAuthStore((s) => s.refreshProfile)
  const toast = useToast()

  const [name, setName] = useState(profile?.name ?? '')
  const [savingName, setSavingName] = useState(false)

  const [newEmail, setNewEmail] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [emailInfo, setEmailInfo] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const currentEmail = session?.user?.email ?? profile?.email ?? '-'

  const handleSaveName = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Nama tidak boleh kosong.')
      return
    }
    if (!profile) return
    setSavingName(true)
    const res = await updateProfileName(profile.user_id, name.trim())
    setSavingName(false)
    if (res.error) {
      toast.error('Gagal menyimpan nama.')
      return
    }
    await refreshProfile()
    toast.success('Nama berhasil diperbarui.')
  }

  const handleChangeEmail = async (e: FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim()) {
      toast.error('Email baru wajib diisi.')
      return
    }
    setEmailInfo(null)
    setSavingEmail(true)
    const res = await changeEmail(newEmail.trim())
    setSavingEmail(false)
    if (res.error) {
      toast.error('Gagal mengganti email.')
      return
    }
    setNewEmail('')
    if (res.needsConfirmation) {
      const msg =
        'Link konfirmasi dikirim ke email baru. Klik link tersebut untuk menyelesaikan perubahan email.'
      toast.success(msg)
      setEmailInfo(msg)
    }
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      toast.error('Kata sandi minimal 6 karakter.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak sama.')
      return
    }
    setSavingPassword(true)
    const res = await updatePassword(newPassword)
    setSavingPassword(false)
    if (res.error) {
      toast.error('Gagal mengganti kata sandi.')
      return
    }
    setNewPassword('')
    setConfirmPassword('')
    toast.success('Kata sandi berhasil diubah.')
  }

  return (
    <div>
      <AdminPageHeader
        title="Akun"
        description="Kelola nama, email, dan kata sandi akun Anda tanpa menyentuh database."
      />

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <AdminCard>
          <div className="border-b border-navy-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-black">
              <UserRound className="h-4.5 w-4.5 text-royal-600" />
              Nama
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              Nama yang tampil di dashboard &amp; menu.
            </p>
          </div>
          <form onSubmit={handleSaveName} className="space-y-4 p-5">
            <Field label="Nama" required>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
              />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" size="sm" loading={savingName}>
                <Save className="h-4 w-4" />
                Simpan Nama
              </Button>
            </div>
          </form>
        </AdminCard>

        <AdminCard>
          <div className="border-b border-navy-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-black">
              <Mail className="h-4.5 w-4.5 text-royal-600" />
              Email (Username)
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              Email dipakai untuk login &amp; verifikasi reset kata sandi.
            </p>
          </div>
          <form onSubmit={handleChangeEmail} className="space-y-4 p-5">
            <div className="rounded-xl bg-navy-50 px-3.5 py-2.5 text-sm">
              <span className="font-semibold text-neutral-500">Email saat ini:</span>{' '}
              <span className="font-bold text-black">{currentEmail}</span>
            </div>
            <Field label="Email Baru">
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nama_baru@perusahaan.com"
                autoComplete="email"
              />
            </Field>
            {emailInfo && (
              <p className="rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
                {emailInfo}
              </p>
            )}
            <div className="flex justify-end">
              <Button type="submit" size="sm" loading={savingEmail}>
                <Save className="h-4 w-4" />
                Ganti Email
              </Button>
            </div>
          </form>
        </AdminCard>

        <AdminCard className="lg:col-span-2">
          <div className="border-b border-navy-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-black">
              <KeyRound className="h-4.5 w-4.5 text-royal-600" />
              Ganti Kata Sandi
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              Kata sandi baru akan langsung aktif untuk login berikutnya.
            </p>
          </div>
          <form onSubmit={handleChangePassword} className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Kata Sandi Baru" required>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
              />
            </Field>
            <Field label="Konfirmasi Kata Sandi" required>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                autoComplete="new-password"
              />
            </Field>
            <div className="flex justify-end sm:col-span-2">
              <Button type="submit" size="sm" loading={savingPassword}>
                <KeyRound className="h-4 w-4" />
                Ganti Kata Sandi
              </Button>
            </div>
          </form>
        </AdminCard>
      </div>
    </div>
  )
}

export default AdminAccountPage