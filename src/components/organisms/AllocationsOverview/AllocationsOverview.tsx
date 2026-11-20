import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { DataTable } from '@/components/organisms/DataTable'
import { NewSprintAllocationModal } from '@/components/organisms/NewSprintAllocationModal'
import {
  buildAllocationGroups,
  type AllocationGroup,
} from '@/features/location-overview/lib/allocationGroups'
import { loadLevels } from '@/features/location-overview/lib/levelsStorage'
import { loadPeople } from '@/features/location-overview/lib/peopleStorage'
import {
  addPersonAllocations,
  loadPersonAllocations,
} from '@/features/location-overview/lib/personAllocationsStorage'
import { formatSprintLabel, loadSprints } from '@/features/location-overview/lib/sprintsStorage'
import { loadSquads } from '@/features/location-overview/lib/squadsStorage'
import { loadWorkItems } from '@/features/location-overview/lib/workItemsStorage'
import { useStoredList } from '@/features/shared/useStoredList'
import { format, useTranslation } from '@/i18n'

const points = (value: number) => value.toFixed(1)

export interface AllocationsOverviewProps {
  /** Abre o detalhe de um grupo (a página leva ao fluxo Sprint → Squad). */
  onOpenGroup: (squadId: string, sprintId: string) => void
}

/**
 * Todas as alocações agrupadas por squad + sprint (capacity, max e story points). Clicar num
 * grupo abre o detalhe da squad na sprint; "Nova alocação de sprint" cria um grupo de uma vez.
 */
export function AllocationsOverview({ onOpenGroup }: AllocationsOverviewProps) {
  const t = useTranslation('apps')
  const {
    items: allocations,
    setItems: setAllocations,
    ready,
  } = useStoredList(loadPersonAllocations)
  const { items: people } = useStoredList(loadPeople)
  const { items: squads } = useStoredList(loadSquads)
  const { items: sprints } = useStoredList(loadSprints)
  const { items: levels } = useStoredList(loadLevels)
  const { items: workItems } = useStoredList(loadWorkItems)
  const [creating, setCreating] = useState(false)

  const groups = useMemo(
    () => buildAllocationGroups(allocations, { squads, sprints, people, levels, workItems }),
    [allocations, squads, sprints, people, levels, workItems],
  )

  const columns: ColumnDef<AllocationGroup, unknown>[] = [
    { id: 'squad', header: t.allocations.squad, accessorFn: (g) => g.squad.name },
    {
      id: 'sprint',
      header: t.allocations.sprint,
      accessorFn: (g) => g.sprint.number,
      cell: ({ row }) => formatSprintLabel(row.original.sprint),
    },
    {
      id: 'people',
      header: t.allocations.people,
      accessorFn: (g) => g.entries.length,
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'capacity',
      header: t.allocations.capacity,
      accessorFn: (g) => g.capacityPoints,
      cell: ({ getValue }) => points(getValue<number>()),
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'max',
      header: t.allocations.max,
      accessorFn: (g) => g.maxPoints,
      cell: ({ getValue }) => points(getValue<number>()),
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'storyPoints',
      header: t.allocations.storyPoints,
      accessorFn: (g) => g.storyPoints,
      meta: { align: 'right', numeric: true },
    },
  ]

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <p className='text-sm text-fg'>{t.allocations.description}</p>
        <Button onClick={() => setCreating(true)}>
          <Plus size={14} aria-hidden /> {t.newAllocation.title}
        </Button>
      </div>

      <DataTable
        data={groups}
        columns={columns}
        caption={t.allocations.title}
        emptyMessage={ready ? t.allocations.empty : t.common.loading}
        onRowClick={(g) => onOpenGroup(g.squad.id, g.sprint.id)}
        rowLabel={(g) =>
          format(t.allocations.openGroup, {
            squad: g.squad.name,
            sprint: formatSprintLabel(g.sprint),
          })
        }
      />

      {creating && (
        <NewSprintAllocationModal
          open
          onClose={() => setCreating(false)}
          people={people}
          squads={squads}
          sprints={sprints}
          allocations={allocations}
          onSave={(entries) => {
            const result = addPersonAllocations(entries)
            if (result.duplicates.length) return t.group.duplicate
            setAllocations(result.allocations)
            setCreating(false)
            onOpenGroup(entries[0].squadId, entries[0].sprintId)
            return null
          }}
          onOpenGroup={(squadId, sprintId) => {
            setCreating(false)
            onOpenGroup(squadId, sprintId)
          }}
        />
      )}
    </div>
  )
}

export default AllocationsOverview
