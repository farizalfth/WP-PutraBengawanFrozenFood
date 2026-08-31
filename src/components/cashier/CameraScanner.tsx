import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'
import { Camera, CameraOff, ScanLine, X } from 'lucide-react'
import { useToast } from '../../stores/toastStore'
import { Button } from '../ui/Button'

interface CameraScannerProps {
  open: boolean
  onClose: () => void
  onDetected: (barcode: string) => void
}

export function CameraScanner({ open, onClose, onDetected }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const onDetectedRef = useRef(onDetected)
  onDetectedRef.current = onDetected
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [flashOn, setFlashOn] = useState(false)
  const flashTrackRef = useRef<MediaStreamTrack | null>(null)
  const toast = useToast()

  useEffect(() => {
    if (!open) return

    let cancelled = false
    const reader = new BrowserMultiFormatReader()

    const start = async () => {
      setStarting(true)
      setError(null)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.setAttribute('playsinline', 'true')
          await videoRef.current.play().catch(() => undefined)
        }

        flashTrackRef.current = stream.getVideoTracks()[0] ?? null

        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: 'environment' } },
          videoRef.current ?? undefined,
          (result) => {
            if (result) {
              const text = result.getText()
              if (/^[0-9]{6,20}$/.test(text)) {
                stop()
                onDetectedRef.current(text)
              }
            }
          },
        )
        controlsRef.current = controls
      } catch (e) {
        setError(
          'Kamera tidak tersedia atau izin ditolak. Gunakan input manual atau scanner USB.',
        )
      } finally {
        if (!cancelled) setStarting(false)
      }
    }

    const stop = () => {
      controlsRef.current?.stop()
      controlsRef.current = null
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((t) => t.stop())
        videoRef.current.srcObject = null
      }
      flashTrackRef.current = null
    }

    start()

    return () => {
      cancelled = true
      controlsRef.current?.stop()
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((t) => t.stop())
        videoRef.current.srcObject = null
      }
      flashTrackRef.current = null
      setFlashOn(false)
    }
  }, [open])

  const exit = () => {
    controlsRef.current?.stop()
    controlsRef.current = null
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((t) => t.stop())
      videoRef.current.srcObject = null
    }
    flashTrackRef.current = null
    setFlashOn(false)
    onClose()
  }

  const toggleFlash = async () => {
    const track = flashTrackRef.current
    if (!track) {
      toast.info('Flash tidak didukung pada kamera ini.')
      return
    }
    const capabilities = track.getCapabilities?.() as {
      torch?: boolean
    } | undefined
    if (!capabilities?.torch) {
      toast.info('Flash tidak didukung pada kamera ini.')
      return
    }
    try {
      await track.applyConstraints({
        advanced: [{ torch: !flashOn }],
      } as never)
      setFlashOn((v) => !v)
    } catch {
      toast.info('Flash tidak didukung pada kamera ini.')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
          <p className="flex items-center gap-2 font-display text-sm font-bold text-navy-900">
            <ScanLine className="h-4 w-4 text-navy-500" />
            Scan Barcode dengan Kamera
          </p>
          <button
            type="button"
            onClick={exit}
            className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-800"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-square w-full bg-navy-950">
          <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
          {starting && (
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
              <Camera className="mr-2 h-5 w-5 animate-pulse" />
              Menyalakan kamera...
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <CameraOff className="h-10 w-10 text-navy-400" />
              <p className="max-w-sm text-sm text-navy-200">{error}</p>
              <Button variant="outline" onClick={exit}>
                Tutup
              </Button>
            </div>
          )}
          {!error && (
            <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-dashed border-white/50" />
          )}
        </div>

        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <p className="text-xs text-navy-500">
            Arahkan kamera ke kode barcode produk.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleFlash}>
              Flash
            </Button>
            <Button variant="ghost" size="sm" onClick={exit}>
              Batal
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CameraScanner