import {
  ArrowDown,
  ArrowUp,
  Check,
  Flame,
  TimerReset,
  type LucideIcon,
} from 'lucide-react'
import { Badge, type BadgeTone } from '@/components/atoms/Badge'
import type { LoadStatus } from '@/features/location-overview/lib/loadStatus'
import type { SprintPhase } from '@/features/location-overview/lib/sprintsStorage'
import { useTranslation } from '@/i18n'

export const LOAD_STATUS_STYLE: Record<
  LoadStatus,
  { tone: BadgeTone; fill: string; icon: LucideIcon }
> = {
  below: { tone: 'accent', fill: 'bg-accent', icon: ArrowDown },
  within: { tone: 'success', fill: 'bg-success', icon: Check },
  above: { tone: 'warning', fill: 'bg-warning', icon: ArrowUp },
  extension: { tone: 'warning', fill: 'bg-warning', icon: TimerReset },
  overload: { tone: 'danger', fill: 'bg-danger', icon: Flame },
}

export interface LoadStatusChipProps {
  /** null = sem alocação (sem previsto para comparar). */
  status: LoadStatus | null
}

/** Situação da carga em palavras, com ícone e cor: abaixo, no esperado, acima, extensão ou sobrecarga. */
export function LoadStatusChip({ status }: LoadStatusChipProps) {
  const t = useTranslation('apps')
  if (!status) {
    return (
      <span className='inline-flex items-center rounded-full border border-dashed border-line px-2 py-0.5 text-xs text-fg'>
        {t.loadStatus.none}
      </span>
    )
  }
  const { tone, icon: Icon } = LOAD_STATUS_STYLE[status]
  return (
    <Badge tone={tone}>
      <Icon size={12} aria-hidden />
      {t.loadStatus[status]}
    </Badge>
  )
}

const PHASE_TONE: Record<SprintPhase, BadgeTone> = {
  closed: 'neutral',
  current: 'accent',
  open: 'neutral',
}

/** Situação da sprint: fechada, atual ou aberta. */
export function SprintPhaseChip({ phase }: { phase: SprintPhase }) {
  const t = useTranslation('apps')
  return (
    <Badge
      tone={PHASE_TONE[phase]}
      className={phase === 'open' ? 'border border-accent/60 bg-transparent' : undefined}
    >
      {t.phase[phase]}
    </Badge>
  )
}
