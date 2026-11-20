import { StatCard } from '@/components/molecules/StatCard'
import type { SprintMetrics } from '@/features/location-overview/lib/azure/sprintMetrics'
import { percentOf, round1 } from '@/features/location-overview/lib/numbers'
import { format, useTranslation } from '@/i18n'

export interface SprintKpisProps {
  metrics: SprintMetrics
  workItemsCount: number
}

/** Indicadores da squad na sprint: pontos, capacidade da alocação, entregas e testes. */
export function SprintKpis({ metrics, workItemsCount }: SprintKpisProps) {
  const t = useTranslation('apps').analysis.kpis
  const { capacity, max, entries, missingLevel } = metrics.sprintAllocation
  const hasAllocation = entries.length > 0
  const overMax = hasAllocation && metrics.totalPoints > max
  const allocationHint = hasAllocation
    ? format(t.allocated, { count: entries.length })
    : t.noAllocation
  const missingAlert = missingLevel > 0 ? format(t.missingLevel, { count: missingLevel }) : undefined

  return (
    <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
      <StatCard
        label={t.totalPoints}
        value={metrics.totalPoints}
        hint={format(t.items, { count: workItemsCount })}
        alert={
          overMax ? format(t.overMax, { value: round1(metrics.totalPoints - max) }) : undefined
        }
      />
      <StatCard label={t.effort} value={metrics.totalEffort} hint={t.effortHint} />
      <StatCard
        label={t.capacity}
        value={hasAllocation ? capacity : '—'}
        hint={allocationHint}
        alert={missingAlert}
      />
      <StatCard label={t.max} value={hasAllocation ? max : '—'} hint={allocationHint} />
      <StatCard
        label={t.delivered}
        value={metrics.deliveredPoints}
        hint={format(t.deliveredHint, {
          percent: Math.round(percentOf(metrics.deliveredPoints, metrics.totalPoints)),
        })}
      />
      <StatCard label={t.unassigned} value={metrics.unassigned.storyPoints} />
      <StatCard label={t.people} value={metrics.byPerson.length} />
      <StatCard
        label={t.testRuns}
        value={metrics.testRuns?.runCount ?? '—'}
        hint={
          metrics.testRuns
            ? format(t.testsHint, { count: metrics.testRuns.totalTests })
            : undefined
        }
      />
    </div>
  )
}

export default SprintKpis
