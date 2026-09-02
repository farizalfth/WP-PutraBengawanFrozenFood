import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocateFixed, X } from 'lucide-react'

interface MapLocationPickerProps {
  initialLat?: number
  initialLng?: number
  onConfirm: (lat: number, lng: number) => void
  onClose: () => void
}

const OSM_TILE =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTRIB =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

function makeIcon(color: string) {
  return L.divIcon({
    className: 'ff-marker',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"><div style="transform:rotate(45deg);color:#fff;font-size:14px;line-height:1">📍</div></div>`,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -32],
  })
}

const pinIcon = makeIcon('#4f46e5')
const clickIcon = makeIcon('#0d9488')

export function MapLocationPicker({
  initialLat,
  initialLng,
  onConfirm,
  onClose,
}: MapLocationPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [marker, setMarker] = useState<L.Marker | null>(null)
  const [pending, setPending] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const hasInit = latInitialValid(initialLat) && latInitialValid(initialLng)

    const map = L.map(el, {
      center: hasInit ? [initialLat as number, initialLng as number] : [-7.0, 109.0],
      zoom: hasInit ? 15 : 11,
      scrollWheelZoom: true,
    })
    mapRef.current = map

    L.tileLayer(OSM_TILE, { attribution: OSM_ATTRIB, maxZoom: 19 }).addTo(map)

    if (hasInit) {
      const m = L.marker([initialLat as number, initialLng as number], { icon: pinIcon }).addTo(map)
      setMarker(m)
    }

    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat
      const lng = e.latlng.lng
      const m = marker ?? L.marker([lat, lng], { icon: clickIcon }).addTo(map)
      if (!marker) setMarker(m)
      m.setLatLng([lat, lng])
      setPending({ lat, lng })
      m.bindPopup(
        `<button class="ff-map-confirm">Konfirmasi Lokasi Ini</button>`,
        { closeButton: true },
      )
      m.openPopup()
      // override default popup close-on-zoom behavior for reliability
    })

    return () => {
      map.remove()
      mapRef.current = null
      setMarker(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // handle the confirm button inside popup
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.on('popupopen', () => {
      const btn = document.querySelector('.ff-map-confirm')
      btn?.addEventListener('click', () => {
        if (pending) onConfirm(pending.lat, pending.lng)
      })
    })
    return () => {
      map.off('popupopen')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, onConfirm])

  const confirmPending = () => {
    if (pending) onConfirm(pending.lat, pending.lng)
  }

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-navy-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-navy-100 bg-navy-50/60 px-3 py-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-700">
          <LocateFixed className="h-3.5 w-3.5 text-royal-600" />
          Klik di peta untuk memilih titik lokasi
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={confirmPending}
            disabled={!pending}
            className="rounded-full bg-royal-600 px-3 py-1 text-[11px] font-bold text-white transition-colors hover:bg-royal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Konfirmasi Lokasi
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup peta"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-100 text-navy-600 transition-colors hover:bg-navy-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div ref={containerRef} className="h-64 w-full" />
      <p className="px-3 py-2 text-[11px] text-navy-400">
        Klik titik pada peta, lalu tekan <b>Konfirmasi Lokasi</b>. Link akan
        otomatis terisi di kolom Titik Lokasi.
      </p>
    </div>
  )
}

function latInitialValid(n?: number) {
  return typeof n === 'number' && Number.isFinite(n)
}

export default MapLocationPicker