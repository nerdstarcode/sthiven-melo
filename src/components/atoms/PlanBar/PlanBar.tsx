import { twMerge } from 'tailwind-merge'

export interface PlanBarProps {
  planned: number
  capacity: number
  max: number
  maxExtended: number
  /** Classe de cor do preenchimento (ex.: `bg-success`). */
  fillClassName?: string
  /** Descrição acessível dos números. */
  label: string
}

/**
 * Barra compacta de planejamento: preenchimento = planejado; traço cheio = previsto; traço
 * tracejado = máximo; faixa listrada = extensão acima do máximo.
 */
export function PlanBar({
  planned,
  capacity,
  max,
  maxExtended,
  fillClassName = 'bg-accent',
  label,
}: PlanBarProps) {
  const scale = Math.max(planned, maxExtended) * 1.05 || 1
  const at = (value: number) => `${Math.min(100, (value / scale) * 100)}%`
  return (
    <div role='img' aria-label={label} className='relative h-2.5 w-full rounded-full bg-surface-muted'>
      <div
        data-part='extension'
        className='absolute inset-y-0 bg-[repeating-linear-gradient(135deg,transparent_0_3px,rgb(245_158_11/0.45)_3px_5px)]'
        style={{ left: at(max), width: `calc(${at(maxExtended)} - ${at(max)})` }}
      />
      <div
        data-part='planned'
        className={twMerge('absolute inset-y-0 left-0 rounded-full', fillClassName)}
        style={{ width: at(planned) }}
      />
      <span
        data-part='capacity'
        className='absolute -inset-y-1 w-0.5 bg-fg-strong'
        style={{ left: at(capacity) }}
      />
      <span
        data-part='max'
        className='absolute -inset-y-1 border-l-2 border-dashed border-fg-strong'
        style={{ left: at(max) }}
      />
    </div>
  )
}

export default PlanBar
