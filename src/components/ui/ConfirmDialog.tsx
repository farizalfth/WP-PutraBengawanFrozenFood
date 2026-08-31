import { TriangleAlert } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} size="sm" title={title}>
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <TriangleAlert className="h-7 w-7" />
        </div>
        <p className="text-sm text-navy-600">
          {description ?? 'Tindakan ini tidak dapat dibatalkan.'}
        </p>
        <div className="flex w-full gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog