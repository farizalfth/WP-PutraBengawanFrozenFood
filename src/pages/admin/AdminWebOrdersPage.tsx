import { useEffect, useState } from 'react'
import {
  Check,
  Eye,
  MapPin,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  Trash2,
  UserRound,
} from 'lucide-react'
import type { WebOrder, WebOrderItemRow, WebOrderStatus } from '../../types'
import {
  deleteWebOrder,
  listWebOrderItems,
  listWebOrders,
  syncWebOrderToTransactions,
  updateWebOrderStatus,
} from '../../services/webOrders'
import { formatDateTime, formatInvoiceDate, formatRupiah } from '../../utils/format'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import {
  AdminPageHeader,
  AdminCard,
  TableShell,
  Th,
  Td,
} from '../../components/admin/AdminShared'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from '../../stores/toastStore'
import { cn } from '../../lib/utils'

const deliveryLabels: Record<string, string> = {
  pickup: 'Ambil di Toko',
  gojek: 'Dikirim Gojek / GoSend',
  shopee: 'Dikirim ShopeeFood',
  courier: 'Kurir Lain / Ekspedisi',
}

const paymentLabels: Record<string, string> = {
  qris: 'QR Code (QRIS)',
  transfer: 'Transfer Bank',
  cash: 'Tunai / COD',
}

const statusOptions: { value: WebOrderStatus; label: string; active: string; inactive: string }[] = [
  { value: 'pending', label: 'Pending', active: 'bg-amber-100 text-amber-800', inactive: 'hover:bg-amber-50' },
  { value: 'accepted', label: 'Diterima', active: 'bg-sky-100 text-sky-800', inactive: 'hover:bg-sky-50' },
  { value: 'done', label: 'Selesai', active: 'bg-emerald-100 text-emerald-800', inactive: 'hover:bg-emerald-50' },
]

const statusLabels: Record<WebOrderStatus, string> = {
  pending: 'Pending',
  accepted: 'Diterima',
  done: 'Selesai',
}

export function AdminWebOrdersPage() {
  const [orders, setOrders] = useState<WebOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [detailOrder, setDetailOrder] = useState<WebOrder | null>(null)
  const [detailItems, setDetailItems] = useState<WebOrderItemRow[]>([])
  const [detailLoading, setDetailLoading] = useState(false)

  const [deleteOrder, setDeleteOrder] = useState<WebOrder | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)
  const [syncingId, setSyncingId] = useState<string | null>(null)

  const profile = useAuthStore((s) => s.profile)
  const toast = useToast()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const res = await listWebOrders()
    if (res.error) {
      setError('Gagal mengambil data pesanan online.')
    } else {
      setOrders(res.data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalAll = orders.reduce((s, o) => s + (o.total_amount ?? 0), 0)

  const openDetail = async (o: WebOrder) => {
    setDetailOrder(o)
    setDetailLoading(true)
    setDetailItems([])
    const res = await listWebOrderItems(o.id)
    setDetailItems(res.data ?? [])
    setDetailLoading(false)
  }

  const handleStatus = async (o: WebOrder, status: WebOrderStatus) => {
    setStatusUpdatingId(o.id)
    const res = await updateWebOrderStatus(o.id, status)
    setStatusUpdatingId(null)
    if (res.error) {
      toast.error(res.error)
      return
    }
    toast.success(`Pesanan ${o.order_number} ditandai "${statusLabels[status]}".`)
    setOrders((prev) =>
      prev.map((p) => (p.id === o.id ? { ...p, status } : p)),
    )
    if (detailOrder?.id === o.id) setDetailOrder({ ...detailOrder, status })
  }

  const handleSyncTransaction = async (o: WebOrder) => {
    setSyncingId(o.id)
    const res = await syncWebOrderToTransactions(o.id)
    setSyncingId(null)
    if (res.error) {
      toast.error(res.error)
      return
    }
    toast.success(
      `Pesanan ${o.order_number} masuk ke transaksi (${res.invoiceNumber ?? ''}).`,
    )
    setOrders((prev) =>
      prev.map((p) =>
        p.id === o.id
          ? { ...p, status: 'done', synced_transaction_id: res.transactionId }
          : p,
      ),
    )
    if (detailOrder?.id === o.id) {
      setDetailOrder({
        ...detailOrder,
        status: 'done',
        synced_transaction_id: res.transactionId,
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteOrder) return
    setDeleting(true)
    const res = await deleteWebOrder(deleteOrder.id)
    setDeleting(false)
    if (res.error) {
      toast.error(res.error)
      return
    }
    toast.success(`Pesanan ${deleteOrder.order_number} dihapus.`)
    setDeleteOrder(null)
    fetchData()
  }

  return (
    <div>
      <AdminPageHeader
        title="Pesanan Online"
        description="Daftar pesanan yang dibuat dari website toko."
      />

      <AdminCard>
        {loading && <Spinner label="Memuat pesanan..." />}

        {error && (
          <StateMessage
            icon={<PackageCheck className="h-10 w-10" />}
            title={error}
            action={
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
              </Button>
            }
          />
        )}

        {!loading && !error && (
          <>
            <div className="flex items-center justify-between border-b border-navy-50 px-4 py-3">
              <p className="text-xs font-semibold text-neutral-500">
                {orders.length} pesanan online
              </p>
              <p className="text-sm font-bold text-black">
                Total: {formatRupiah(totalAll)}
              </p>
            </div>

            {orders.length === 0 ? (
              <StateMessage
                icon={<PackageCheck className="h-10 w-10" />}
                title="Belum ada pesanan online."
                description="Pesanan dari website akan muncul di sini setelah kostumer buat checkout."
              />
            ) : (
              <TableShell>
                <thead>
                  <tr>
                    <Th>No. Pesanan</Th>
                    <Th>Tanggal</Th>
                    <Th>Kostumer</Th>
                    <Th>Pengiriman</Th>
                    <Th>Bayar</Th>
                    <Th>Tot</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Aksi</Th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="transition-colors hover:bg-navy-50/40">
                      <Td className="font-mono text-xs font-bold">{o.order_number}</Td>
                      <Td className="text-xs text-neutral-600">{formatDateTime(o.created_at)}</Td>
                      <Td className="font-semibold text-black">{o.customer_name}</Td>
                      <Td className="text-black">{deliveryLabels[o.delivery] ?? o.delivery}</Td>
                      <Td className="text-black">
                        {paymentLabels[o.payment] ?? o.payment}
                        {o.payment_confirmed_at && (
                          <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            <Check className="h-3 w-3" /> Lunas
                          </span>
                        )}
                        {o.synced_transaction_id && (
                          <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-royal-100 px-2 py-0.5 text-[10px] font-bold text-royal-700">
                            Transaksi
                          </span>
                        )}
                      </Td>
                      <Td className="font-bold text-black">{formatRupiah(o.total_amount ?? 0)}</Td>
                      <Td>
                        <div className="flex gap-1">
                          {statusOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              disabled={statusUpdatingId === o.id}
                              onClick={() => handleStatus(o, opt.value)}
                              className={cn(
                                'rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors disabled:opacity-60',
                                o.status === opt.value
                                  ? opt.active
                                  : `text-neutral-500 ${opt.inactive}`,
                              )}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </Td>
                      <Td className="text-right">
                        <button
                          type="button"
                          onClick={() => openDetail(o)}
                          className="inline-flex items-center gap-1 rounded-lg bg-navy-50 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-navy-100"
                        >
                          <Eye className="h-3.5 w-3.5" /> Detail
                        </button>
                        {!o.synced_transaction_id && (
                          <button
                            type="button"
                            disabled={syncingId === o.id}
                            onClick={() => handleSyncTransaction(o)}
                            className="ml-1.5 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-60"
                          >
                            <Check className="h-3.5 w-3.5" />
                            {syncingId === o.id ? 'Memproses...' : 'Transaksi'}
                          </button>
                        )}
                        {profile?.role === 'admin' && (
                          <button
                            type="button"
                            onClick={() => setDeleteOrder(o)}
                            className="ml-1.5 inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                          </button>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
            )}
          </>
        )}
      </AdminCard>

      <Modal
        open={Boolean(detailOrder)}
        onClose={() => setDetailOrder(null)}
        title={detailOrder?.order_number ?? ''}
        subtitle={detailOrder ? formatInvoiceDate(detailOrder.created_at) : ''}
        size="lg"
      >
        {detailOrder && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div>
                <span className="text-neutral-500">Kostumer: </span>
                <span className="font-semibold text-black">
                  {detailOrder.customer_name}
                </span>
              </div>
              <div>
                <span className="text-neutral-500">No. HP: </span>
                <span className="font-semibold text-black">
                  {detailOrder.customer_phone}
                </span>
              </div>
              <div>
                <span className="text-neutral-500">Total: </span>
                <span className="font-bold text-black">
                  {formatRupiah(detailOrder.total_amount ?? 0)}
                </span>
              </div>
              <span
                className={cn(
                  'ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold',
                  statusOptions.find((s) => s.value === detailOrder.status)?.active,
                )}
              >
                <Check className="h-3.5 w-3.5" />
                {statusLabels[detailOrder.status]}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-sm">
              {detailOrder.address && (
                <div className="flex items-start gap-1.5 text-navy-600">
                  <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span className="break-words">
                    <span className="font-semibold text-black">Alamat: </span>
                    {detailOrder.address}
                  </span>
                </div>
              )}
              {detailOrder.titik_lokasi && (
                <div className="flex items-start gap-1.5 text-navy-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span className="break-all">
                    <span className="font-semibold text-black">Titik Lokasi: </span>
                    <a
                      href={detailOrder.titik_lokasi}
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-royal-600 hover:text-royal-800"
                    >
                      {detailOrder.titik_lokasi}
                    </a>
                  </span>
                </div>
              )}
              {detailOrder.notes && (
                <div className="flex items-start gap-1.5 text-navy-600">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <span className="break-words whitespace-pre-line">
                    <span className="font-semibold text-black">Catatan: </span>
                    {detailOrder.notes}
                  </span>
                </div>
              )}
              {detailOrder.payment_confirmed_at && (
                <div className="flex items-start gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <span className="font-semibold">Pembayaran dilaporkan lunas</span>
                    {detailOrder.payment_proof && (
                      <>
                        {' '}
                        · Bukti: <span className="break-all">{detailOrder.payment_proof}</span>
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>

            <h3 className="border-t border-navy-100 pt-3 text-sm font-bold text-black">
              Item Pembelian
            </h3>
            {detailLoading ? (
              <Spinner label="Memuat item..." />
            ) : detailItems.length === 0 ? (
              <p className="rounded-xl bg-navy-50 py-3 text-center text-sm text-neutral-500">
                Tidak ada data item.
              </p>
            ) : (
              <TableShell>
                <thead>
                  <tr>
                    <Th>Produk</Th>
                    <Th>Harga</Th>
                    <Th>Qty</Th>
                    <Th className="text-right">Subtotal</Th>
                  </tr>
                </thead>
                <tbody>
                  {detailItems.map((item) => (
                    <tr key={item.id}>
                      <Td className="font-semibold text-black">{item.name}</Td>
                      <Td>{formatRupiah(item.price)}</Td>
                      <Td>{item.quantity}</Td>
                      <Td className="text-right font-bold text-black">
                        {formatRupiah(item.subtotal)}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteOrder)}
        title="Hapus Pesanan?"
        description={`Pesanan ${deleteOrder?.order_number ?? ''} akan dihapus dari daftar pesanan online.`}
        confirmText="Hapus"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOrder(null)}
      />
    </div>
  )
}

export default AdminWebOrdersPage