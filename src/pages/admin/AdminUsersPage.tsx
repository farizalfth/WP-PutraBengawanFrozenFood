import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react'
import type { Profile } from '../../types'
import {
  deleteProfile,
  inviteUser,
  listProfiles,
  updateProfileRole,
} from '../../services/profiles'
import { useAuthStore } from '../../stores/authStore'
import { formatDate } from '../../utils/format'
import { useToast } from '../../stores/toastStore'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import {
  AdminPageHeader,
  AdminCard,
  TableShell,
  Th,
  Td,
} from '../../components/admin/AdminShared'
import { Field, Input, Select } from '../../components/ui/FormControls'

interface InviteForm {
  email: string
  name: string
  role: 'admin' | 'cashier'
}

const emptyInvite: InviteForm = { email: '', name: '', role: 'cashier' }

export function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const me = useAuthStore((s) => s.profile)
  const toast = useToast()

  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState<InviteForm>(emptyInvite)
  const [inviting, setInviting] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const res = await listProfiles()
    if (res.error) {
      setError('Gagal mengambil data pengguna.')
    } else {
      setProfiles(res.data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const sorted = useMemo(
    () => [...profiles].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [profiles],
  )

  const handleInvite = async () => {
    if (!inviteForm.email.trim() || !inviteForm.name.trim()) {
      toast.error('Email dan nama wajib diisi.')
      return
    }
    setInviting(true)
    const res = await inviteUser(
      inviteForm.email.trim(),
      inviteForm.name.trim(),
      inviteForm.role,
    )
    setInviting(false)
    if (res.error) {
      toast.error('Gagal mengundang pengguna.')
      return
    }
    toast.success('Undangan berhasil dikirim ke email pengguna.')
    setInviteOpen(false)
    setInviteForm(emptyInvite)
    fetchData()
  }

  const handleRoleChange = async (p: Profile, role: 'admin' | 'cashier') => {
    if (role === p.role) return
    if (p.id === me?.id) {
      toast.error('Tidak dapat mengubah role diri sendiri.')
      return
    }
    const res = await updateProfileRole(p.user_id, role)
    if (res.error) {
      toast.error('Gagal mengubah role pengguna.')
      return
    }
    toast.success(`Role ${p.name} diubah menjadi ${role}.`)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    if (deleteTarget.id === me?.id) {
      toast.error('Tidak dapat menghapus akun sendiri.')
      setDeleteTarget(null)
      return
    }
    setDeleting(true)
    const res = await deleteProfile(deleteTarget.user_id)
    setDeleting(false)
    if (res.error) {
      toast.error('Gagal menghapus pengguna.')
      return
    }
    toast.success('Pengguna berhasil dihapus.')
    setDeleteTarget(null)
    fetchData()
  }

  return (
    <div>
      <AdminPageHeader
        title="Pengguna"
        description="Kelola akun admin dan kasir."
        action={
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" /> Undang Pengguna
          </Button>
        }
      />

      {loading && <Spinner label="Memuat pengguna..." />}

      {error && (
        <StateMessage
          icon={<Users className="h-10 w-10" />}
          title={error}
          action={
            <Button variant="outline" size="sm" onClick={fetchData}>
              <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
            </Button>
          }
        />
      )}

      {!loading && !error && (
        <AdminCard>
          {profiles.length === 0 ? (
            <StateMessage
              icon={<Users className="h-10 w-10" />}
              title="Belum ada pengguna."
              description="Undang pengguna pertama untuk mulai."
            />
          ) : (
            <TableShell>
              <thead>
                <tr>
                  <Th>Nama</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Bergabung</Th>
                  <Th className="text-right">Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-navy-50/40">
                    <Td className="font-semibold text-black">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white">
                          {(p.name || '?').charAt(0).toUpperCase()}
                        </span>
                        {p.name}
                        {p.id === me?.id && (
                          <span className="text-xs font-medium text-neutral-500">
                            (Anda)
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td className="text-neutral-600">{p.email || '-'}</Td>
                    <Td>
                      <Select
                        value={p.role}
                        onChange={(e) =>
                          handleRoleChange(p, e.target.value as 'admin' | 'cashier')
                        }
                        disabled={p.id === me?.id}
                        className="w-28 py-1.5 text-xs"
                      >
                        <option value="admin">Admin</option>
                        <option value="cashier">Kasir</option>
                      </Select>
                    </Td>
                    <Td className="text-xs text-neutral-600">{formatDate(p.created_at)}</Td>
                    <Td className="text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(p)}
                        disabled={p.id === me?.id}
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Hapus ${p.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </AdminCard>
      )}

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Undang Pengguna"
        subtitle="Pengguna akan menerima email undangan untuk mengatur kata sandi."
        size="md"
      >
        <div className="space-y-4">
          <Field label="Nama" required>
            <Input
              value={inviteForm.name}
              onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              placeholder="Nama lengkap"
            />
          </Field>
          <Field label="Email" required>
            <Input
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              placeholder="nama@perusahaan.com"
            />
          </Field>
          <Field label="Role">
            <Select
              value={inviteForm.role}
              onChange={(e) =>
                setInviteForm({
                  ...inviteForm,
                  role: e.target.value as 'admin' | 'cashier',
                })
              }
            >
              <option value="cashier">Kasir</option>
              <option value="admin">Admin</option>
            </Select>
          </Field>
          <div className="flex items-start gap-2 rounded-xl bg-navy-50 px-3.5 py-3 text-xs text-neutral-600">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-black" />
            Role &amp; izin diverifikasi melalui database (RLS) di sisi Supabase.
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2 border-t border-navy-100 pt-4">
          <Button variant="outline" onClick={() => setInviteOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleInvite} loading={inviting}>
            <UserPlus className="h-4 w-4" /> Kirim Undangan
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Pengguna"
        description={`Yakin ingin menghapus "${deleteTarget?.name}"? Akun dan profil akan dihapus permanen.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}

export default AdminUsersPage