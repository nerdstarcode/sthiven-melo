import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ChartCardProps {
  title: string
  description?: string
  /** Sem dados: mostra `emptyMessage` no lugar do conteúdo. */
  isEmpty?: boolean
  emptyMessage?: string
  className?: string
  children: ReactNode
}

/** Moldura dos gráficos e tabelas da análise: título, descrição e estado vazio. */
export function ChartCard({
  title,
  description,
  isEmpty = false,
  emptyMessage,
  className,
  children,
}: ChartCardProps) {
  return (
    <section
      aria-label={title}
      className={twMerge(
        'flex min-w-0 flex-col gap-3 rounded-md border border-line bg-surface-elevated p-4',
        className,
      )}
    >
      <header>
        <h2 className='text-sm font-semibold text-fg-strong'>{title}</h2>
        {description && <p className='mt-0.5 text-xs text-fg'>{description}</p>}
      </header>
      {isEmpty ? <p className='py-8 text-center text-sm text-fg'>{emptyMessage}</p> : children}
    </section>
  )
}

export default ChartCard
