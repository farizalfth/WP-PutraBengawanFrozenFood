import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  Package,
  ReceiptText,
  RefreshCw,
  Tags,
  Wallet,
} from 'lucide-react'
import { getDashboardStats, type DashboardStats } from '../../services/transactions'
import { formatDateTime, formatRupiah } from '../../utils/format'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import { Button } from '../../components/ui/Button'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { cn } from '../../lib/utils'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    const res = await getDashboardStats()
    if (res.error) {
      setError('Gagal mengambil data dashboard.')
    } else {
      setStats(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Total Produk', value: stats?.totalProducts ?? 0, icon: Package, color: 'bg-navy-50 text-navy-700' },
    { label: 'Total Kategori', value: stats?.totalCategories ?? 0, icon: Tags, color: 'bg-ice-100 text-sky-700' },
    { label: 'Total Transaksi', value: stats?.totalTransactions ?? 0, icon: ReceiptText, color: 'bg-violet-50 text-violet-700' },
    { label: 'Pendapatan Hari Ini', value: '', money: stats?.todayRevenue ?? 0, icon: Wallet, color: 'bg-emerald-50 text-emerald-700' },
  ]

  return (
    <div className="space-y-6">
      {loading && <Spinner label="Memuat dashboard..." />}

      {error && (
        <StateMessage
          icon={<RefreshCw className="h-10 w-10" />}
          title={error}
          action={
            <Button variant="outline" size="sm" onClick={fetchStats}>
              <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
            </Button>
          }
        />
      )}

      {!loading && !error && stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-navy-500">{c.label}</p>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', c.color)}>
                    <c.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-2xl font-extrabold text-navy-900">
                  {(c as { money?: number }).money !== undefined
                    ? formatRupiah((c as { money: number }).money)
                    : (c.value as number).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy-900">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Produk Stok Menipis
                </h2>
                <Link
                  to="/admin/produk"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:text-navy-900"
                >
                  Kelola <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {stats.lowStockProducts.length === 0 ? (
                <p className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  <Boxes className="h-4 w-4" /> Semua stok mencukupi.
                </p>
              ) : (
                <div className="mt-4 space-y-2.5">
                  {stats.lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-xl border border-navy-50 bg-navy-50/40 p-2.5"
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white">
                        <ImageWithFallback
                          src={p.image_url}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy-900">
                          {p.name}
                        </p>
                        <p className={cn('text-xs font-bold', p.stock <= 0 ? 'text-red-600' : 'text-amber-600')}>
                          {p.stock <= 0 ? 'Stok habis' : `Sisa ${p.stock}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy-900">
                  <ReceiptText className="h-4 w-4 text-navy-600" />
                  Transaksi Terbaru
                </h2>
                <Link
                  to="/admin/transaksi"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:text-navy-900"
                >
                  Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {stats.recentTransactions.length === 0 ? (
                <p className="mt-6 rounded-xl bg-navy-50 px-4 py-3 text-sm font-medium text-navy-500">
                  Belum ada transaksi.
                </p>
              ) : (
                <div className="mt-4 space-y-2">
                  {stats.recentTransactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-navy-50 bg-navy-50/40 px-3.5 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-navy-900">
                          {t.invoice_number}
                        </p>
                        <p className="text-[11px] text-navy-400">
                          {formatDateTime(t.created_at)}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-navy-900">
                        {formatRupiah(t.total_amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!loading && !error && !stats && (
        <StateMessage
          icon={<AlertTriangle className="h-10 w-10" />}
          title="Belum ada data."
          description="Butuh waktu untuk memuat data dashboard."
        />
      )}
    </div>
  )
}

export default AdminDashboardPage