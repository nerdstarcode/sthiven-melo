import { Plus, UserPlus } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/atoms/Button'
import { PlanBar } from '@/components/atoms/PlanBar'
import {
  LOAD_STATUS_STYLE,
  LoadStatusChip,
  SprintPhaseChip,
} from '@/components/molecules/StatusChips'
import { formatDateBR } from '@/features/location-overview/lib/dates'
import type { CoverageSummary } from '@/features/location-overview/lib/skillCoverage'
import type {
  SprintPlanSummary,
  SquadSprintPlan,
} from '@/features/location-overview/lib/sprintPlanning'
import {
  formatSprintLabel,
  type Sprint,
  type SprintPhase,
} from '@/features/location-overview/lib/sprintsStorage'
import type { Squad } from '@/features/location-overview/lib/squadsStorage'
import { format, useTranslation } from '@/i18n'

export interface SprintSquadsPlanProps {
  sprint: Sprint
  phase: SprintPhase
  plans: SquadSprintPlan[]
  summary: SprintPlanSummary
  /** Cobertura de skills por squad na sprint (só as squads com requisitos). */
  coverage?: Map<string, CoverageSummary>
  onOpenSquad: (squad: Squad) => void
  onCreateDefault: (squad: Squad) => void
  onCreateSquad?: () => void
  /** Conteúdo abaixo dos cards (ex.: apoios da sprint). */
  children?: ReactNode
}

function Figure({ label, value }: { label: string; value: string | number }) {
  return (
    <div className='flex flex-col'>
      <span className='text-[11px] text-fg'>{label}</span>
      <span className='text-sm font-semibold text-fg-strong tabular-nums'>{value}</span>
    </div>
  )
}

/**
 * Uma sprint por squad: cada card compara os SP planejados com o previsto da alocação. Squad
 * sem alocação oferece a alocação padrão com os membros dela.
 */
export function SprintSquadsPlan({
  sprint,
  phase,
  plans,
  summary,
  coverage,
  onOpenSquad,
  onCreateDefault,
  onCreateSquad,
  children,
}: SprintSquadsPlanProps) {
  const t = useTranslation('apps')

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h2 className='flex items-center gap-2 text-lg font-semibold text-fg-strong'>
            {formatSprintLabel(sprint)} <SprintPhaseChip phase={phase} />
          </h2>
          <p className='text-xs text-fg'>
            {formatDateBR(sprint.startDate)} – {formatDateBR(sprint.endDate)} ·{' '}
            {format(t.plan.validDays, { days: sprint.totalValidDays })}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-x-6 gap-y-2'>
          <Figure
            label={t.plan.squadsAllocated}
            value={format(t.plan.of, { count: summary.squads, total: plans.length })}
          />
          <Figure label={t.plan.people} value={summary.people} />
          <Figure label={t.plan.capacityMax} value={`${summary.capacity} / ${summary.max}`} />
          <Figure label={t.plan.planned} value={summary.plannedPoints} />
          <LoadStatusChip status={summary.status} />
        </div>
      </div>

      {plans.length === 0 ? (
        <div className='flex flex-col items-start gap-3 rounded-md border border-dashed border-line p-6'>
          <p className='text-sm text-fg'>{t.plan.noSquads}</p>
          {onCreateSquad && (
            <Button variant='secondary' onClick={onCreateSquad}>
              <Plus size={14} aria-hidden /> {t.plan.createSquad}
            </Button>
          )}
        </div>
      ) : (
        <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3' aria-label={t.plan.listLabel}>
          {plans.map((plan) => {
            const skills = coverage?.get(plan.squad.id)
            return plan.people > 0 ? (
              <li key={plan.squad.id}>
                <button
                  type='button'
                  onClick={() => onOpenSquad(plan.squad)}
                  aria-label={format(t.plan.openSquad, { squad: plan.squad.name })}
                  className='flex h-full w-full flex-col gap-3 rounded-md border border-line bg-surface-elevated p-4 text-left transition-colors hover:border-accent focus-visible:border-accent focus-visible:outline-none'
                >
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <p className='font-semibold text-fg-strong'>{plan.squad.name}</p>
                      <p className='text-xs text-fg'>
                        {format(t.plan.cardPeople, {
                          count: plan.people,
                          percentage: plan.percentage,
                        })}
                      </p>
                    </div>
                    <LoadStatusChip status={plan.status} />
                  </div>
                  <PlanBar
                    planned={plan.plannedPoints}
                    capacity={plan.capacity}
                    max={plan.max}
                    maxExtended={plan.maxExtended}
                    fillClassName={plan.status ? LOAD_STATUS_STYLE[plan.status].fill : undefined}
                    label={format(t.plan.bar, {
                      planned: plan.plannedPoints,
                      capacity: plan.capacity,
                      max: plan.max,
                      extended: plan.maxExtended,
                    })}
                  />
                  <div className='grid grid-cols-4 gap-2'>
                    <Figure label={t.plan.figurePlanned} value={plan.plannedPoints} />
                    <Figure label={t.plan.figureCapacity} value={plan.capacity} />
                    <Figure label={t.plan.figureMax} value={plan.max} />
                    <Figure label={t.plan.figureExtended} value={plan.maxExtended} />
                  </div>
                  {skills && skills.total > 0 && (
                    <p className='text-xs text-fg'>
                      {format(t.plan.coverage, { covered: skills.covered, gaps: skills.gap })}
                    </p>
                  )}
                </button>
              </li>
            ) : (
              <li
                key={plan.squad.id}
                aria-label={format(t.plan.noAllocation, { squad: plan.squad.name })}
                className='flex h-full flex-col gap-3 rounded-md border border-dashed border-line p-4'
              >
                <div className='flex items-start justify-between gap-2'>
                  <div>
                    <p className='font-semibold text-fg-strong'>{plan.squad.name}</p>
                    <p className='text-xs text-fg'>
                      {plan.plannedPoints > 0
                        ? format(t.plan.plannedWithoutCapacity, { points: plan.plannedPoints })
                        : t.plan.nothingPlanned}
                    </p>
                  </div>
                  <LoadStatusChip status={null} />
                </div>
                <Button
                  variant='secondary'
                  className='mt-auto'
                  onClick={() => onCreateDefault(plan.squad)}
                >
                  <UserPlus size={14} aria-hidden /> {t.plan.createDefault}
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      <p className='text-xs text-fg'>{t.plan.legend}</p>

      {children}
    </div>
  )
}

export default SprintSquadsPlan
