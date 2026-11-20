import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'hard' | 'soft'

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-elevated text-fg-strong',
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  hard: 'bg-sky-500/15 text-sky-300',
  soft: 'bg-fuchsia-500/15 text-fuchsia-300',
}

export interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  /** Mostra um botão "×" que chama `onRemove`. */
  onRemove?: () => void
  removeLabel?: string
  className?: string
}

/** Etiqueta curta (status, tag de skill, squad). */
export function Badge({
  children,
  tone = 'neutral',
  onRemove,
  removeLabel,
  className,
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        'inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      <span className='truncate'>{children}</span>
      {onRemove && (
        <button
          type='button'
          onClick={(event) => {
            event.stopPropagation()
            onRemove()
          }}
          aria-label={
            removeLabel ?? `Remover ${typeof children === 'string' ? children : ''}`.trim()
          }
          className='shrink-0 rounded-full p-0.5 hover:bg-white/10'
        >
          <X size={10} aria-hidden />
        </button>
      )}
    </span>
  )
}

export default Badge
