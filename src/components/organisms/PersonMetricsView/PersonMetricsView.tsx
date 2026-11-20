import type { EChartsOption } from 'echarts'
import { ArrowLeft, HeartHandshake } from 'lucide-react'
import { useMemo } from 'react'
import { Button } from '@/components/atoms/Button'
import { EChart } from '@/components/atoms/EChart'
import { ChartCard } from '@/components/molecules/ChartCard'
import { StatCard } from '@/components/molecules/StatCard'
import { LoadStatusChip } from '@/components/molecules/StatusChips'
import { useChartTheme } from '@/features/location-overview/charts/useChartTheme'
import type { PersonSummaryRow } from '@/features/location-overview/lib/personMetrics'
import type { PersonSupportView } from '@/features/location-overview/lib/supportMetrics'
import { format, useTranslation } from '@/i18n'

export interface PersonMetricsViewProps {
  row: PersonSummaryRow
  /** Apoio dado e recebido; null sem apoio. */
  support: PersonSupportView | null
  onBack?: () => void
  darkMode?: boolean
}

/** Métricas de uma pessoa: KPIs, entrega por sprint frente à alocação e o apoio. */
export function PersonMetricsView({ row, support, onBack, darkMode }: PersonMetricsViewProps) {
  const t = useTranslation('apps').dashboard.person
  const chart = useChartTheme(darkMode)
  const { dev, qa } = row

  const option = useMemo<EChartsOption>(() => {
    const bar = (name: string, data: number[], color: string) => ({
      name,
      type: 'bar' as const,
      stack: 'load',
      data,
      itemStyle: { color },
      barMaxWidth: 40,
    })
    return chart.baseOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { top: 0, textStyle: chart.textStyle },
      xAxis: chart.categoryAxis(dev.sprints.map((s) => s.label)),
      yAxis: chart.valueAxis(),
      series: [
        bar(t.onTime, dev.sprints.map((s) => s.onTime), chart.palette[2]),
        bar(t.delayedSeries, dev.sprints.map((s) => s.delayed), chart.palette[4]),
        bar(
          t.inProgress,
          dev.sprints.map((s) => s.inProgress + s.inProgressDelayed),
          chart.palette[1],
        ),
        {
          name: t.capacity,
          type: 'line',
          data: dev.sprints.map((s) => s.capacity),
          itemStyle: { color: chart.colors.strong },
        },
        {
          name: t.max,
          type: 'line',
          data: dev.sprints.map((s) => s.max),
          itemStyle: { color: chart.palette[5] },
          lineStyle: { type: 'dashed' },
        },
      ],
    })
  }, [dev.sprints, chart, t])

  const executed = qa.passed + qa.failed

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center gap-3'>
        {onBack && (
          <Button variant='ghost' size='sm' onClick={onBack}>
            <ArrowLeft size={14} aria-hidden /> {t.back}
          </Button>
        )}
        <h2 className='text-lg font-semibold text-fg-strong'>{row.person.nome}</h2>
        <LoadStatusChip status={dev.loadStatus} />
      </div>

      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        <StatCard
          label={t.delivered}
          value={dev.delivered}
          hint={format(t.deliveredHint, { count: dev.itemsDelivered })}
        />
        <StatCard label={t.average} value={dev.averagePerSprint} />
        <StatCard
          label={t.adherence}
          value={dev.capacityAdherence === null ? '—' : `${Math.round(dev.capacityAdherence)}%`}
          hint={format(t.adherenceHint, { count: dev.allocatedSprints })}
        />
        <StatCard
          label={t.delayed}
          value={dev.delayedPoints}
          hint={format(t.delayedHint, { percent: Math.round(dev.delayedPercent) })}
        />
        {qa.hasExecutions && (
          <>
            <StatCard label={t.tests} value={qa.executed} />
            <StatCard
              label={t.passRate}
              value={executed > 0 ? `${Math.round((qa.passed / executed) * 100)}%` : '—'}
            />
          </>
        )}
      </div>

      <ChartCard title={t.perSprint} description={t.perSprintDescription}>
        <EChart label={t.perSprint} option={option} />
      </ChartCard>

      {support && (
        <ChartCard title={t.support}>
          <ul className='flex flex-col gap-1 text-sm text-fg-strong'>
            {support.card && (
              <>
                <li className='flex items-center gap-2'>
                  <HeartHandshake size={14} aria-hidden className='text-accent' />
                  {format(t.supportGiven, {
                    list: support.card.given.map((g) => `${g.nome} (${g.points})`).join(', '),
                  })}
                </li>
                <li className='text-xs text-fg'>
                  {format(t.supportPoints, { points: support.card.points })}
                </li>
              </>
            )}
            {support.receivedFrom.length > 0 && (
              <li>
                {format(t.supportedBy, {
                  list: [...new Set(support.receivedFrom.map((r) => r.nome))].join(', '),
                })}
              </li>
            )}
          </ul>
        </ChartCard>
      )}
    </div>
  )
}

export default PersonMetricsView
