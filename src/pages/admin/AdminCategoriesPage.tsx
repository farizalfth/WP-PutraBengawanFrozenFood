import { useEffect, useMemo, useState } from 'react'
import { FolderPlus, Pencil, Plus, RefreshCw, Tags, Trash2 } from 'lucide-react'
import type { Category } from '../../types'
import {
  createCategory,
  deleteCategory,
  listCategories,
  seedCategories,
  updateCategory,
} from '../../services/categories'
import { useToast } from '../../stores/toastStore'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import { ImageUpload } from '../../components/admin/ImageUpload'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import {
  AdminPageHeader,
  AdminCard,
  SearchInput,
} from '../../components/admin/AdminShared'
import { Field, Input, Textarea } from '../../components/ui/FormControls'
import { cn } from '../../lib/utils'

interface FormState {
  id?: string
  name: string
  description: string
  image_url: string | null
}

const emptyForm: FormState = { name: '', description: '', image_url: null }

const suggestedCategories = [
  { name: 'Nugget', description: 'Nugget ayam dan varian nugget siap masak' },
  { name: 'Sosis', description: 'Sosis sapi dan ayam berbagai rasa' },
  { name: 'Saus Mayones', description: 'Mayones dan saus pelengkap siap pakai' },
  { name: 'Bakso & Olahan', description: 'Bakso serta olahan daging siap saji' },
  { name: 'Dimsum', description: 'Dimsum dan siomay siap kukus' },
  { name: 'Kebab', description: 'Kebab cepat saji siap panaskan' },
  { name: 'Kentang', description: 'Kentang goreng dan olahan kentang' },
  { name: 'Olahan Ayam', description: 'Olahan ayam siap masak' },
  { name: 'Cemilan & Kue', description: 'Cemilan beku dan kue siap saji' },
]

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [seeding, setSeeding] = useState(false)

  const toast = useToast()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const res = await listCategories()
    if (res.error) {
      setError('Gagal mengambil data kategori.')
    } else {
      setCategories(res.data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, query])

  const openCreate = () => {
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (c: Category) => {
    setForm({
      id: c.id,
      name: c.name,
      description: c.description ?? '',
      image_url: c.image_url,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Nama kategori wajib diisi.')
      return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url,
    }
    const res = form.id
      ? await updateCategory(form.id, payload)
      : await createCategory(payload)
    setSaving(false)
    if (res.error) {
      toast.error('Gagal menyimpan kategori.')
      return
    }
    toast.success(form.id ? 'Kategori berhasil diperbarui.' : 'Kategori berhasil ditambahkan.')
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteCategory(deleteTarget.id)
    setDeleting(false)
    if (res.error) {
      toast.error(
        res.error.includes('foreign key')
          ? 'Kategori tidak dapat dihapus karena masih dipakai produk.'
          : 'Gagal menghapus kategori.',
      )
      setDeleteTarget(null)
      return
    }
    toast.success('Kategori berhasil dihapus.')
    setDeleteTarget(null)
    fetchData()
  }

  const handleSeed = async () => {
    setSeeding(true)
    const res = await seedCategories(suggestedCategories)
    setSeeding(false)
    if (res.error) {
      toast.error(`Gagal menambahkan kategori default: ${res.error}`)
      return
    }
    toast.success(
      res.added > 0
        ? `${res.added} kategori default berhasil ditambahkan.`
        : 'Semua kategori default sudah ada.',
    )
    fetchData()
  }

  return (
    <div>
      <AdminPageHeader
        title="Kategori"
        description="Kelola kategori produk."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handleSeed} loading={seeding}>
              <FolderPlus className="h-4 w-4" /> Pasang Kategori Default
            </Button>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Tambah Kategori
            </Button>
          </div>
        }
      />

      {loading && <Spinner label="Memuat kategori..." />}

      {error && (
        <StateMessage
          icon={<Tags className="h-10 w-10" />}
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
            <SearchInput value={query} onChange={setQuery} placeholder="Cari kategori..." />
            <p className="text-xs font-semibold text-neutral-500">
              {filtered.length} kategori
            </p>
          </div>

          {categories.length === 0 ? (
            <StateMessage
              icon={<Tags className="h-10 w-10" />}
              title="Belum ada kategori."
              description="Klik tombol Tambah Kategori untuk mulai."
            />
          ) : (
            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl border border-navy-50 bg-navy-50/30 p-3"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                    <ImageWithFallback
                      src={c.image_url}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-black">
                      {c.name}
                    </p>
                    <p className="line-clamp-1 text-xs text-neutral-500">
                      {c.description || 'Tidak ada deskripsi'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="rounded-lg p-2 text-black transition-colors hover:bg-navy-100"
                      aria-label={`Edit ${c.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(c)}
                      className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                      aria-label={`Hapus ${c.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id ? 'Edit Kategori' : 'Tambah Kategori'}
        size="md"
      >
        <div className="space-y-4">
          {!form.id && (
            <div>
              <p className="mb-1.5 text-sm font-semibold text-black">
                Pilih Cepat
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedCategories.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        name: s.name,
                        description: s.description,
                      })
                    }
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                      form.name === s.name
                        ? 'border-royal-500 bg-royal-600 text-white'
                        : 'border-navy-200 bg-white text-navy-700 hover:border-royal-300 hover:bg-royal-50',
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-neutral-500">
                Klik salah satu untuk mengisi form kategori secara otomatis.
              </p>
            </div>
          )}
          <Field label="Nama Kategori" required>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="cth: Nugget"
            />
          </Field>
          <Field label="Deskripsi">
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Deskripsi singkat kategori..."
            />
          </Field>
          <ImageUpload
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            folder="categories"
            label="Foto Kategori"
          />
        </div>
        <div className="mt-6 flex justify-end gap-2 border-t border-navy-100 pt-4">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            {form.id ? 'Simpan Perubahan' : 'Tambah Kategori'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Kategori"
        description={`Yakin ingin menghapus kategori "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}

export default AdminCategoriesPage