import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { SegmentedControl } from '@/components/molecules/SegmentedControl'
import { LoadStatusChip, SprintPhaseChip } from '@/components/molecules/StatusChips'
import { DataTable } from '@/components/organisms/DataTable'
import { formatDateBR } from '@/features/location-overview/lib/dates'
import type { SprintPlanSummary } from '@/features/location-overview/lib/sprintPlanning'
import {
  formatSprintLabel,
  type Sprint,
  type SprintPhase,
} from '@/features/location-overview/lib/sprintsStorage'
import { format, useTranslation } from '@/i18n'

export type SprintPhaseFilter = 'active' | 'closed' | 'all'

export interface SprintTimelineRow {
  sprint: Sprint
  phase: SprintPhase
  plan: SprintPlanSummary
}

export interface SprintTimelineProps {
  rows: SprintTimelineRow[]
  phaseFilter: SprintPhaseFilter
  onPhaseFilterChange: (filter: SprintPhaseFilter) => void
  onOpen: (sprint: Sprint) => void
  onCreate: () => void
  onEdit: (sprint: Sprint) => void
  onDelete: (sprint: Sprint) => void
  /** Mensagem enquanto os dados carregam. */
  loading?: boolean
}

/** Filtra pela fase; fechadas vêm da mais recente para a mais antiga. */
export function visibleTimelineRows(
  rows: SprintTimelineRow[],
  filter: SprintPhaseFilter,
): SprintTimelineRow[] {
  if (filter === 'all') return rows
  if (filter === 'closed') return rows.filter((r) => r.phase === 'closed').reverse()
  return rows.filter((r) => r.phase !== 'closed')
}

/**
 * Linha do tempo das sprints, com a fase (fechada, atual ou aberta) e o planejado das squads ×
 * o previsto da alocação. Clicar numa sprint abre as squads dela.
 */
export function SprintTimeline({
  rows,
  phaseFilter,
  onPhaseFilterChange,
  onOpen,
  onCreate,
  onEdit,
  onDelete,
  loading = false,
}: SprintTimelineProps) {
  const t = useTranslation('apps')
  const visible = visibleTimelineRows(rows, phaseFilter)

  const columns: ColumnDef<SprintTimelineRow, unknown>[] = [
    {
      id: 'sprint',
      header: t.sprints.sprint,
      enableSorting: false,
      cell: ({ row }) => (
        <span className='font-medium text-fg-strong'>{formatSprintLabel(row.original.sprint)}</span>
      ),
    },
    {
      id: 'phase',
      header: t.timeline.phase,
      enableSorting: false,
      cell: ({ row }) => <SprintPhaseChip phase={row.original.phase} />,
    },
    {
      id: 'period',
      header: t.timeline.period,
      enableSorting: false,
      cell: ({ row }) =>
        `${formatDateBR(row.original.sprint.startDate)} – ${formatDateBR(row.original.sprint.endDate)}`,
    },
    {
      id: 'squads',
      header: t.timeline.squads,
      accessorFn: (r) => r.plan.squads,
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'people',
      header: t.timeline.people,
      accessorFn: (r) => r.plan.people,
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'capacity',
      header: t.timeline.capacityMax,
      enableSorting: false,
      cell: ({ row }) =>
        row.original.plan.squads > 0
          ? `${row.original.plan.capacity} / ${row.original.plan.max}`
          : '—',
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'planned',
      header: t.timeline.planned,
      accessorFn: (r) => r.plan.plannedPoints,
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'status',
      header: t.timeline.status,
      enableSorting: false,
      cell: ({ row }) => <LoadStatusChip status={row.original.plan.status} />,
    },
    {
      id: 'actions',
      header: t.common.actions,
      enableSorting: false,
      cell: ({ row }) => {
        const label = formatSprintLabel(row.original.sprint)
        return (
          <div className='flex gap-1' onClick={(e) => e.stopPropagation()}>
            <Button
              variant='ghost'
              size='sm'
              aria-label={`${t.common.edit} ${label}`}
              onClick={() => onEdit(row.original.sprint)}
            >
              <Pencil size={14} aria-hidden />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              aria-label={`${t.common.delete} ${label}`}
              onClick={() => onDelete(row.original.sprint)}
            >
              <Trash2 size={14} aria-hidden />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='max-w-2xl text-sm text-fg'>{t.timeline.description}</p>
        <Button onClick={onCreate}>
          <Plus size={14} aria-hidden /> {t.timeline.add}
        </Button>
      </div>

      <SegmentedControl
        aria-label={t.timeline.filterLabel}
        value={phaseFilter}
        onChange={onPhaseFilterChange}
        options={[
          { value: 'active', label: t.timeline.filterActive },
          { value: 'closed', label: t.timeline.filterClosed },
          { value: 'all', label: t.timeline.filterAll },
        ]}
      />

      <DataTable
        data={visible}
        columns={columns}
        caption={t.sprints.title}
        emptyMessage={
          loading ? t.common.loading : rows.length === 0 ? t.sprints.empty : t.timeline.emptyFiltered
        }
        onRowClick={(row) => onOpen(row.sprint)}
        rowLabel={(row) => format(t.timeline.openSprint, { sprint: formatSprintLabel(row.sprint) })}
      />
    </div>
  )
}

export default SprintTimeline
