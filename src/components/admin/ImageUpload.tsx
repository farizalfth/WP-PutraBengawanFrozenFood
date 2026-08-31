import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2, X } from 'lucide-react'
import { uploadImage } from '../../services/storage'
import ImageWithFallback from '../ui/ImageWithFallback'
import { useToast } from '../../stores/toastStore'
import { cn } from '../../lib/utils'

interface ImageUploadProps {
  value: string | null | undefined
  onChange: (url: string | null) => void
  folder?: string
  label?: string
}

export function ImageUpload({
  value,
  onChange,
  folder = 'products',
  label = 'Foto',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const toast = useToast()

  const handleFile = async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 5 MB.')
      return
    }
    setUploading(true)
    const res = await uploadImage(file, folder)
    setUploading(false)
    if (res.error) {
      toast.error(`Gagal mengunggah gambar: ${res.error}`)
      return
    }
    onChange(res.url)
    toast.success('Gambar berhasil diunggah.')
  }

  return (
    <div>
      {label && (
        <p className="mb-1.5 block text-sm font-semibold text-navy-800">
          {label}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-navy-200 bg-navy-50',
            uploading && 'opacity-60',
          )}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-navy-500" />
          ) : value ? (
            <>
              <ImageWithFallback
                src={value}
                alt="Pratinjau"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange(null)}
                className="absolute right-1.5 top-1.5 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
                aria-label="Hapus gambar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <ImagePlus className="h-8 w-8 text-navy-300" />
          )}
        </div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 transition-colors hover:bg-navy-50 disabled:opacity-60"
          >
            <ImagePlus className="h-4 w-4" />
            Pilih Gambar
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="ml-1 inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" /> Hapus
            </button>
          )}
          <p className="text-[11px] text-navy-400">
            PNG / JPG / WebP, maks 5 MB
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload