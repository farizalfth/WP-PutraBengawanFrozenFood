import { useEffect, useRef } from 'react'

/**
 * Menangani input barcode dari dua sumber:
 * - USB barcode scanner: mengetik barcode dengan cepat lalu menekan Enter.
 * - Input manual: pemanggilan `handleKey` untuk menambah karakter.
 *
 * Hook mendengarkan event `keydown` global dan mengakumulasi karakter
 * yang masuk cepat (interval < 50ms antar karakter) sebagai sinyal scanner.
 */
export function useBarcodeScanner(onScan: (barcode: string) => void) {
  const bufferRef = useRef('')
  const lastKeyTimeRef = useRef(0)
  const callbackRef = useRef(onScan)
  callbackRef.current = onScan

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now()
      const isDigit = /^[0-9]$/.test(e.key)
      const isPrint = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey

      // Scanner mengetik sangat cepat; mulailah segmen baru jika jeda panjang
      if (now - lastKeyTimeRef.current > 60 && bufferRef.current.length > 0) {
        bufferRef.current = ''
      }
      lastKeyTimeRef.current = now

      if (e.key === 'Enter') {
        const raw = bufferRef.current.trim()
        bufferRef.current = ''
        if (/^[0-9]{6,20}$/.test(raw)) {
          callbackRef.current(raw)
        }
        return
      }

      if (isPrint && !isDigit) {
        // Karakter non-digit membatalkan segmen scanner (mis. pencarian manual)
        bufferRef.current = ''
      } else if (isDigit) {
        if (bufferRef.current.length < 24) {
          bufferRef.current += e.key
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const submitManual = (barcode: string) => {
    const cleaned = barcode.replace(/\D/g, '')
    if (/^[0-9]{6,20}$/.test(cleaned)) {
      callbackRef.current(cleaned)
      return true
    }
    return false
  }

  return { submitManual }
}