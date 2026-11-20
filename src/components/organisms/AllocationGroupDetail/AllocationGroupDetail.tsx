import type { ColumnDef } from '@tanstack/react-table'
import { HeartHandshake, Pencil, Plus, Trash2, UserPlus } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { SelectField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import { NumberCell } from '@/components/molecules/NumberCell'
import { StatCard } from '@/components/molecules/StatCard'
import { SupportForm } from '@/components/molecules/SupportForm'
import { UndoNotice } from '@/components/molecules/UndoNotice'
import { DataTable } from '@/components/organisms/DataTable'
import { personPoints } from '@/features/location-overview/lib/allocationGroups'
import type { LevelConfig } from '@/features/location-overview/lib/levelsStorage'
import type { Person } from '@/features/location-overview/lib/peopleStorage'
import {
  buildDefaultAllocation,
  computeAllocatedDays,
  pointsForEntry,
  remainingPercentage,
  type PersonAllocation,
} from '@/features/location-overview/lib/personAllocationsStorage'
import {
  supportIssue,
  type PersonSupport,
  type SupportContext,
  type SupportDraft,
  type SupportDraftError,
} from '@/features/location-overview/lib/personSupportsStorage'
import { formatSprintLabel, type Sprint } from '@/features/location-overview/lib/sprintsStorage'
import type { Squad } from '@/features/location-overview/lib/squadsStorage'
import type { WorkItemRow } from '@/features/location-overview/lib/workItems'
import { format, useTranslation } from '@/i18n'

const points = (value: number) => value.toFixed(1)

export interface AllocationGroupDetailProps {
  squad: Squad
  sprint: Sprint
  /** Alocações deste grupo (squad + sprint). */
  entries: PersonAllocation[]
  /** Todas as alocações, para calcular o que sobra para cada pessoa na sprint. */
  allocations: PersonAllocation[]
  people: Person[]
  squads: Squad[]
  levels: LevelConfig[]
  workItems: WorkItemRow[]
  summary: { capacityPoints: number; maxPoints: number; storyPoints: number }
  /** As ações devolvem uma mensagem de erro, ou null quando deu certo. */
  onAdd: (entries: Omit<PersonAllocation, 'id'>[]) => string | null
  /** Remove e devolve as alocações removidas (para o Desfazer). */
  onRemove: (ids: string[]) => PersonAllocation[]
  onRestore: (entries: PersonAllocation[]) => void
  onSetPercentage: (ids: string[], percentage: number) => string | null
  onMove: (ids: string[], squadId: string) => string | null
  onEdit: (entry: PersonAllocation) => void
  /** Atalho para cadastrar uma pessoa nova sem sair do fluxo. */
  onCreatePerson?: () => void
  /** Apoios (mentoria) da sprint: mostra quem apoia quem e permite cadastrar pela linha. */
  support?: {
    supports: PersonSupport[]
    context: SupportContext
    onAdd: (draft: SupportDraft) => SupportDraftError | null
  }
  /** Conteúdo abaixo da tabela (ex.: cobertura de skills). */
  children?: ReactNode
}

/**
 * Uma squad numa sprint, feito para ajustes rápidos: adicionar pela linha do topo (a % já vem
 * com o que sobra para a pessoa), puxar os membros que faltam, editar a % na própria tabela,
 * remover com "Desfazer", mover todos para outra squad e cadastrar apoios pela linha.
 */
export function AllocationGroupDetail({
  squad,
  sprint,
  entries,
  allocations,
  people,
  squads,
  levels,
  workItems,
  summary,
  onAdd,
  onRemove,
  onRestore,
  onSetPercentage,
  onMove,
  onEdit,
  onCreatePerson,
  support,
  children,
}: AllocationGroupDetailProps) {
  const t = useTranslation('apps')
  const [newPersonId, setNewPersonId] = useState('')
  const [newPercentage, setNewPercentage] = useState(100)
  const [error, setError] = useState<string>()
  const [undo, setUndo] = useState<{ items: PersonAllocation[]; message: string } | null>(null)
  const [supportFor, setSupportFor] = useState<string | null>(null)
  /** Alocações que o modal de mover vai levar (todas ou só as selecionadas); null = fechado. */
  const [moveIds, setMoveIds] = useState<string[] | null>(null)
  const [moveTarget, setMoveTarget] = useState('')
  const [moveError, setMoveError] = useState<string>()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkPercentage, setBulkPercentage] = useState(100)

  // Só vale o que ainda está no grupo (depois de mover/remover, a seleção some sozinha).
  const selected = new Set(entries.filter((e) => selectedIds.has(e.id)).map((e) => e.id))

  const peopleById = new Map(people.map((p) => [p.id, p]))
  const nameOf = (personId: string) => peopleById.get(personId)?.nome ?? '—'
  const inGroup = new Set(entries.map((e) => e.personId))
  const isMember = (p: Person) => p.squadIds.includes(squad.id)

  // Membros da squad primeiro, depois o resto, cada parte em ordem alfabética.
  const candidates = people
    .filter((p) => !inGroup.has(p.id))
    .sort((a, b) => Number(isMember(b)) - Number(isMember(a)) || a.nome.localeCompare(b.nome))
  const missingMembers = buildDefaultAllocation(people, allocations, squad.id, sprint.id).filter(
    (d) => d.selected,
  )

  const report = (message: string | null) => {
    setError(message ?? undefined)
    return message === null
  }

  const selectPerson = (personId: string) => {
    setNewPersonId(personId)
    if (personId) setNewPercentage(remainingPercentage(allocations, personId, sprint.id))
  }

  const add = (event: FormEvent) => {
    event.preventDefault()
    if (!newPersonId) return report(t.group.choosePerson)
    const ok = report(
      onAdd([
        { personId: newPersonId, squadId: squad.id, sprintId: sprint.id, percentage: newPercentage },
      ]),
    )
    if (ok) {
      setNewPersonId('')
      setNewPercentage(100)
    }
  }

  const addMembers = () =>
    report(
      onAdd(
        missingMembers.map((d) => ({
          personId: d.personId,
          squadId: squad.id,
          sprintId: sprint.id,
          percentage: d.percentage,
        })),
      ),
    )

  const remove = (entry: PersonAllocation) => {
    const removed = onRemove([entry.id])
    if (!removed.length) return
    setError(undefined)
    setUndo({ items: removed, message: format(t.group.removed, { name: nameOf(entry.personId) }) })
  }

  const openMove = (ids: string[]) => {
    setMoveTarget('')
    setMoveError(undefined)
    setMoveIds(ids)
  }

  const move = () => {
    if (!moveIds) return
    if (!moveTarget) return setMoveError(t.allocations.moveTargetRequired)
    const message = onMove(moveIds, moveTarget)
    if (message) return setMoveError(message)
    setMoveIds(null)
    setSelectedIds(new Set())
  }

  const applyBulkPercentage = () => {
    if (report(onSetPercentage([...selected], bulkPercentage))) setSelectedIds(new Set())
  }

  const removeSelected = () => {
    const removed = onRemove([...selected])
    if (!removed.length) return
    setError(undefined)
    setSelectedIds(new Set())
    setUndo({ items: removed, message: format(t.group.removedMany, { count: removed.length }) })
  }

  const pointsOf = (entry: PersonAllocation) =>
    pointsForEntry(entry, sprint, peopleById.get(entry.personId), levels)

  const sprintSupports = support
    ? support.supports.filter(
        (s) => s.sprintId === sprint.id && !supportIssue(s, support.context),
      )
    : []
  const supportLabels = (personId: string) => [
    ...sprintSupports
      .filter((s) => s.supporterId === personId)
      .map((s) =>
        format(t.supports.supports, { name: nameOf(s.supportedId), percentage: s.percentage }),
      ),
    ...sprintSupports
      .filter((s) => s.supportedId === personId)
      .map((s) =>
        format(t.supports.supportedBy, { name: nameOf(s.supporterId), percentage: s.percentage }),
      ),
  ]
  const allocatedInSprint = new Set(
    allocations.filter((a) => a.sprintId === sprint.id && a.percentage > 0).map((a) => a.personId),
  )

  const columns: ColumnDef<PersonAllocation, unknown>[] = [
    { id: 'person', header: t.allocations.person, accessorFn: (e) => nameOf(e.personId) },
    {
      accessorKey: 'percentage',
      header: '%',
      cell: ({ row }) => (
        <NumberCell
          value={row.original.percentage}
          min={1}
          aria-label={format(t.group.percentageOf, { name: nameOf(row.original.personId) })}
          onCommit={(value) => report(onSetPercentage([row.original.id], value))}
        />
      ),
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'days',
      header: t.allocations.days,
      accessorFn: (e) => computeAllocatedDays(e.percentage, sprint.totalValidDays),
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'capacity',
      header: t.allocations.capacity,
      accessorFn: (e) => pointsOf(e).capacity,
      cell: ({ getValue }) => points(getValue<number>()),
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'max',
      header: t.allocations.max,
      accessorFn: (e) => pointsOf(e).max,
      cell: ({ getValue }) => points(getValue<number>()),
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'storyPoints',
      header: t.allocations.storyPoints,
      accessorFn: (e) =>
        personPoints(workItems, squad, sprint, peopleById.get(e.personId)).storyPoints,
      meta: { align: 'right', numeric: true },
    },
    ...(support
      ? [
          {
            id: 'support',
            header: t.supports.column,
            enableSorting: false,
            cell: ({ row }) => (
              <div className='flex flex-wrap gap-1'>
                {supportLabels(row.original.personId).map((label) => (
                  <Badge key={label}>{label}</Badge>
                ))}
              </div>
            ),
          } satisfies ColumnDef<PersonAllocation, unknown>,
        ]
      : []),
    {
      id: 'actions',
      header: t.common.actions,
      enableSorting: false,
      cell: ({ row }) => {
        const name = nameOf(row.original.personId)
        return (
          <div className='flex gap-1'>
            {support && (
              <Button
                variant='ghost'
                size='sm'
                aria-label={format(t.supports.rowAction, { name })}
                onClick={() => setSupportFor(row.original.personId)}
              >
                <HeartHandshake size={14} aria-hidden />
              </Button>
            )}
            <Button
              variant='ghost'
              size='sm'
              aria-label={`${t.common.edit} ${name}`}
              onClick={() => onEdit(row.original)}
            >
              <Pencil size={14} aria-hidden />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              aria-label={format(t.group.remove, { name })}
              onClick={() => remove(row.original)}
            >
              <Trash2 size={14} aria-hidden />
            </Button>
          </div>
        )
      },
    },
  ]

  const totalPercentage = entries.reduce((sum, e) => sum + e.percentage, 0)

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='text-lg font-semibold text-fg-strong'>
            {squad.name} · {formatSprintLabel(sprint)}
          </h2>
          <p className='text-xs text-fg'>
            {format(t.group.summary, { count: entries.length, percentage: totalPercentage })}
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button
            variant='secondary'
            disabled={entries.length === 0}
            onClick={() => openMove(entries.map((e) => e.id))}
          >
            {t.allocations.moveAll}
          </Button>
          <Button variant='secondary' disabled={missingMembers.length === 0} onClick={addMembers}>
            <UserPlus size={14} aria-hidden />
            {missingMembers.length > 0
              ? format(t.group.addMembers, { count: missingMembers.length })
              : t.group.allMembersIn}
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        <StatCard label={t.allocations.people} value={entries.length} />
        <StatCard label={t.allocations.capacity} value={points(summary.capacityPoints)} />
        <StatCard label={t.allocations.max} value={points(summary.maxPoints)} />
        <StatCard label={t.allocations.storyPoints} value={summary.storyPoints} />
      </div>

      <form
        onSubmit={add}
        aria-label={t.group.addFormLabel}
        className='flex flex-wrap items-end gap-3 rounded-md border border-line p-3'
      >
        <div className='min-w-56 flex-1'>
          <SelectField
            label={t.group.personToAdd}
            value={newPersonId}
            placeholder={t.allocations.selectPerson}
            options={candidates.map((p) => ({
              value: p.id,
              label: isMember(p) ? p.nome : format(t.group.outsideSquad, { name: p.nome }),
            }))}
            onChange={(e) => selectPerson(e.target.value)}
          />
        </div>
        <label className='flex flex-col gap-1'>
          <span className='text-xs font-medium text-fg'>{t.group.percentageToAdd}</span>
          <Input
            type='number'
            min={0}
            max={100}
            value={newPercentage}
            className='w-24 text-right'
            onChange={(e) => setNewPercentage(Number(e.target.value))}
          />
        </label>
        <Button type='submit' disabled={!newPersonId}>
          <Plus size={14} aria-hidden /> {t.common.add}
        </Button>
        {onCreatePerson && (
          <Button variant='ghost' onClick={onCreatePerson}>
            <UserPlus size={14} aria-hidden /> {t.group.createPerson}
          </Button>
        )}
      </form>

      {error && (
        <p role='alert' className='text-sm text-danger'>
          {error}
        </p>
      )}
      {undo && (
        <UndoNotice
          message={undo.message}
          undoLabel={t.group.undo}
          closeLabel={t.common.close}
          onUndo={() => {
            onRestore(undo.items)
            setUndo(null)
          }}
          onClose={() => setUndo(null)}
        />
      )}

      {selected.size > 0 && (
        <div
          role='toolbar'
          aria-label={format(t.group.selected, { count: selected.size })}
          className='flex flex-wrap items-end gap-3 rounded-md border border-accent/50 bg-surface-elevated p-3'
        >
          <p className='self-center text-sm font-medium text-fg-strong'>
            {format(t.group.selected, { count: selected.size })}
          </p>
          <label className='flex flex-col gap-1'>
            <span className='text-xs font-medium text-fg'>{t.group.bulkPercentage}</span>
            <Input
              type='number'
              min={1}
              max={100}
              value={bulkPercentage}
              className='w-24 text-right'
              onChange={(e) => setBulkPercentage(Number(e.target.value))}
            />
          </label>
          <Button variant='secondary' onClick={applyBulkPercentage}>
            {t.group.applyPercentage}
          </Button>
          <Button variant='secondary' onClick={() => openMove([...selected])}>
            {t.group.moveSelected}
          </Button>
          <Button variant='secondary' onClick={removeSelected}>
            <Trash2 size={14} aria-hidden /> {t.group.removeSelected}
          </Button>
          <Button variant='ghost' onClick={() => setSelectedIds(new Set())}>
            {t.group.clearSelection}
          </Button>
        </div>
      )}

      <DataTable
        data={entries}
        columns={columns}
        caption={`${squad.name} · ${formatSprintLabel(sprint)}`}
        emptyMessage={t.group.empty}
        selection={{
          selected,
          onChange: setSelectedIds,
          getId: (e) => e.id,
          rowLabel: (e) => format(t.group.selectRow, { name: nameOf(e.personId) }),
          allLabel: t.group.selectAll,
        }}
      />

      {children}

      <Modal
        open={moveIds !== null}
        onClose={() => setMoveIds(null)}
        title={moveIds?.length === entries.length ? t.allocations.moveAll : t.group.moveSelected}
        closeLabel={t.common.close}
        footer={
          <>
            <Button variant='secondary' onClick={() => setMoveIds(null)}>
              {t.common.cancel}
            </Button>
            <Button onClick={move}>
              {format(t.allocations.moveButton, { count: moveIds?.length ?? 0 })}
            </Button>
          </>
        }
      >
        <div className='flex flex-col gap-4'>
          <p className='text-sm text-fg'>
            {format(t.allocations.moveHelp, {
              squad: squad.name,
              sprint: formatSprintLabel(sprint),
            })}
          </p>
          <SelectField
            label={t.allocations.moveTarget}
            value={moveTarget}
            placeholder={t.allocations.selectSquad}
            error={moveError}
            options={squads
              .filter((s) => s.id !== squad.id)
              .map((s) => ({ value: s.id, label: s.name }))}
            onChange={(e) => setMoveTarget(e.target.value)}
          />
        </div>
      </Modal>

      {support && (
        <Modal
          open={supportFor !== null}
          onClose={() => setSupportFor(null)}
          title={format(t.supports.modalTitle, {
            name: supportFor ? nameOf(supportFor) : '',
            sprint: formatSprintLabel(sprint),
          })}
          closeLabel={t.common.close}
        >
          <SupportForm
            key={supportFor ?? 'fechado'}
            people={people.filter((p) => allocatedInSprint.has(p.id))}
            cargos={support.context.cargos}
            initialSupporterId={supportFor ?? ''}
            onSubmit={(draft) => {
              const result = support.onAdd({ ...draft, sprintId: sprint.id })
              if (!result) setSupportFor(null)
              return result
            }}
          />
        </Modal>
      )}
    </div>
  )
}

export default AllocationGroupDetail
