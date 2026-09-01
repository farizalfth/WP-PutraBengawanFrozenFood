import { Printer } from 'lucide-react'
import type { Transaction, TransactionItem } from '../../types'
import { formatInvoiceDate, formatNumber, formatRupiah } from '../../utils/format'
import { STORE_NAME, STORE_TAGLINE, STORE_SETTINGS } from '../../utils/constants'
import { Button } from '../ui/Button'

interface ReceiptProps {
  transaction: Transaction
  items: TransactionItem[]
}

export function Receipt({ transaction, items }: ReceiptProps) {
  const dateStr = formatInvoiceDate(transaction.created_at)

  return (
    <div id="receipt-print" className="receipt-sheet bg-white p-4">
      <div className="text-center">
        <p className="font-display text-base font-extrabold tracking-wide text-black">
          {STORE_NAME}
        </p>
        <p className="text-[11px] font-semibold tracking-[0.2em] text-neutral-600">
          {STORE_TAGLINE}
        </p>
        <div className="mx-auto mt-1 text-[10px] leading-snug text-neutral-500">
          <p>{STORE_SETTINGS.address}</p>
          <p>Telp: {STORE_SETTINGS.phone}</p>
          <p>WA: {STORE_SETTINGS.whatsapp.replace(/\D/g, '').replace(/^62/, '0')}</p>
          <p>{STORE_SETTINGS.instagram}</p>
        </div>
      </div>

      <div className="my-2 border-t border-dashed border-navy-300" />

      <div className="space-y-0.5 text-[11px] text-black">
        <div className="flex justify-between">
          <span>No. Invoice</span>
          <span className="font-mono font-semibold">{transaction.invoice_number}</span>
        </div>
        <div className="flex justify-between">
          <span>Tanggal</span>
          <span>{dateStr}</span>
        </div>
        <div className="flex justify-between">
          <span>Kasir</span>
          <span>{transaction.profiles?.name ?? '-'}</span>
        </div>
      </div>

      <div className="my-2 border-t border-dashed border-navy-300" />

      <div className="space-y-1.5 text-[11px] text-black">
        {items.map((item) => (
          <div key={item.id}>
            <p className="font-medium text-black max-w-[260px]">
              {item.products?.name ?? '-'}
            </p>
            <div className="flex justify-between">
              <span className="text-neutral-600">
                {formatNumber(item.quantity)} x {formatRupiah(item.price)}
              </span>
              <span className="font-semibold">{formatRupiah(item.subtotal)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="my-2 border-t border-dashed border-navy-300" />

      <div className="space-y-0.5 text-[11px]">
        <div className="flex justify-between font-semibold text-black">
          <span>TOTAL</span>
          <span>{formatRupiah(transaction.total_amount)}</span>
        </div>
        <div className="flex justify-between text-black">
          <span>BAYAR</span>
          <span>{formatRupiah(transaction.payment_amount)}</span>
        </div>
        <div className="flex justify-between font-semibold text-black">
          <span>KEMBALI</span>
          <span>{formatRupiah(transaction.change_amount)}</span>
        </div>
      </div>

      <div className="my-2 border-t border-dashed border-navy-300" />

      <p className="text-center text-[10px] text-neutral-500">
        Terima Kasih Sudah Berbelanja
        <br />
        Barang yang sudah dibeli tidak dapat ditukar
      </p>
    </div>
  )
}

export function printReceipt() {
  // Tambahkan body class sehingga CSS print hanya menampilkan struk
  document.body.classList.add('printing-receipt')
  window.print()
  setTimeout(() => {
    document.body.classList.remove('printing-receipt')
  }, 400)
}

export function ReceiptFooter() {
  return (
    <Button
      variant="outline"
      onClick={printReceipt}
      className="w-full"
    >
      <Printer className="h-4 w-4" />
      Cetak Struk
    </Button>
  )
}