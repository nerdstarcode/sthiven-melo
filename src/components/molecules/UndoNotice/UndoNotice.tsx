import { X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

export interface UndoNoticeProps {
  message: string
  undoLabel: string
  closeLabel: string
  onUndo: () => void
  onClose: () => void
}

/** Aviso de remoção com "Desfazer". */
export function UndoNotice({ message, undoLabel, closeLabel, onUndo, onClose }: UndoNoticeProps) {
  return (
    <div
      role='status'
      className='flex items-center justify-between gap-3 rounded-md border border-line bg-surface-elevated px-3 py-2 text-sm text-fg-strong'
    >
      <span>{message}</span>
      <div className='flex items-center gap-1'>
        <Button variant='secondary' size='sm' onClick={onUndo}>
          {undoLabel}
        </Button>
        <Button variant='ghost' size='sm' aria-label={closeLabel} onClick={onClose}>
          <X size={14} aria-hidden />
        </Button>
      </div>
    </div>
  )
}

export default UndoNotice
