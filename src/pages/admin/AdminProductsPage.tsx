import { useEffect, useMemo, useState } from 'react'
import {
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Snowflake,
  Trash2,
} from 'lucide-react'
import type { Category, Product } from '../../types'
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from '../../services/products'
import { listCategories } from '../../services/categories'
import { formatRupiah } from '../../utils/format'
import { useToast } from '../../stores/toastStore'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { ImageUpload } from '../../components/admin/ImageUpload'
import {
  AdminPageHeader,
  AdminCard,
  TableShell,
  Th,
  Td,
  SearchInput,
} from '../../components/admin/AdminShared'
import { Field, Input, Select, Textarea, Badge } from '../../components/ui/FormControls'

interface FormState {
  id?: string
  name: string
  barcode: string
  category_id: string
  price: string
  stock: string
  description: string
  image_url: string | null
  is_best_seller: boolean
}

const emptyForm: FormState = {
  name: '',
  barcode: '',
  category_id: '',
  price: '',
  stock: '',
  description: '',
  image_url: null,
  is_best_seller: false,
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  const toast = useToast()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const [pRes, cRes] = await Promise.all([listProducts(), listCategories()])
    if (pRes.error || cRes.error) {
      setError('Gagal mengambil data produk atau kategori.')
    } else {
      setProducts(pRes.data ?? [])
      setCategories(cRes.data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        (p.categories?.name ?? '').toLowerCase().includes(q),
    )
  }, [products, query])

  const openCreate = () => {
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      barcode: p.barcode,
      category_id: p.category_id ?? '',
      price: String(p.price),
      stock: String(p.stock),
      description: p.description ?? '',
      image_url: p.image_url,
      is_best_seller: p.is_best_seller,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Nama produk wajib diisi.')
      return
    }
    if (!form.barcode.trim()) {
      toast.error('Barcode wajib diisi.')
      return
    }
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (Number.isNaN(price) || price < 0) {
      toast.error('Harga tidak valid.')
      return
    }
    if (Number.isNaN(stock) || stock < 0) {
      toast.error('Stok tidak valid.')
      return
    }

    setSaving(true)
    const payload = {
      name: form.name.trim(),
      barcode: form.barcode.trim(),
      category_id: form.category_id || null,
      price,
      stock,
      description: form.description.trim() || null,
      image_url: form.image_url,
      is_best_seller: form.is_best_seller,
    }
    const res = form.id
      ? await updateProduct(form.id, payload)
      : await createProduct(payload)

    setSaving(false)

    if (res.error) {
      toast.error(res.error.includes('duplicate') || res.error.includes('unique')
        ? 'Barcode sudah digunakan produk lain.'
        : 'Gagal menyimpan produk.')
      return
    }
    toast.success(form.id ? 'Produk berhasil diperbarui.' : 'Produk berhasil ditambahkan.')
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await deleteProduct(deleteTarget.id)
    setDeleting(false)
    if (res.error) {
      toast.error('Gagal menghapus produk.')
      return
    }
    toast.success('Produk berhasil dihapus.')
    setDeleteTarget(null)
    fetchData()
  }

  return (
    <div>
      <AdminPageHeader
        title="Produk"
        description="Kelola katalog produk toko."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Tambah Produk
          </Button>
        }
      />

      {loading && <Spinner label="Memuat produk..." />}

      {error && (
        <StateMessage
          icon={<Package className="h-10 w-10" />}
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
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Cari nama, barcode, kategori..."
            />
            <p className="text-xs font-semibold text-neutral-500">
              {filtered.length} produk
            </p>
          </div>

          {products.length === 0 ? (
            <StateMessage
              icon={<Package className="h-10 w-10" />}
              title="Belum ada produk."
              description="Klik tombol Tambah Produk untuk mulai."
            />
          ) : (
            <TableShell>
              <thead>
                <tr>
                  <Th>Produk</Th>
                  <Th>Barcode</Th>
                  <Th>Kategori</Th>
                  <Th>Harga</Th>
                  <Th>Stok</Th>
                  <Th>Best</Th>
                  <Th className="text-right">Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-navy-50/40">
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-navy-50">
                          <ImageWithFallback
                            src={p.image_url}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="line-clamp-1 max-w-[200px] font-semibold text-black">
                          {p.name}
                        </span>
                      </div>
                    </Td>
                    <Td className="font-mono text-xs">{p.barcode}</Td>
                    <Td>{p.categories?.name ?? '-'}</Td>
                    <Td className="font-semibold">{formatRupiah(p.price)}</Td>
                    <Td>
                      <Badge
                        className={
                          p.stock <= 0
                            ? 'bg-red-100 text-red-700'
                            : p.stock <= 10
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                        }
                      >
                        {p.stock}
                      </Badge>
                    </Td>
                    <Td>
                      {p.is_best_seller ? (
                        <Badge className="bg-amber-100 text-amber-700">
                          <Snowflake className="h-3 w-3" /> Best
                        </Badge>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="rounded-lg p-2 text-black transition-colors hover:bg-navy-100"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                          aria-label={`Hapus ${p.name}`}
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
        title={form.id ? 'Edit Produk' : 'Tambah Produk'}
        subtitle="Lengkapi informasi produk di bawah ini."
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama Produk" required>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="cth: Kanzler Single Original 65 gr"
            />
          </Field>
          <Field label="Barcode" required hint="Kode barcode unik produk">
            <Input
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value.replace(/[^0-9]/g, '') })}
              placeholder="8991234567890"
              inputMode="numeric"
            />
          </Field>
          <Field label="Kategori">
            <Select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">Pilih kategori...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga (Rp)" required>
              <Input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="8000"
              />
            </Field>
            <Field label="Stok" required>
              <Input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="100"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Deskripsi">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Deskripsi singkat produk..."
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <ImageUpload
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              folder="products"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy-100 bg-navy-50/40 px-3.5 py-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.is_best_seller}
              onChange={(e) =>
                setForm({ ...form, is_best_seller: e.target.checked })
              }
              className="h-4 w-4 rounded accent-navy-800"
            />
            <span className="text-sm font-semibold text-black">
              Tandai sebagai Best Seller
            </span>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-navy-100 pt-4">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            {form.id ? 'Simpan Perubahan' : 'Tambah Produk'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Produk"
        description={`Yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}

export default AdminProductsPage