import type { EChartsOption } from 'echarts'
import { useContext, useMemo } from 'react'
import { EChart } from '@/components/atoms/EChart'
import { ChartCard } from '@/components/molecules/ChartCard'
import { ThemeContext } from '@/contexts/ThemeContext'
import { useChartTheme } from '@/features/location-overview/charts/useChartTheme'
import type { SprintMetrics } from '@/features/location-overview/lib/azure/sprintMetrics'
import { formatDayMonth } from '@/features/location-overview/lib/dates'
import { stateColors } from '@/features/location-overview/lib/stateColors'
import { useTranslation } from '@/i18n'

export interface SprintChartsProps {
  metrics: Pick<SprintMetrics, 'burnup' | 'byType' | 'byState'>
  /** Tema dos gráficos; sem ele, segue o tema do site. */
  darkMode?: boolean
}

/** Burnup da sprint e a distribuição dos story points por tipo e por estado. */
export function SprintCharts({ metrics, darkMode }: SprintChartsProps) {
  const t = useTranslation('apps').analysis
  const theme = useContext(ThemeContext)
  const isDark = darkMode ?? theme?.darkMode ?? true
  const chart = useChartTheme(isDark)
  const { burnup, byType, byState } = metrics

  const burnupOption = useMemo<EChartsOption>(
    () =>
      chart.baseOption({
        tooltip: { trigger: 'axis' },
        legend: { top: 0, textStyle: chart.textStyle },
        xAxis: chart.categoryAxis(burnup.map((p) => formatDayMonth(p.day))),
        yAxis: chart.valueAxis(),
        series: [
          {
            name: t.burnup.delivered,
            type: 'bar',
            data: burnup.map((p) => p.delivered),
            itemStyle: { color: chart.palette[1] },
            barMaxWidth: 28,
          },
          {
            name: t.burnup.cumulative,
            type: 'line',
            data: burnup.map((p) => p.cumulative),
            itemStyle: { color: chart.palette[2] },
            lineStyle: { width: 3 },
          },
          {
            name: t.burnup.ideal,
            type: 'line',
            data: burnup.map((p) => p.ideal),
            itemStyle: { color: chart.colors.text },
            lineStyle: { type: 'dashed' },
            symbol: 'none',
          },
          {
            name: t.burnup.scope,
            type: 'line',
            data: burnup.map((p) => p.scope),
            itemStyle: { color: chart.palette[5] },
            lineStyle: { type: 'dotted' },
            symbol: 'none',
          },
        ],
      }),
    [burnup, chart, t],
  )

  const typeOption = useMemo<EChartsOption>(
    () =>
      chart.baseOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { top: 0, textStyle: chart.textStyle },
        xAxis: chart.categoryAxis(byType.map((g) => g.key)),
        yAxis: [chart.valueAxis(), chart.valueAxis({ splitLine: { show: false } })],
        series: [
          {
            name: t.byType.points,
            type: 'bar',
            data: byType.map((g) => g.storyPoints),
            itemStyle: { color: chart.palette[0] },
            label: { show: true, position: 'top', color: chart.colors.text },
            barMaxWidth: 40,
          },
          {
            name: t.byType.count,
            type: 'bar',
            yAxisIndex: 1,
            data: byType.map((g) => g.count),
            itemStyle: { color: chart.palette[3] },
            barMaxWidth: 40,
          },
        ],
      }),
    [byType, chart, t],
  )

  const stateOption = useMemo<EChartsOption>(() => {
    const colors = stateColors(
      byState.map((g) => g.key),
      chart.palette,
      { mode: 'default', isDark },
    )
    return chart.baseOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} SP ({d}%)' },
      legend: { bottom: 0, textStyle: chart.textStyle },
      series: [
        {
          name: t.byState.title,
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '45%'],
          label: { color: chart.colors.text, formatter: '{b}: {c}' },
          data: byState.map((g, i) => ({
            name: g.key,
            value: g.storyPoints,
            itemStyle: { color: colors[i] },
          })),
        },
      ],
    })
  }, [byState, chart, isDark, t])

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
      <ChartCard
        title={t.burnup.title}
        description={t.burnup.description}
        isEmpty={burnup.length === 0}
        emptyMessage={t.chartEmpty}
        className='lg:col-span-2'
      >
        <EChart label={t.burnup.title} option={burnupOption} />
      </ChartCard>
      <ChartCard title={t.byType.title} isEmpty={byType.length === 0} emptyMessage={t.chartEmpty}>
        <EChart label={t.byType.title} option={typeOption} height={280} />
      </ChartCard>
      <ChartCard
        title={t.byState.title}
        isEmpty={byState.length === 0}
        emptyMessage={t.chartEmpty}
      >
        <EChart label={t.byState.title} option={stateOption} height={280} />
      </ChartCard>
    </div>
  )
}

export default SprintCharts
