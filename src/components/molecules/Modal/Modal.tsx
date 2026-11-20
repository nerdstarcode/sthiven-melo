import { X } from 'lucide-react'
import { useEffect, useId, type ReactNode } from 'react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Ações do rodapé (ex.: Cancelar / Salvar). */
  footer?: ReactNode
  closeLabel?: string
}

/** Diálogo centralizado. Fecha no Esc, no "×" ou ao clicar fora do painel. */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeLabel = 'Fechar',
}: ModalProps) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      data-testid='modal-backdrop'
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
      onClick={onClose}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className='flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg border border-line bg-surface-elevated shadow-2xl'
        onClick={(event) => event.stopPropagation()}
      >
        <header className='flex items-center justify-between border-b border-line px-4 py-3'>
          <h2 id={titleId} className='text-sm font-semibold text-fg-strong'>
            {title}
          </h2>
          <button
            type='button'
            onClick={onClose}
            aria-label={closeLabel}
            className='rounded-md p-1 text-fg hover:bg-surface-muted hover:text-fg-strong'
          >
            <X size={16} aria-hidden />
          </button>
        </header>
        <div className='flex-1 overflow-y-auto px-4 py-4'>{children}</div>
        {footer && (
          <footer className='flex items-center justify-end gap-2 border-t border-line px-4 py-3'>
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}

export default Modal
