import type { ColumnDef } from '@tanstack/react-table'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { SelectField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import { StatCard } from '@/components/molecules/StatCard'
import { AllocationFormModal, EMPTY_ALLOCATION } from '@/components/organisms/AllocationFormModal'
import { DataTable } from '@/components/organisms/DataTable'
import { SkillCoveragePanel } from '@/components/organisms/SkillCoveragePanel'
import {
  buildAllocationGroups,
  groupKey,
  personPoints,
  type AllocationGroup,
} from '@/features/location-overview/lib/allocationGroups'
import { loadLevels } from '@/features/location-overview/lib/levelsStorage'
import { addPeopleToSquad, loadPeople } from '@/features/location-overview/lib/peopleStorage'
import {
  computeAllocatedDays,
  deletePersonAllocation,
  loadPersonAllocations,
  moveAllocationsToSquad,
  pointsForEntry,
  upsertPersonAllocation,
  type PersonAllocation,
} from '@/features/location-overview/lib/personAllocationsStorage'
import { formatSprintLabel, loadSprints } from '@/features/location-overview/lib/sprintsStorage'
import { loadSquads } from '@/features/location-overview/lib/squadsStorage'
import { loadWorkItems } from '@/features/location-overview/lib/workItemsStorage'
import { useStoredList } from '@/features/shared/useStoredList'
import { loadPersonSkills, loadSkills } from '@/features/skills/lib/skillsStorage'
import { format, useTranslation } from '@/i18n'

const points = (value: number) => value.toFixed(1)

export interface AllocationsOverviewProps {
  /** Grupo aberto inicialmente (`squadId::sprintId`). */
  initialGroupKey?: string
}

/**
 * Alocações agrupadas por squad + sprint (capacity, max e story points). Clicar num grupo abre
 * o detalhe: pessoas alocadas, ações de editar/mover e a cobertura de skills da squad na sprint.
 */
export function AllocationsOverview({ initialGroupKey }: AllocationsOverviewProps) {
  const t = useTranslation('apps')
  const {
    items: allocations,
    setItems: setAllocations,
    ready,
  } = useStoredList(loadPersonAllocations)
  const { items: people, setItems: setPeople } = useStoredList(loadPeople)
  const { items: squads } = useStoredList(loadSquads)
  const { items: sprints } = useStoredList(loadSprints)
  const { items: levels } = useStoredList(loadLevels)
  const { items: workItems } = useStoredList(loadWorkItems)
  const { items: skills } = useStoredList(loadSkills)
  const { items: personSkills } = useStoredList(loadPersonSkills)

  const [openKey, setOpenKey] = useState<string | null>(initialGroupKey ?? null)
  const [editing, setEditing] = useState<PersonAllocation | null>(null)
  const [moveTarget, setMoveTarget] = useState<string | null>(null)
  const [moveError, setMoveError] = useState<string>()

  const groups = useMemo(
    () => buildAllocationGroups(allocations, { squads, sprints, people, levels, workItems }),
    [allocations, squads, sprints, people, levels, workItems],
  )
  const active = groups.find((g) => g.key === openKey)
  const personById = useMemo(() => new Map(people.map((p) => [p.id, p])), [people])
  const groupLabel = (g: AllocationGroup) => `${g.squad.name} · ${formatSprintLabel(g.sprint)}`

  const save = (allocation: PersonAllocation) => {
    setAllocations(upsertPersonAllocation(allocation))
    setEditing(null)
  }

  const move = () => {
    if (!active || !moveTarget) return setMoveError(t.allocations.moveTargetRequired)
    const result = moveAllocationsToSquad(
      active.entries.map((e) => e.id),
      moveTarget,
    )
    if (result.conflicts.length > 0) {
      const names = result.conflicts.map((c) => personById.get(c.personId)?.nome ?? '—')
      return setMoveError(format(t.allocations.moveConflicts, { names: names.join(', ') }))
    }
    setPeople(
      addPeopleToSquad(
        moveTarget,
        active.entries.map((e) => e.personId),
      ),
    )
    setAllocations(result.allocations)
    setOpenKey(groupKey(moveTarget, active.sprint.id))
    setMoveTarget(null)
  }

  const groupColumns: ColumnDef<AllocationGroup, unknown>[] = [
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

  const entryColumns: ColumnDef<PersonAllocation, unknown>[] = active
    ? [
        {
          id: 'person',
          header: t.allocations.person,
          accessorFn: (e) => personById.get(e.personId)?.nome ?? '—',
        },
        {
          accessorKey: 'percentage',
          header: '%',
          meta: { align: 'right', numeric: true },
        },
        {
          id: 'days',
          header: t.allocations.days,
          accessorFn: (e) => computeAllocatedDays(e.percentage, active.sprint.totalValidDays),
          meta: { align: 'right', numeric: true },
        },
        {
          id: 'capacity',
          header: t.allocations.capacity,
          accessorFn: (e) =>
            pointsForEntry(e, active.sprint, personById.get(e.personId), levels).capacity,
          cell: ({ getValue }) => points(getValue<number>()),
          meta: { align: 'right', numeric: true },
        },
        {
          id: 'max',
          header: t.allocations.max,
          accessorFn: (e) =>
            pointsForEntry(e, active.sprint, personById.get(e.personId), levels).max,
          cell: ({ getValue }) => points(getValue<number>()),
          meta: { align: 'right', numeric: true },
        },
        {
          id: 'storyPoints',
          header: t.allocations.storyPoints,
          accessorFn: (e) =>
            personPoints(workItems, active.squad, active.sprint, personById.get(e.personId))
              .storyPoints,
          meta: { align: 'right', numeric: true },
        },
        {
          id: 'actions',
          header: t.common.actions,
          enableSorting: false,
          cell: ({ row }) => {
            const name = personById.get(row.original.personId)?.nome ?? ''
            return (
              <div className='flex gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  aria-label={`${t.common.edit} ${name}`}
                  onClick={() => setEditing(row.original)}
                >
                  <Pencil size={14} aria-hidden />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  aria-label={`${t.common.delete} ${name}`}
                  onClick={() => setAllocations(deletePersonAllocation(row.original.id))}
                >
                  <Trash2 size={14} aria-hidden />
                </Button>
              </div>
            )
          },
        },
      ]
    : []

  const formModal = (
    <AllocationFormModal
      allocation={editing}
      onClose={() => setEditing(null)}
      onSave={save}
      allocations={allocations}
      people={people}
      squads={squads}
      sprints={sprints}
    />
  )

  if (active) {
    return (
      <div className='flex flex-col gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              aria-label={t.allocations.back}
              onClick={() => setOpenKey(null)}
            >
              <ArrowLeft size={18} aria-hidden />
            </Button>
            <h2 className='text-lg font-semibold text-fg-strong'>{groupLabel(active)}</h2>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='secondary'
              onClick={() => {
                setMoveTarget('')
                setMoveError(undefined)
              }}
            >
              {t.allocations.moveAll}
            </Button>
            <Button
              onClick={() =>
                setEditing({
                  ...EMPTY_ALLOCATION,
                  squadId: active.squad.id,
                  sprintId: active.sprint.id,
                })
              }
            >
              <Plus size={14} aria-hidden /> {t.allocations.addPerson}
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          <StatCard label={t.allocations.people} value={active.entries.length} />
          <StatCard label={t.allocations.capacity} value={points(active.capacityPoints)} />
          <StatCard label={t.allocations.max} value={points(active.maxPoints)} />
          <StatCard label={t.allocations.storyPoints} value={active.storyPoints} />
        </div>

        <DataTable
          data={active.entries}
          columns={entryColumns}
          caption={groupLabel(active)}
          emptyMessage={t.allocations.emptyGroup}
        />

        <SkillCoveragePanel
          squad={active.squad}
          sprintId={active.sprint.id}
          allocations={allocations}
          people={people}
          skills={skills}
          personSkills={personSkills}
        />

        {formModal}

        <Modal
          open={moveTarget !== null}
          onClose={() => setMoveTarget(null)}
          title={t.allocations.moveAll}
          closeLabel={t.common.close}
          footer={
            <>
              <Button variant='secondary' onClick={() => setMoveTarget(null)}>
                {t.common.cancel}
              </Button>
              <Button onClick={move}>
                {format(t.allocations.moveButton, { count: active.entries.length })}
              </Button>
            </>
          }
        >
          <div className='flex flex-col gap-4'>
            <p className='text-sm text-fg'>
              {format(t.allocations.moveHelp, {
                squad: active.squad.name,
                sprint: formatSprintLabel(active.sprint),
              })}
            </p>
            <SelectField
              label={t.allocations.moveTarget}
              value={moveTarget ?? ''}
              placeholder={t.allocations.selectSquad}
              error={moveError}
              options={squads
                .filter((s) => s.id !== active.squad.id)
                .map((s) => ({ value: s.id, label: s.name }))}
              onChange={(e) => setMoveTarget(e.target.value)}
            />
          </div>
        </Modal>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <p className='text-sm text-fg'>{t.allocations.description}</p>
        <Button onClick={() => setEditing(EMPTY_ALLOCATION)}>
          <Plus size={14} aria-hidden /> {t.allocations.add}
        </Button>
      </div>

      <DataTable
        data={groups}
        columns={groupColumns}
        caption={t.allocations.title}
        emptyMessage={ready ? t.allocations.empty : t.common.loading}
        onRowClick={(g) => setOpenKey(g.key)}
        rowLabel={(g) =>
          format(t.allocations.openGroup, {
            squad: g.squad.name,
            sprint: formatSprintLabel(g.sprint),
          })
        }
      />

      {formModal}
    </div>
  )
}

export default AllocationsOverview
