import type { EChartsOption } from 'echarts'
import { useMemo } from 'react'
import { EChart } from '@/components/atoms/EChart'
import { ChartCard } from '@/components/molecules/ChartCard'
import { StatCard } from '@/components/molecules/StatCard'
import { useChartTheme } from '@/features/location-overview/charts/useChartTheme'
import type { TestRunsSummary } from '@/features/location-overview/lib/azure/mappers'
import { formatDayMonth } from '@/features/location-overview/lib/dates'
import { percentOf } from '@/features/location-overview/lib/numbers'
import { useTranslation } from '@/i18n'

export interface SprintTestRunsSummaryProps {
  /** Resumo gravado na sincronização; null quando a squad/sprint não tem test runs. */
  summary: TestRunsSummary | null
  darkMode?: boolean
}

/** Test runs da sprint: totais, taxa de aprovação, resultados e runs por dia. */
export function SprintTestRunsSummary({ summary, darkMode }: SprintTestRunsSummaryProps) {
  const t = useTranslation('apps').analysis.tests
  const chart = useChartTheme(darkMode)

  const option = useMemo<EChartsOption | null>(() => {
    if (!summary) return null
    const days = Object.keys(summary.runsByDay).sort()
    return chart.baseOption({
      tooltip: { trigger: 'axis' },
      xAxis: chart.categoryAxis(days.map(formatDayMonth)),
      yAxis: chart.valueAxis({ minInterval: 1 }),
      series: [
        {
          name: t.byDay,
          type: 'bar',
          data: days.map((d) => summary.runsByDay[d]),
          itemStyle: { color: chart.palette[6] },
          barMaxWidth: 28,
        },
      ],
    })
  }, [summary, chart, t])

  if (!summary || !option) {
    return (
      <ChartCard title={t.title} isEmpty emptyMessage={t.empty}>
        {null}
      </ChartCard>
    )
  }

  const executed = summary.passed + summary.failed
  const results: [string, number][] = [
    [t.passed, summary.passed],
    [t.failed, summary.failed],
    [t.notRun, summary.notRun],
    [t.notApplicable, summary.notApplicable],
  ]

  return (
    <ChartCard title={t.title}>
      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        <StatCard
          label={t.runs}
          value={summary.runCount}
          hint={`${t.automated}: ${summary.automatedRuns} · ${t.manual}: ${summary.manualRuns}`}
        />
        <StatCard label={t.total} value={summary.totalTests} />
        <StatCard
          label={t.passRate}
          value={`${Math.round(percentOf(summary.passed, executed))}%`}
        />
        <StatCard label={t.failed} value={summary.failed} />
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        <dl aria-label={t.results} className='grid grid-cols-2 gap-x-4 gap-y-1 self-start text-sm'>
          {results.map(([label, value]) => (
            <div key={label} className='contents'>
              <dt className='text-fg'>{label}</dt>
              <dd className='text-right font-mono text-fg-strong tabular-nums'>{value}</dd>
            </div>
          ))}
        </dl>
        <EChart label={t.byDay} option={option} height={200} />
      </div>
    </ChartCard>
  )
}

export default SprintTestRunsSummary
