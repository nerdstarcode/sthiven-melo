import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/atoms/Badge'
import { ChartCard } from '@/components/molecules/ChartCard'
import { LoadStatusChip } from '@/components/molecules/StatusChips'
import { DataTable } from '@/components/organisms/DataTable'
import type { PersonSummaryRow } from '@/features/location-overview/lib/personMetrics'
import { format, useTranslation } from '@/i18n'

export interface PeopleSummaryTableProps {
  rows: PersonSummaryRow[]
  onOpenPerson: (personId: string) => void
}

const NUMERIC = { align: 'right', numeric: true } as const

/** Métricas de cada pessoa no período: entregas, média, capacity, aderência e situação. */
export function PeopleSummaryTable({ rows, onOpenPerson }: PeopleSummaryTableProps) {
  const t = useTranslation('apps').dashboard.people

  const columns: ColumnDef<PersonSummaryRow, unknown>[] = [
    {
      id: 'name',
      header: t.name,
      accessorFn: (row) => row.person.nome,
    },
    {
      id: 'role',
      header: t.role,
      accessorFn: (row) => row.tipo ?? '',
      cell: ({ row }) => (row.original.tipo ? <Badge>{row.original.tipo}</Badge> : '—'),
    },
    { id: 'delivered', header: t.delivered, accessorFn: (row) => row.dev.delivered, meta: NUMERIC },
    {
      id: 'average',
      header: t.average,
      accessorFn: (row) => row.dev.averagePerSprint,
      meta: NUMERIC,
    },
    { id: 'capacity', header: t.capacity, accessorFn: (row) => row.dev.capacity, meta: NUMERIC },
    {
      id: 'adherence',
      header: t.adherence,
      accessorFn: (row) => row.dev.capacityAdherence ?? -1,
      cell: ({ row }) =>
        row.original.dev.capacityAdherence === null
          ? '—'
          : `${Math.round(row.original.dev.capacityAdherence)}%`,
      meta: NUMERIC,
    },
    {
      id: 'status',
      header: t.status,
      enableSorting: false,
      cell: ({ row }) => <LoadStatusChip status={row.original.dev.loadStatus} />,
    },
  ]

  return (
    <ChartCard title={t.title} description={t.description}>
      <DataTable
        data={rows}
        columns={columns}
        caption={t.title}
        emptyMessage={t.empty}
        onRowClick={(row) => onOpenPerson(row.person.id)}
        rowLabel={(row) => format(t.open, { name: row.person.nome })}
      />
    </ChartCard>
  )
}

export default PeopleSummaryTable
