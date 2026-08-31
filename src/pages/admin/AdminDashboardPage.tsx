import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Boxes,
  Eye,
  Package,
  ReceiptText,
  RefreshCw,
  Tags,
  Wallet,
} from 'lucide-react'
import { getDashboardStats, type DashboardStats } from '../../services/transactions'
import {
  getWebStats,
  subscribeActivity,
  type LiveActivity,
  type WebStats,
} from '../../services/live'
import type { Transaction } from '../../types'
import { formatRupiah, formatTime } from '../../utils/format'
import { Spinner, StateMessage } from '../../components/ui/StateMessage'
import { Button } from '../../components/ui/Button'
import ImageWithFallback from '../../components/ui/ImageWithFallback'
import { cn } from '../../lib/utils'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [web, setWeb] = useState<WebStats | null>(null)
  const [webError, setWebError] = useState<string | null>(null)

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

  const fetchWeb = async () => {
    setWebError(null)
    const res = await getWebStats()
    if (res.error) {
      setWebError('Gagal mengambil statistik website.')
    } else {
      setWeb(res.data)
    }
  }

  const [feed, setFeed] = useState<LiveActivity[]>([])

  useEffect(() => {
    fetchStats()
    fetchWeb()
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeActivity({
      onTransaction: (tx: Transaction) => {
        fetchStats()
        setFeed((prev) =>
          [
            {
              type: 'transaction',
              id: tx.id,
              title: tx.invoice_number,
              detail: `Transaksi ${formatRupiah(tx.total_amount)} • Kasir`,
              created_at: tx.created_at,
              payload: tx,
            } satisfies LiveActivity,
            ...prev,
          ].slice(0, 14),
        )
      },
      onPageView: (view) => {
        setWeb((w) =>
          w
            ? {
                ...w,
                today: w.today + 1,
                total: w.total + 1,
              }
            : w,
        )
        setFeed((prev) =>
          [
            {
              type: 'pageview',
              id: view.id,
              title: view.path,
              detail: 'Pengunjung website',
              created_at: view.created_at,
              payload: view,
            } satisfies LiveActivity,
            ...prev,
          ].slice(0, 14),
        )
      },
    })
    return unsubscribe
  }, [])

  const initialFeed = useMemo(() => {
    const items: LiveActivity[] = [
      ...(stats?.recentTransactions ?? []).map((tx) => ({
        type: 'transaction' as const,
        id: tx.id,
        title: tx.invoice_number,
        detail: `Transaksi ${formatRupiah(tx.total_amount)} • Kasir`,
        created_at: tx.created_at,
        payload: tx,
      })),
      ...(web?.recent ?? []).map((v) => ({
        type: 'pageview' as const,
        id: v.id,
        title: v.path,
        detail: 'Pengunjung website',
        created_at: v.created_at,
        payload: v,
      })),
    ]
    return items
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 14)
  }, [stats, web])

  const mergedFeed = feed.length > 0 ? feed : initialFeed

  const statCards = [
    { label: 'Total Produk', value: stats?.totalProducts ?? 0, icon: Package, color: 'bg-navy-50 text-navy-700' },
    { label: 'Total Kategori', value: stats?.totalCategories ?? 0, icon: Tags, color: 'bg-ice-100 text-sky-700' },
    { label: 'Total Transaksi', value: stats?.totalTransactions ?? 0, icon: ReceiptText, color: 'bg-violet-50 text-violet-700' },
    { label: 'Pendapatan Hari Ini', value: '', money: stats?.todayRevenue ?? 0, icon: Wallet, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Pengunjung Hari Ini', value: web?.today ?? 0, icon: Eye, color: 'bg-sky-50 text-sky-700' },
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {statCards.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-navy-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-600">{c.label}</p>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', c.color)}>
                    <c.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 font-display text-2xl font-extrabold text-black">
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
                <h2 className="flex items-center gap-2 font-display text-base font-bold text-black">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Produk Stok Menipis
                </h2>
                <Link
                  to="/admin/produk"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-black"
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
                        <p className="truncate text-sm font-semibold text-black">
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
                <h2 className="flex items-center gap-2 font-display text-base font-bold text-black">
                  <Activity className="h-4 w-4 text-neutral-600" />
                  Aktivitas Live
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                    </span>
                    Live
                  </span>
                </h2>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600">
                  <Eye className="h-3.5 w-3.5 text-neutral-500" />
                  {formatRupiah(web?.today ?? 0)} pengunjung hari ini
                </span>
              </div>

              {webError && (
                <p className="mt-3 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-medium text-red-700">
                  {webError}
                </p>
              )}

              {mergedFeed.length === 0 ? (
                <p className="mt-6 rounded-xl bg-navy-50 px-4 py-3 text-sm font-medium text-neutral-600">
                  Belum ada aktivitas. Buka halaman website atau jualan lewat kasir untuk melihat update langsung.
                </p>
              ) : (
                <>
                  <div className="mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1">
                    {mergedFeed.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="flex items-center gap-3 rounded-xl border border-navy-50 bg-navy-50/40 px-3.5 py-2.5"
                      >
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                            item.type === 'transaction'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-sky-50 text-sky-600',
                          )}
                        >
                          {item.type === 'transaction' ? (
                            <ReceiptText className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-black">
                            {item.title}
                          </p>
                          <p className="truncate text-[11px] text-neutral-600">
                            {item.detail}
                          </p>
                        </div>
                        <span className="shrink-0 text-[11px] text-neutral-500">
                          {formatTime(item.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {web && web.topPaths.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-navy-50 pt-3">
                      <span className="text-[11px] font-semibold text-neutral-600">
                        Halaman populer:
                      </span>
                      {web.topPaths.map((p) => (
                        <span
                          key={p.path}
                          className="rounded-full bg-navy-50 px-2 py-0.5 font-mono text-[10px] font-bold text-neutral-600"
                        >
                          {p.path || '/'} ×{p.count}
                        </span>
                      ))}
                    </div>
                  )}
                </>
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