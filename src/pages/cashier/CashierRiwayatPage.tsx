import { useEffect, useState } from 'react'
import { Download, Eye, History, RefreshCw } from 'lucide-react'
import type { Transaction, TransactionItem } from '../../types'
import { getTransactionItems, listTransactions } from '../../services/transactions'
import { useAuthStore } from '../../stores/authStore'
import { formatDateTime, formatRupiah } from '../../utils/format'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import { AdminCard, TableShell, Th, Td } from '../../components/admin/AdminShared'
import { Receipt, ReceiptFooter } from '../../components/cashier/Receipt'

export function CashierRiwayatPage() {
  const profile = useAuthStore((s) => s.profile)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [detail, setDetail] = useState<{
    transaction: Transaction
    items: TransactionItem[]
  } | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const res = await listTransactions(
      profile ? { cashierId: profile.id } : undefined,
    )
    if (res.error) {
      setError('Gagal mengambil riwayat transaksi.')
    } else {
      setTransactions(res.data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [profile?.id])

  const openDetail = async (t: Transaction) => {
    setDetailLoading(true)
    setDetail({ transaction: t, items: [] })
    const res = await getTransactionItems(t.id)
    setDetail({ transaction: t, items: res.data ?? [] })
    setDetailLoading(false)
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-black">
        Riwayat Transaksi
      </h1>
      <p className="mt-0.5 text-sm text-neutral-600">
        Daftar transaksi yang Anda lakukan.
      </p>

      <div className="mt-6">
        {loading && <Spinner label="Memuat riwayat..." />}

        {error && (
          <StateMessage
            icon={<History className="h-10 w-10" />}
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
            {transactions.length === 0 ? (
              <StateMessage
                icon={<History className="h-10 w-10" />}
                title="Belum ada transaksi."
                description="Transaksi yang Anda buat akan tampil di sini."
              />
            ) : (
              <TableShell>
                <thead>
                  <tr>
                    <Th>Invoice</Th>
                    <Th>Tanggal</Th>
                    <Th>Total</Th>
                    <Th>Bayar</Th>
                    <Th className="text-right">Struk</Th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="transition-colors hover:bg-navy-50/40">
                      <Td className="font-mono text-xs font-bold">{t.invoice_number}</Td>
                      <Td className="text-xs text-neutral-600">{formatDateTime(t.created_at)}</Td>
                      <Td className="font-bold text-black">{formatRupiah(t.total_amount)}</Td>
                      <Td className="text-black">{formatRupiah(t.payment_amount)}</Td>
                      <Td className="text-right">
                        <button
                          type="button"
                          onClick={() => openDetail(t)}
                          className="inline-flex items-center gap-1 rounded-lg bg-navy-50 px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-navy-100"
                        >
                          <Eye className="h-3.5 w-3.5" /> Lihat
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
            )}
          </AdminCard>
        )}
      </div>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.transaction.invoice_number ?? ''}
        subtitle={detail ? formatDateTime(detail.transaction.created_at) : ''}
        size="md"
      >
        {detailLoading ? (
          <Spinner label="Memuat detail..." />
        ) : detail ? (
          <div className="space-y-4">
            <Receipt
              transaction={detail.transaction}
              items={detail.items}
            />
            <ReceiptFooter />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setDetail(null)}
            >
              <Download className="h-4 w-4" /> Tutup
            </Button>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

export default CashierRiwayatPage