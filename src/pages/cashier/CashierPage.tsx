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
import { cn } from '../../lib/utils'

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
  const removeItem = useCartStore((s) => s.removeItem)
  const clear = useCartStore((s) => s.clear)

  const profile = useAuthStore((s) => s.profile)
  const toast = useToast()

  const [manualBarcode, setManualBarcode] = useState('')
  const [lastProduct, setLastProduct] = useState<string | null>(null)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: products, loading, error } = useAsyncData(listProducts)

  const handleAddProduct = (product: NonNullable<typeof products>[number]) => {
    const res = addItem(product)
    if (!res.ok) {
      toast.error(res.message)
      return
    }
    setLastProduct(product.name)
    setLookupError(null)
  }

  const handleBarcode = async (barcode: string) => {
    setManualBarcode('')
    setLookupError(null)
    const { data: product, error: err } = await getProductByBarcode(barcode)
    if (err || !product) {
      setLookupError(`Produk dengan barcode ${barcode} tidak ditemukan.`)
      setLastProduct(null)
      toast.error('Barcode tidak ditemukan.')
      return
    }
    handleAddProduct(product)
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
        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-navy-900">
              <ScanLine className="h-5 w-5 text-navy-600" />
              <h2 className="font-display text-base font-bold">Scan Barcode</h2>
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

          <form onSubmit={handleManualSubmit} className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <input
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Ketik / scan barcode lalu Enter..."
                inputMode="numeric"
                autoFocus
                className="w-full rounded-xl border border-navy-200 bg-white py-2.5 pl-9 pr-3 text-sm text-navy-900 outline-none placeholder:text-navy-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
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
          <p className="mt-2 text-[11px] text-navy-400">
            Scanner USB: arahkan ke barcode lalu Enter. Barcode yang sama akan menambah kuantitas.
          </p>
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-navy-900">
              <ShoppingCart className="h-5 w-5 text-navy-600" />
              <h2 className="font-display text-base font-bold">Katalog</h2>
            </div>
            <div className="relative w-56 max-w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full rounded-xl border border-navy-200 bg-white py-2 pl-9 pr-3 text-sm text-navy-900 outline-none placeholder:text-navy-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
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
            <div className="mt-4 grid max-h-[520px] grid-cols-3 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((p) => {
                const inCart = items.some((i) => i.product.id === p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleAddProduct(p)}
                    disabled={p.stock <= 0}
                    className={cn(
                      'group flex flex-col items-center rounded-xl border bg-white p-2 text-left transition-all',
                      p.stock <= 0
                        ? 'cursor-not-allowed border-navy-100 opacity-50'
                        : cn(
                            'border-navy-100 hover:-translate-y-0.5 hover:border-navy-400 hover:shadow-md',
                            inCart && 'border-navy-600 ring-1 ring-navy-200',
                          ),
                    )}
                  >
                    <div className="flex h-16 w-full items-center justify-center overflow-hidden rounded-lg bg-navy-50">
                      <ImageWithFallback
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-1.5 line-clamp-1 w-full text-[11px] font-semibold text-navy-900">
                      {p.name}
                    </p>
                    <p className="w-full text-[11px] font-bold text-navy-700">
                      {formatRupiah(p.price)}
                    </p>
                    <p className={cn('w-full text-[10px]', p.stock <= 0 ? 'text-red-500' : 'text-navy-400')}>
                      {p.stock <= 0 ? 'Habis' : `Stok ${p.stock}`}
                    </p>
                  </button>
                )
              })}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <p className="mt-4 rounded-xl bg-navy-50 py-6 text-center text-sm text-navy-400">
              {products?.length ? 'Produk tidak ditemukan.' : 'Belum ada produk.'}
            </p>
          )}
        </div>
      </div>

      {/* ===================== RIGHT ===================== */}
      <div className="sticky top-20 flex flex-col gap-4">
        <div className="flex flex-col rounded-2xl border border-navy-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy-900">
              <ShoppingCart className="h-5 w-5 text-navy-600" />
              Keranjang
              {items.length > 0 && (
                <span className="rounded-full bg-navy-800 px-2 py-0.5 text-[10px] font-bold text-white">
                  {items.length}
                </span>
              )}
            </h2>
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
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <ShoppingCart className="h-10 w-10 text-navy-200" />
              <p className="text-sm font-medium text-navy-400">
                Keranjang masih kosong.
              </p>
              <p className="text-xs text-navy-300">
                Scan barcode atau pilih produk untuk memulai.
              </p>
            </div>
          ) : (
            <div className="max-h-[300px] divide-y divide-navy-50 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-navy-50">
                    <ImageWithFallback
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-bold text-navy-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs font-semibold text-navy-600">
                      {formatRupiah(item.product.price)}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => decrement(item.product.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-navy-200 text-navy-700 hover:bg-navy-50"
                        aria-label="Kurangi"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span
                        className="w-9 text-center text-xs font-bold text-navy-900"
                        contentEditable={false}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => increment(item.product.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-navy-200 text-navy-700 hover:bg-navy-50"
                        aria-label="Tambah"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xs font-bold text-navy-900">
                      {formatRupiah(item.product.price * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="rounded p-1 text-navy-300 hover:bg-red-50 hover:text-red-500"
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

        <div className="rounded-2xl border border-navy-100 bg-navy-900 p-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-200">Total</span>
            <span className="font-display text-2xl font-extrabold">
              {formatRupiah(total)}
            </span>
          </div>
          {items.length > 0 && (
            <p className="mt-0.5 text-right text-xs text-navy-300">
              {items.reduce((s, i) => s + i.quantity, 0)} item
            </p>
          )}
          <Button
            onClick={openCheckout}
            disabled={items.length === 0}
            className="mt-4 w-full bg-white text-navy-900 hover:bg-navy-50"
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
            <div className="flex justify-between text-sm text-navy-500">
              <span>Total Belanja</span>
              <span className="font-bold text-navy-900">{formatRupiah(total)}</span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-800">
              Uang Dibayar (Rp)
            </label>
            <input
              type="number"
              min={0}
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="w-full rounded-xl border border-navy-200 bg-white px-3.5 py-2.5 text-lg font-bold text-navy-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
              autoFocus
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[5000, 10000, 20000, 50000, 100000].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPayment(String(n))}
                  className="rounded-lg border border-navy-200 px-2.5 py-1 text-xs font-semibold text-navy-600 transition-colors hover:bg-navy-50"
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