import type { ColumnDef } from '@tanstack/react-table'
import type { EChartsOption } from 'echarts'
import { useMemo } from 'react'
import { EChart } from '@/components/atoms/EChart'
import { ChartCard } from '@/components/molecules/ChartCard'
import { DataTable } from '@/components/organisms/DataTable'
import { useChartTheme } from '@/features/location-overview/charts/useChartTheme'
import type { SprintDelivery } from '@/features/location-overview/lib/squadDelivery'
import { useTranslation } from '@/i18n'

export interface SquadsDeliveryChartProps {
  deliveries: SprintDelivery[]
  darkMode?: boolean
}

const NUMERIC = { align: 'right', numeric: true } as const

/** SP entregues por squad em cada sprint (barras empilhadas) e o total planejado (linha). */
export function SquadsDeliveryChart({ deliveries, darkMode }: SquadsDeliveryChartProps) {
  const t = useTranslation('apps').dashboard.squads
  const chart = useChartTheme(darkMode)
  const squadNames = useMemo(() => deliveries[0]?.squads.map((s) => s.name) ?? [], [deliveries])

  const option = useMemo<EChartsOption>(
    () =>
      chart.baseOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { top: 0, textStyle: chart.textStyle },
        xAxis: chart.categoryAxis(deliveries.map((d) => d.label)),
        yAxis: chart.valueAxis(),
        series: [
          ...squadNames.map((name, i) => ({
            name,
            type: 'bar' as const,
            stack: 'delivered',
            data: deliveries.map((d) => d.squads[i]?.delivered ?? 0),
            itemStyle: { color: chart.palette[i % chart.palette.length] },
            barMaxWidth: 40,
          })),
          {
            name: t.planned,
            type: 'line' as const,
            data: deliveries.map((d) => d.planned),
            itemStyle: { color: chart.colors.strong },
            lineStyle: { type: 'dashed' as const },
          },
        ],
      }),
    [deliveries, squadNames, chart, t],
  )

  const columns = useMemo<ColumnDef<SprintDelivery, unknown>[]>(
    () => [
      { accessorKey: 'label', header: t.sprint },
      ...squadNames.map(
        (name, i): ColumnDef<SprintDelivery, unknown> => ({
          id: `squad-${i}`,
          header: name,
          accessorFn: (row) => row.squads[i]?.delivered ?? 0,
          cell: ({ row }) => {
            const squad = row.original.squads[i]
            return squad ? `${squad.delivered} / ${squad.planned}` : '—'
          },
          meta: NUMERIC,
        }),
      ),
      {
        id: 'total',
        header: t.total,
        accessorFn: (row) => row.delivered,
        cell: ({ row }) => `${row.original.delivered} / ${row.original.planned}`,
        meta: NUMERIC,
      },
    ],
    [squadNames, t],
  )

  return (
    <ChartCard
      title={t.title}
      description={t.description}
      isEmpty={deliveries.length === 0}
      emptyMessage={t.empty}
    >
      <EChart label={t.title} option={option} />
      <DataTable
        data={deliveries}
        columns={columns}
        caption={`${t.delivered} / ${t.planned}`}
      />
    </ChartCard>
  )
}

export default SquadsDeliveryChart
