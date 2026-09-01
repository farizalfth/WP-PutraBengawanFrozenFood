import { Suspense, lazy, useMemo, useState } from 'react'
import {
  Barcode,
  Camera,
  CheckCircle2,
  Minus,
  PackageSearch,
  Plus,
  ReceiptText,
  ScanLine,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react'
import type { Transaction, TransactionItem } from '../../types'
import { listProducts } from '../../services/products'
import { createTransaction } from '../../services/transactions'
import { useAsyncData } from '../../hooks/useAsyncData'
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from '../../stores/toastStore'
import { formatNumber, formatRupiah, generateInvoiceNumber } from '../../utils/format'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import { Receipt, ReceiptFooter } from '../../components/cashier/Receipt'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { getProductByBarcode } from '../../services/products'

const CameraScanner = lazy(() =>
  import('../../components/cashier/CameraScanner').then((m) => ({
    default: m.CameraScanner,
  })),
)

export function CashierPage() {
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const increment = useCartStore((s) => s.increment)
  const decrement = useCartStore((s) => s.decrement)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clear = useCartStore((s) => s.clear)

  const profile = useAuthStore((s) => s.profile)
  const toast = useToast()

  const [manualBarcode, setManualBarcode] = useState('')
  const [lastProduct, setLastProduct] = useState<string | null>(null)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Produk hasil scan / dipilih yang akan ditampilkan detailnya (input nama, harga, kategori, dll)
  const [selectedProduct, setSelectedProduct] = useState<
    NonNullable<typeof products>[number] | null
  >(null)
  const [scanQty, setScanQty] = useState(1)

  const { data: products, loading, error } = useAsyncData(listProducts)

  const handleAddScanProduct = () => {
    if (!selectedProduct) return
    if (selectedProduct.stock <= 0) {
      toast.error(`Stok ${selectedProduct.name} habis.`)
      return
    }
    const res = addItem(selectedProduct)
    if (!res.ok) {
      toast.error(res.message)
      return
    }
    if (scanQty > 1) {
      setQuantity(selectedProduct.id, Math.min(scanQty, selectedProduct.stock))
    }
    setLastProduct(selectedProduct.name)
    setLookupError(null)
    toast.success(`${scanQty} x ${selectedProduct.name} ditambahkan ke keranjang.`)
  }

  const handleBarcode = async (barcode: string) => {
    setManualBarcode('')
    setLookupError(null)
    const { data: product, error: err } = await getProductByBarcode(barcode)
    if (err || !product) {
      setLookupError(`Produk dengan barcode ${barcode} tidak ditemukan.`)
      setLastProduct(null)
      setSelectedProduct(null)
      toast.error('Barcode tidak ditemukan.')
      return
    }
    setSelectedProduct(product)
    setScanQty(1)
    setLookupError(null)
    setLastProduct(null)
  }

  const { submitManual } = useBarcodeScanner(handleBarcode)

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualBarcode.trim()) return
    const ok = submitManual(manualBarcode)
    if (!ok) {
      toast.error('Barcode tidak valid (minimal 6 digit angka).')
    }
  }

  const filteredProducts = useMemo(() => {
    if (!products) return []
    const q = searchQuery.trim().toLowerCase()
    if (!q) return products.slice(0, 24)
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        (p.categories?.name ?? '').toLowerCase().includes(q),
    )
  }, [products, searchQuery])

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const [payment, setPayment] = useState('')
  const paymentNumber = Number(payment) || 0
  const change = paymentNumber - total

  // Checkout state
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [paidTransaction, setPaidTransaction] = useState<{
    transaction: Transaction
    items: TransactionItem[]
  } | null>(null)

  const openCheckout = () => {
    if (items.length === 0) {
      toast.info('Keranjang masih kosong.')
      return
    }
    setPayment(String(total))
    setCheckoutOpen(true)
  }

  const handlePay = async () => {
    if (paymentNumber < total) {
      toast.error(`Uang dibayar kurang dari total (${formatRupiah(total)}).`)
      return
    }
    if (!profile) {
      toast.error('Sesi kasir tidak ditemukan. Login ulang.')
      return
    }

    setCheckoutLoading(true)
    const invoice = generateInvoiceNumber()
    const res = await createTransaction({
      invoice_number: invoice,
      cashier_id: profile.id,
      total_amount: total,
      payment_amount: paymentNumber,
      change_amount: paymentNumber - total,
      items: items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
        subtotal: i.product.price * i.quantity,
      })),
    })
    setCheckoutLoading(false)

    if (res.error) {
      toast.error(
        res.error.toLowerCase().includes('stok')
          ? 'Stok produk tidak mencukupi. Periksa kembali keranjang.'
          : 'Transaksi gagal diproses.',
      )
      return
    }

    setPaidTransaction({
      transaction: res.data!,
      items: items.map((i) => ({
        id: '',
        transaction_id: res.data!.id,
        product_id: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
        subtotal: i.product.price * i.quantity,
        products: { id: i.product.id, name: i.product.name, barcode: i.product.barcode },
      })),
    })
    setCheckoutOpen(false)
    clear()
    setPayment('')
  }

  const handleClosePaid = () => {
    setPaidTransaction(null)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* ===================== LEFT ===================== */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-royal-100 text-royal-600">
                <ScanLine className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold leading-tight text-black">Scan Barcode</h2>
                <p className="text-[11px] text-neutral-500">Pindai produk untuk menambah ke keranjang</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCameraOpen(true)}
            >
              <Camera className="h-4 w-4" />
              Scan dengan Kamera
            </Button>
          </div>

          <form onSubmit={handleManualSubmit} className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Barcode className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-neutral-500" />
              <input
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Ketik / scan barcode lalu Enter..."
                inputMode="numeric"
                autoFocus
                className="w-full rounded-xl border border-navy-200 bg-navy-50/40 py-3 pl-11 pr-3 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-royal-500 focus:bg-white focus:ring-2 focus:ring-navy-100"
              />
            </div>
            <Button type="submit" variant="secondary">
              Tambah
            </Button>
          </form>

          {lookupError && (
            <p className="mt-2 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-medium text-red-700">
              {lookupError}
            </p>
          )}
          {lastProduct && !lookupError && (
            <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              {lastProduct} ditambahkan ke keranjang.
            </p>
          )}
          <p className="mt-2 text-[11px] text-neutral-500">
            Scanner USB: arahkan ke barcode lalu Enter. Barcode yang sama akan menambah kuantitas.
          </p>

          {selectedProduct && (
            <div className="mt-4 rounded-xl border border-navy-200 bg-navy-50/60 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-navy-700">
                <ScanLine className="h-3.5 w-3.5" /> Detail Produk Hasil Scan
              </p>
              <div className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                  <ImageWithFallback
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <label className="block">
                    <span className="text-[10px] font-semibold uppercase text-neutral-500">Nama Produk</span>
                    <input
                      value={selectedProduct.name}
                      readOnly
                      className="w-full rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-black outline-none"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="text-[10px] font-semibold uppercase text-neutral-500">Barcode</span>
                      <input
                        value={selectedProduct.barcode}
                        readOnly
                        className="w-full rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs font-mono text-black outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-semibold uppercase text-neutral-500">Kategori</span>
                      <input
                        value={selectedProduct.categories?.name ?? 'Tanpa Kategori'}
                        readOnly
                        className="w-full rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs text-black outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-semibold uppercase text-neutral-500">Harga</span>
                      <input
                        value={formatRupiah(selectedProduct.price)}
                        readOnly
                        className="w-full rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 text-xs font-bold text-black outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-semibold uppercase text-neutral-500">Stok</span>
                      <input
                        value={selectedProduct.stock <= 0 ? 'Habis' : `${selectedProduct.stock}`}
                        readOnly
                        className={`w-full rounded-lg border bg-white px-2.5 py-1.5 text-xs font-semibold outline-none ${
                          selectedProduct.stock <= 0
                            ? 'border-red-200 text-red-600'
                            : 'border-navy-200 text-emerald-700'
                        }`}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setScanQty((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 bg-white text-black hover:bg-navy-50"
                    aria-label="Kurangi"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={selectedProduct.stock}
                    value={scanQty}
                    onChange={(e) => {
                      const v = Math.max(1, Number(e.target.value) || 1)
                      setScanQty(Math.min(v, selectedProduct.stock))
                    }}
                    className="w-14 rounded-lg border border-navy-200 bg-white py-1.5 text-center text-sm font-bold text-black outline-none focus:border-navy-500"
                  />
                  <button
                    type="button"
                    onClick={() => setScanQty((q) => Math.min(selectedProduct.stock, q + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 bg-white text-black hover:bg-navy-50"
                    aria-label="Tambah"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  onClick={handleAddScanProduct}
                  disabled={selectedProduct.stock <= 0}
                  className="flex-1"
                  variant="secondary"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Tambah ke Keranjang
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 text-navy-800">
                <PackageSearch className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold leading-tight text-black">Cari &amp; Tambah Produk</h2>
                <p className="text-[11px] text-neutral-500">Pilih produk untuk melihat detail</p>
              </div>
            </div>
            <div className="relative w-56 max-w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  const q = e.target.value.trim().toLowerCase()
                  setSelectedProduct(
                    q && products
                      ? products.find(
                          (p) =>
                            p.name.toLowerCase().includes(q) ||
                            p.barcode.toLowerCase().includes(q) ||
                            (p.categories?.name ?? '').toLowerCase().includes(q),
                        ) ?? null
                      : selectedProduct,
                  )
                }}
                placeholder="Cari nama / barcode / kategori..."
                className="w-full rounded-xl border border-navy-200 bg-white py-2 pl-9 pr-3 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
              />
            </div>
          </div>

          {loading && <Spinner label="Memuat produk..." />}

          {error && (
            <StateMessage
              icon={<PackageSearch className="h-10 w-10" />}
              title={error}
            />
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="mt-4 max-h-[520px] space-y-2 overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 rounded-xl border p-2.5 transition-colors ${
                      p.stock <= 0
                        ? 'border-navy-100 opacity-60'
                        : 'border-navy-100 hover:border-navy-400 hover:bg-navy-50/60'
                    } ${selectedProduct?.id === p.id ? 'border-navy-500 ring-1 ring-navy-200' : ''}`}
                  >
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-navy-50">
                      <ImageWithFallback
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-bold text-black">{p.name}</p>
                      <p className="text-[11px] text-neutral-500">
                        {p.categories?.name ?? 'Tanpa Kategori'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-black">{formatRupiah(p.price)}</span>
                        <span className={`text-[10px] font-semibold ${p.stock <= 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                          {p.stock <= 0 ? 'Habis' : `Stok ${p.stock}`}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(p)
                        setScanQty(1)
                      }}
                      disabled={p.stock <= 0}
                      title="Tampilkan detail"
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-black transition-colors ${
                        selectedProduct?.id === p.id
                          ? 'border-navy-600 bg-navy-600 text-white'
                          : 'border-navy-200 bg-white hover:bg-navy-50'
                      } ${p.stock <= 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    {selectedProduct?.id === p.id && (
                      <span className="shrink-0 rounded-full bg-navy-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        Dipilih
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <p className="mt-4 rounded-xl bg-navy-50 py-6 text-center text-sm text-neutral-500">
              {products?.length ? 'Produk tidak ditemukan.' : 'Belum ada produk.'}
            </p>
          )}
        </div>
      </div>

      {/* ===================== RIGHT ===================== */}
      <div className="sticky top-20 flex flex-col gap-4">
        <div className="flex flex-col rounded-2xl border border-navy-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <ShoppingCart className="h-4.5 w-4.5" />
              </div>
              <h2 className="font-display text-base font-bold text-black">Keranjang</h2>
              {items.length > 0 && (
                <span className="rounded-full bg-navy-800 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  {items.length}
                </span>
              )}
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" /> Kosongkan
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-50">
                <ShoppingCart className="h-6 w-6 text-navy-300" />
              </div>
              <p className="text-sm font-semibold text-neutral-600">
                Keranjang masih kosong.
              </p>
              <p className="max-w-[220px] text-xs text-neutral-400">
                Scan barcode atau pilih produk untuk mulai berbelanja.
              </p>
            </div>
          ) : (
            <div className="max-h-[300px] divide-y divide-navy-50 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-navy-50">
                    <ImageWithFallback
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-bold text-black">
                      {item.product.name}
                    </p>
                    <p className="text-xs font-semibold text-neutral-500">
                      {formatRupiah(item.product.price)}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => decrement(item.product.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-navy-200 text-black hover:bg-navy-50"
                        aria-label="Kurangi"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span
                        className="w-9 text-center text-xs font-bold text-black"
                        contentEditable={false}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => increment(item.product.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-navy-200 text-black hover:bg-navy-50"
                        aria-label="Tambah"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xs font-bold text-black">
                      {formatRupiah(item.product.price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                      aria-label={`Hapus ${item.product.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-navy-900 bg-gradient-to-br from-navy-900 via-navy-800 to-royal-700 p-5 text-white shadow-md">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-ice-400/20 blur-2xl" aria-hidden="true" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-100">Total Belanja</p>
              <p className="mt-0.5 text-[11px] text-navy-100">
                {items.reduce((s, i) => s + i.quantity, 0)} item
              </p>
            </div>
            <div className="text-right">
              <span className="font-sans text-2xl font-extrabold text-white">
                {formatRupiah(total)}
              </span>
            </div>
          </div>
          <Button
            onClick={openCheckout}
            disabled={items.length === 0}
            variant="white"
            className="mt-4 w-full py-3"
            size="lg"
          >
            <ReceiptText className="h-5 w-5" />
            Checkout / Bayar
          </Button>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/60">
            <Spinner label="Memuat scanner..." />
          </div>
        }
      >
        <CameraScanner
          open={cameraOpen}
          onClose={() => setCameraOpen(false)}
          onDetected={(barcode) => {
            setCameraOpen(false)
            handleBarcode(barcode)
          }}
        />
      </Suspense>

      {/* Checkout modal */}
      <Modal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title="Pembayaran"
        subtitle="Konfirmasi transaksi sebelum menyelesaikan pembayaran."
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-navy-50 p-4">
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Total Belanja</span>
              <span className="font-bold text-black">{formatRupiah(total)}</span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-black">
              Uang Dibayar (Rp)
            </label>
            <input
              type="number"
              min={0}
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-lg font-bold text-black outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
              autoFocus
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[5000, 10000, 20000, 50000, 100000].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPayment(String(n))}
                  className="rounded-lg border border-navy-200 px-2.5 py-1 text-xs font-semibold text-black transition-colors hover:bg-navy-50"
                >
                  {formatRupiah(n)}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`rounded-xl p-4 ${
              change >= 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
            }`}
          >
            <div className="flex justify-between text-sm font-bold">
              <span>Kembalian</span>
              <span>{formatRupiah(change < 0 ? 0 : change)}</span>
            </div>
            {change < 0 && (
              <p className="mt-1 text-xs font-medium">
                Uang kurang {formatRupiah(Math.abs(change))}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-navy-100 pt-4">
          <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
            Batal
          </Button>
          <Button onClick={handlePay} loading={checkoutLoading} disabled={paymentNumber < total}>
            Bayar {formatNumber(paymentNumber)} Rp
          </Button>
        </div>
      </Modal>

      {/* Success / invoice modal */}
      <Modal
        open={Boolean(paidTransaction)}
        onClose={handleClosePaid}
        title="Transaksi Berhasil"
        subtitle="Stok produk telah diperbarui otomatis."
        size="md"
      >
        {paidTransaction && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-emerald-50 py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <p className="font-display text-lg font-bold text-emerald-800">
                Pembayaran Berhasil
              </p>
              <p className="text-sm text-emerald-600">
                {formatRupiah(paidTransaction.transaction.total_amount)}
              </p>
            </div>
            <Receipt
              transaction={paidTransaction.transaction}
              items={paidTransaction.items}
            />
            <ReceiptFooter />
            <Button variant="outline" className="w-full" onClick={handleClosePaid}>
              Selesai
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CashierPage