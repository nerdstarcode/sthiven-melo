import { AlertTriangle } from 'lucide-react'

export interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  /** Mensagem de alerta: mostra um ícone ao lado do valor e o texto abaixo. */
  alert?: string
}

/** Indicador numérico com rótulo (KPIs dos apps). */
export function StatCard({ label, value, hint, alert }: StatCardProps) {
  return (
    <div className='rounded-md border border-line bg-surface-elevated px-4 py-3'>
      <p className='text-xs font-medium text-fg'>{label}</p>
      <p className='mt-1 flex items-center gap-2 text-2xl font-semibold text-fg-strong tabular-nums'>
        {value}
        {alert && <AlertTriangle size={18} className='text-warning' aria-hidden />}
      </p>
      {hint && <p className='mt-0.5 text-xs text-fg'>{hint}</p>}
      {alert && (
        <p role='status' className='mt-0.5 text-xs font-medium text-warning'>
          {alert}
        </p>
      )}
    </div>
  )
}

export default StatCard
