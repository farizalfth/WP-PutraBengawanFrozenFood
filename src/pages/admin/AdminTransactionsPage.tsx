import { useEffect, useState } from 'react'
import {
  Eye,
  Filter,
  ReceiptText,
  RefreshCw,
  X,
} from 'lucide-react'
import type { Transaction, TransactionItem } from '../../types'
import {
  getTransactionItems,
  listTransactions,
} from '../../services/transactions'
import { formatDateTime, formatInvoiceDate, formatRupiah } from '../../utils/format'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import {
  AdminPageHeader,
  AdminCard,
  TableShell,
  Th,
  Td,
} from '../../components/admin/AdminShared'
import { Field, Input } from '../../components/ui/FormControls'

export function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState({
    invoice: '',
    from: '',
    to: '',
  })

  const [detailTx, setDetailTx] = useState<Transaction | null>(null)
  const [detailItems, setDetailItems] = useState<TransactionItem[]>([])
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const res = await listTransactions({
      invoice: filters.invoice || undefined,
      from: filters.from || undefined,
      to: filters.to ? filters.to + 'T23:59:59' : undefined,
    })
    if (res.error) {
      setError('Gagal mengambil data transaksi.')
    } else {
      setTransactions(res.data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openDetail = async (t: Transaction) => {
    setDetailTx(t)
    setDetailLoading(true)
    setDetailItems([])
    const res = await getTransactionItems(t.id)
    setDetailItems(res.data ?? [])
    setDetailLoading(false)
  }

  const totalAll = transactions.reduce((s, t) => s + t.total_amount, 0)

  return (
    <div>
      <AdminPageHeader
        title="Transaksi"
        description="Daftar seluruh riwayat transaksi."
      />

      <AdminCard>
        <div className="flex flex-wrap items-end gap-3 border-b border-navy-100 p-4">
          <Field label="Invoice">
            <Input
              value={filters.invoice}
              onChange={(e) => setFilters({ ...filters, invoice: e.target.value })}
              placeholder="INV-..."
              className="w-48"
            />
          </Field>
          <Field label="Dari Tanggal">
            <Input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            />
          </Field>
          <Field label="Sampai Tanggal">
            <Input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            />
          </Field>
          <Button onClick={fetchData}>
            <Filter className="h-4 w-4" /> Filter
          </Button>
          {(filters.invoice || filters.from || filters.to) && (
            <Button
              variant="ghost"
              onClick={() => {
                setFilters({ invoice: '', from: '', to: '' })
                fetchData()
              }}
            >
              <X className="h-4 w-4" /> Reset
            </Button>
          )}
        </div>

        {loading && <Spinner label="Memuat transaksi..." />}

        {error && (
          <StateMessage
            icon={<ReceiptText className="h-10 w-10" />}
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
              <p className="text-xs font-semibold text-navy-400">
                {transactions.length} transaksi
              </p>
              <p className="text-sm font-bold text-navy-900">
                Total: {formatRupiah(totalAll)}
              </p>
            </div>

            {transactions.length === 0 ? (
              <StateMessage
                icon={<ReceiptText className="h-10 w-10" />}
                title="Belum ada transaksi."
                description="Transaksi akan muncul di sini setelah kasir melakukan penjualan."
              />
            ) : (
              <TableShell>
                <thead>
                  <tr>
                    <Th>Invoice</Th>
                    <Th>Tanggal</Th>
                    <Th>Kasir</Th>
                    <Th>Total</Th>
                    <Th>Bayar</Th>
                    <Th>Kembali</Th>
                    <Th className="text-right">Detail</Th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="transition-colors hover:bg-navy-50/40">
                      <Td className="font-mono text-xs font-bold">{t.invoice_number}</Td>
                      <Td className="text-xs text-navy-500">{formatDateTime(t.created_at)}</Td>
                      <Td className="font-semibold text-navy-800">
                        {t.profiles?.name ?? '-'}
                      </Td>
                      <Td className="font-bold text-navy-900">{formatRupiah(t.total_amount)}</Td>
                      <Td className="text-navy-600">{formatRupiah(t.payment_amount)}</Td>
                      <Td className="text-navy-600">{formatRupiah(t.change_amount)}</Td>
                      <Td className="text-right">
                        <button
                          type="button"
                          onClick={() => openDetail(t)}
                          className="inline-flex items-center gap-1 rounded-lg bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-100"
                        >
                          <Eye className="h-3.5 w-3.5" /> Detail
                        </button>
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
        open={Boolean(detailTx)}
        onClose={() => setDetailTx(null)}
        title={detailTx?.invoice_number ?? ''}
        subtitle={detailTx ? formatInvoiceDate(detailTx.created_at) : ''}
        size="lg"
      >
        {detailLoading ? (
          <Spinner label="Memuat detail..." />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-navy-400">Kasir: </span>
                <span className="font-semibold text-navy-900">
                  {detailTx?.profiles?.name ?? '-'}
                </span>
              </div>
              <div>
                <span className="text-navy-400">Total: </span>
                <span className="font-bold text-navy-900">
                  {formatRupiah(detailTx?.total_amount ?? 0)}
                </span>
              </div>
              <div>
                <span className="text-navy-400">Bayar: </span>
                <span className="font-semibold text-navy-900">
                  {formatRupiah(detailTx?.payment_amount ?? 0)}
                </span>
              </div>
              <div>
                <span className="text-navy-400">Kembalian: </span>
                <span className="font-semibold text-navy-900">
                  {formatRupiah(detailTx?.change_amount ?? 0)}
                </span>
              </div>
            </div>

            <h3 className="border-t border-navy-100 pt-3 text-sm font-bold text-navy-900">
              Item Pembelian
            </h3>
            {detailItems.length === 0 ? (
              <p className="rounded-xl bg-navy-50 py-3 text-center text-sm text-navy-400">
                Tidak ada data item.
              </p>
            ) : (
              <TableShell>
                <thead>
                  <tr>
                    <Th>Produk</Th>
                    <Th>Barcode</Th>
                    <Th>Harga</Th>
                    <Th>Qty</Th>
                    <Th className="text-right">Subtotal</Th>
                  </tr>
                </thead>
                <tbody>
                  {detailItems.map((item) => (
                    <tr key={item.id}>
                      <Td className="font-semibold text-navy-900">
                        {item.products?.name ?? '-'}
                      </Td>
                      <Td className="font-mono text-xs">
                        {item.products?.barcode ?? '-'}
                      </Td>
                      <Td>{formatRupiah(item.price)}</Td>
                      <Td>{item.quantity}</Td>
                      <Td className="text-right font-bold text-navy-900">
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
    </div>
  )
}

export default AdminTransactionsPage