import { useEffect, useMemo, useState } from 'react'
import { MessageSquareQuote, Pencil, Plus, RefreshCw, Star, Trash2 } from 'lucide-react'
import type { Testimonial } from '../../types'
import {
  createTestimonial,
  deleteTestimonial,
  listAllTestimonials,
  toggleTestimonial,
  updateTestimonial,
} from '../../services/testimonials'
import { useToast } from '../../stores/toastStore'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import StarRating from '../../components/ui/StarRating'
import { ImageUpload } from '../../components/admin/ImageUpload'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import {
  AdminPageHeader,
  AdminCard,
  TableShell,
  Th,
  Td,
  SearchInput,
} from '../../components/admin/AdminShared'
import { Field, Input, Textarea, StatusBadge } from '../../components/ui/FormControls'

interface FormState {
  id?: string
  name: string
  job: string
  message: string
  rating: number
  image_url: string | null
  is_active: boolean
}

const emptyForm: FormState = {
  name: '',
  job: '',
  message: '',
  rating: 5,
  image_url: null,
  is_active: true,
}

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [deleting, setDeleting] = useState(false)

  const toast = useToast()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const res = await listAllTestimonials()
    if (res.error) {
      setError('Gagal mengambil data testimoni.')
    } else {
      setItems(res.data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (t) => t.name.toLowerCase().includes(q) || t.message.toLowerCase().includes(q),
    )
  }, [items, query])

  const openCreate = () => {
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (t: Testimonial) => {
    setForm({
      id: t.id,
      name: t.name,
      job: t.job ?? '',
      message: t.message,
      rating: t.rating,
      image_url: t.image_url,
      is_active: t.is_active,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      toast.error('Nama dan komentar wajib diisi.')
      return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      job: form.job.trim() || null,
      message: form.message.trim(),
      rating: form.rating,
      image_url: form.image_url,
      is_active: form.is_active,
    }
    const res = form.id
      ? await updateTestimonial(form.id, payload)
      : await createTestimonial(payload)
    setSaving(false)
    if (res.error) {
      toast.error('Gagal menyimpan testimoni.')
      return
    }
    toast.success(form.id ? 'Testimoni berhasil diperbarui.' : 'Testimoni berhasil ditambahkan.')
    setModalOpen(false)
    fetchData()
  }

  const handleToggle = async (t: Testimonial) => {
    const res = await toggleTestimonial(t.id, !t.is_active)
    if (res.error) {
      toast.error('Gagal memperbarui status testimoni.')
      return
    }
    toast.success(t.is_active ? 'Testimoni dinonaktifkan.' : 'Testimoni diaktifkan.')
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteTestimonial(deleteTarget.id)
    setDeleting(false)
    if (res.error) {
      toast.error('Gagal menghapus testimoni.')
      return
    }
    toast.success('Testimoni berhasil dihapus.')
    setDeleteTarget(null)
    fetchData()
  }

  return (
    <div>
      <AdminPageHeader
        title="Testimoni"
        description="Kelola testimoni pelanggan."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Tambah Testimoni
          </Button>
        }
      />

      {loading && <Spinner label="Memuat testimoni..." />}

      {error && (
        <StateMessage
          icon={<MessageSquareQuote className="h-10 w-10" />}
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
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 p-4">
            <SearchInput value={query} onChange={setQuery} placeholder="Cari nama / komentar..." />
            <p className="text-xs font-semibold text-neutral-500">
              {filtered.length} testimoni
            </p>
          </div>

          {items.length === 0 ? (
            <StateMessage
              icon={<MessageSquareQuote className="h-10 w-10" />}
              title="Belum ada testimoni."
              description="Klik tombol Tambah Testimoni untuk mulai."
            />
          ) : (
            <TableShell>
              <thead>
                <tr>
                  <Th>Nama</Th>
                  <Th>Komentar</Th>
                  <Th>Rating</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-navy-50/40">
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-navy-50">
                          <ImageWithFallback
                            src={t.image_url}
                            alt={t.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-black">{t.name}</p>
                          <p className="text-xs text-neutral-500">{t.job || '-'}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="max-w-[280px]">
                      <p className="line-clamp-2 text-black">{t.message}</p>
                    </Td>
                    <Td>
                      <StarRating rating={t.rating} />
                    </Td>
                    <Td>
                      <button type="button" onClick={() => handleToggle(t)} title="Klik untuk ubah status">
                        <StatusBadge active={t.is_active} />
                      </button>
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          className="rounded-lg p-2 text-black transition-colors hover:bg-navy-100"
                          aria-label={`Edit ${t.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(t)}
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                          aria-label={`Hapus ${t.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </AdminCard>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id ? 'Edit Testimoni' : 'Tambah Testimoni'}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama" required>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama pelanggan"
              />
            </Field>
            <Field label="Pekerjaan">
              <Input
                value={form.job}
                onChange={(e) => setForm({ ...form, job: e.target.value })}
                placeholder="cth: Ibu Rumah Tangga"
              />
            </Field>
          </div>
          <Field label="Komentar" required>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Komentar pelanggan..."
            />
          </Field>
          <Field label="Rating">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  className="p-0.5"
                  aria-label={`Rating ${n}`}
                >
                  <Star
                    className={
                      n <= form.rating
                        ? 'h-7 w-7 fill-amber-400 text-amber-400'
                        : 'h-7 w-7 fill-navy-100 text-navy-100'
                    }
                  />
                </button>
              ))}
            </div>
          </Field>
          <ImageUpload
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            folder="testimonials"
            label="Foto Pelanggan"
          />
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy-100 bg-navy-50/40 px-3.5 py-3">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="h-4 w-4 rounded accent-navy-800"
            />
            <span className="text-sm font-semibold text-black">
              Tampilkan di website publik
            </span>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2 border-t border-navy-100 pt-4">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            {form.id ? 'Simpan Perubahan' : 'Tambah Testimoni'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Testimoni"
        description={`Yakin ingin menghapus testimoni dari "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}

export default AdminTestimonialsPage