import type { ColumnDef } from '@tanstack/react-table'
import { Badge, type BadgeTone } from '@/components/atoms/Badge'
import { ChartCard } from '@/components/molecules/ChartCard'
import { DataTable } from '@/components/organisms/DataTable'
import type {
  AllocationComparisonRow,
  AllocationStatus,
} from '@/features/location-overview/lib/azure/sprintMetrics'
import { useTranslation } from '@/i18n'

export interface SprintPeopleTableProps {
  rows: AllocationComparisonRow[]
}

const STATUS_TONE: Record<AllocationStatus, BadgeTone> = {
  'sem-cadastro': 'neutral',
  'sem-alocacao': 'neutral',
  abaixo: 'warning',
  dentro: 'success',
  acima: 'danger',
}

const NUMERIC = { align: 'right', numeric: true } as const

/** Story points de cada pessoa × Capacity e Max da alocação, com a situação de cada uma. */
export function SprintPeopleTable({ rows }: SprintPeopleTableProps) {
  const t = useTranslation('apps').analysis.people

  const columns: ColumnDef<AllocationComparisonRow, unknown>[] = [
    { accessorKey: 'name', header: t.name },
    {
      id: 'percentage',
      header: t.percentage,
      accessorFn: (row) => row.percentage ?? -1,
      cell: ({ row }) => (row.original.percentage === null ? '—' : `${row.original.percentage}%`),
      meta: NUMERIC,
    },
    { accessorKey: 'capacity', header: t.capacity, meta: NUMERIC },
    { accessorKey: 'max', header: t.max, meta: NUMERIC },
    { accessorKey: 'assigned', header: t.assigned, meta: NUMERIC },
    { accessorKey: 'delivered', header: t.delivered, meta: NUMERIC },
    {
      accessorKey: 'status',
      header: t.status,
      cell: ({ row }) => (
        <Badge tone={STATUS_TONE[row.original.status]}>{t.statuses[row.original.status]}</Badge>
      ),
    },
  ]

  return (
    <ChartCard title={t.title} description={t.description}>
      <DataTable data={rows} columns={columns} caption={t.title} emptyMessage={t.empty} />
    </ChartCard>
  )
}

export default SprintPeopleTable
