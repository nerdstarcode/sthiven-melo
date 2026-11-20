import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { SelectField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import type { Person } from '@/features/location-overview/lib/peopleStorage'
import {
  buildDefaultAllocation,
  computeAllocatedDays,
  remainingPercentage,
  sumPercentageForPersonInSprint,
  validateAllocationPercentages,
  type AllocationDraft,
  type PercentageIssue,
  type PersonAllocation,
} from '@/features/location-overview/lib/personAllocationsStorage'
import { formatSprintLabel, type Sprint } from '@/features/location-overview/lib/sprintsStorage'
import type { Squad } from '@/features/location-overview/lib/squadsStorage'
import { format, useTranslation } from '@/i18n'
import type { AppsTranslation } from '@/i18n/apps'

/** Mensagem traduzida de um problema de %. */
export function percentageIssueMessage(
  issue: PercentageIssue,
  t: AppsTranslation['allocations'],
): string {
  return issue.code === 'overAllocated'
    ? format(t.overAllocated, { other: issue.otherPercentage })
    : t.invalidPercentage
}

export interface NewSprintAllocationModalProps {
  open: boolean
  onClose: () => void
  people: Person[]
  squads: Squad[]
  sprints: Sprint[]
  allocations: PersonAllocation[]
  /** Grava as alocações; devolve uma mensagem de erro ou null quando deu certo. */
  onSave: (entries: Omit<PersonAllocation, 'id'>[]) => string | null
  /** Abre o grupo squad/sprint que já existe. */
  onOpenGroup: (squadId: string, sprintId: string) => void
  /** Já abre com a squad/sprint escolhidas (renderize com `key` para recomeçar com outras). */
  initialSquadId?: string
  initialSprintId?: string
}

/**
 * "Nova alocação de sprint": escolhe squad e sprint e já traz os membros da squad com o que
 * sobra para cada um na sprint. Dá para desmarcar, ajustar a %, incluir alguém de fora da
 * squad e salvar todos de uma vez.
 */
export function NewSprintAllocationModal({
  open,
  onClose,
  people,
  squads,
  sprints,
  allocations,
  onSave,
  onOpenGroup,
  initialSquadId = '',
  initialSprintId = '',
}: NewSprintAllocationModalProps) {
  const t = useTranslation('apps')
  const [squadId, setSquadId] = useState(initialSquadId)
  const [sprintId, setSprintId] = useState(initialSprintId)
  const [drafts, setDrafts] = useState<AllocationDraft[]>(() =>
    initialSquadId && initialSprintId
      ? buildDefaultAllocation(people, allocations, initialSquadId, initialSprintId)
      : [],
  )
  const [error, setError] = useState<string>()

  const peopleById = useMemo(() => new Map(people.map((p) => [p.id, p])), [people])
  const sprint = sprints.find((s) => s.id === sprintId)
  const squad = squads.find((s) => s.id === squadId)
  const existingCount = allocations.filter(
    (a) => a.squadId === squadId && a.sprintId === sprintId,
  ).length

  const reset = (nextSquadId: string, nextSprintId: string) => {
    setSquadId(nextSquadId)
    setSprintId(nextSprintId)
    setDrafts(
      nextSquadId && nextSprintId
        ? buildDefaultAllocation(people, allocations, nextSquadId, nextSprintId)
        : [],
    )
    setError(undefined)
  }

  const update = (personId: string, patch: Partial<AllocationDraft>) =>
    setDrafts((current) => current.map((d) => (d.personId === personId ? { ...d, ...patch } : d)))

  const selected = drafts.filter((d) => d.selected)
  const errors = validateAllocationPercentages(
    allocations,
    selected.map((d) => ({ id: '', personId: d.personId, sprintId, percentage: d.percentage })),
  )

  const inGroup = new Set(
    allocations
      .filter((a) => a.squadId === squadId && a.sprintId === sprintId)
      .map((a) => a.personId),
  )
  const extraOptions = people
    .filter((p) => !inGroup.has(p.id) && !drafts.some((d) => d.personId === p.id))
    .map((p) => ({ value: p.id, label: p.nome }))

  const addExtra = (personId: string) => {
    if (!personId) return
    setDrafts((current) => [
      ...current,
      {
        personId,
        percentage: remainingPercentage(allocations, personId, sprintId),
        used: sumPercentageForPersonInSprint(allocations, personId, sprintId),
        selected: true,
      },
    ])
  }

  const save = () => {
    if (!squadId || !sprintId) return setError(t.newAllocation.chooseSquadSprint)
    if (selected.length === 0) return setError(t.newAllocation.chooseSomeone)
    if (errors.size > 0) return setError(t.newAllocation.fixPercentages)
    const message = onSave(
      selected.map((d) => ({ personId: d.personId, squadId, sprintId, percentage: d.percentage })),
    )
    if (message) setError(message)
  }

  const allSelected = drafts.length > 0 && drafts.every((d) => d.selected)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.newAllocation.title}
      closeLabel={t.common.close}
      footer={
        <>
          <Button variant='secondary' onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button onClick={save} disabled={selected.length === 0}>
            {format(t.newAllocation.submit, { count: selected.length })}
          </Button>
        </>
      }
    >
      <div className='flex flex-col gap-4'>
        {error && (
          <p role='alert' className='text-sm text-danger'>
            {error}
          </p>
        )}

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <SelectField
            label={t.allocations.squad}
            value={squadId}
            placeholder={t.allocations.selectSquad}
            options={squads.map((s) => ({ value: s.id, label: s.name }))}
            onChange={(e) => reset(e.target.value, sprintId)}
          />
          <SelectField
            label={t.allocations.sprint}
            value={sprintId}
            placeholder={t.allocations.selectSprint}
            options={sprints.map((s) => ({ value: s.id, label: formatSprintLabel(s) }))}
            onChange={(e) => reset(squadId, e.target.value)}
          />
        </div>

        {squad && sprint && (
          <>
            {existingCount > 0 && (
              <div className='flex flex-wrap items-center justify-between gap-2 rounded-md bg-surface-muted px-3 py-2 text-sm text-fg'>
                <span>
                  {format(t.newAllocation.existing, { squad: squad.name, count: existingCount })}
                </span>
                <Button size='sm' variant='secondary' onClick={() => onOpenGroup(squadId, sprintId)}>
                  {t.newAllocation.openExisting}
                </Button>
              </div>
            )}

            <p className='text-sm text-fg'>
              {format(t.newAllocation.help, { squad: squad.name, days: sprint.totalValidDays })}
            </p>

            {drafts.length === 0 ? (
              <p className='text-sm text-fg'>
                {format(t.newAllocation.noMembers, { squad: squad.name })}
              </p>
            ) : (
              <table className='w-full text-sm' aria-label={t.newAllocation.tableLabel}>
                <thead>
                  <tr className='border-b border-line text-left text-xs text-fg'>
                    <th className='w-8 py-2'>
                      <input
                        type='checkbox'
                        className='accent-accent'
                        aria-label={t.common.selectAll}
                        checked={allSelected}
                        onChange={() =>
                          setDrafts((current) =>
                            current.map((d) => ({ ...d, selected: !allSelected })),
                          )
                        }
                      />
                    </th>
                    <th className='py-2'>{t.allocations.person}</th>
                    <th className='py-2 text-right'>{t.newAllocation.otherSquads}</th>
                    <th className='py-2 text-right'>%</th>
                    <th className='py-2 text-right'>{t.allocations.days}</th>
                    <th className='w-8' />
                  </tr>
                </thead>
                <tbody>
                  {drafts.map((draft) => {
                    const person = peopleById.get(draft.personId)
                    const name = person?.nome ?? '—'
                    const issue = draft.selected ? errors.get(draft.personId) : undefined
                    const isMember = person?.squadIds.includes(squadId)
                    return (
                      <tr key={draft.personId} className='border-b border-line last:border-0'>
                        <td className='py-2'>
                          <input
                            type='checkbox'
                            className='accent-accent'
                            aria-label={format(t.newAllocation.allocate, { name })}
                            checked={draft.selected}
                            onChange={() => update(draft.personId, { selected: !draft.selected })}
                          />
                        </td>
                        <td className='py-2 text-fg-strong'>
                          {name}
                          <span className='ml-2 text-xs text-fg'>
                            {person?.nivel}
                            {!isMember && ` · ${t.newAllocation.outside}`}
                          </span>
                          {issue && (
                            <p className='text-xs text-danger'>
                              {percentageIssueMessage(issue, t.allocations)}
                            </p>
                          )}
                        </td>
                        <td className='py-2 text-right text-fg'>
                          {draft.used > 0 ? `${draft.used}%` : '—'}
                        </td>
                        <td className='py-2 text-right'>
                          <Input
                            type='number'
                            min={0}
                            max={100}
                            aria-label={format(t.group.percentageOf, { name })}
                            value={draft.percentage}
                            disabled={!draft.selected}
                            invalid={Boolean(issue)}
                            className='ml-auto w-20 text-right'
                            onChange={(e) =>
                              update(draft.personId, { percentage: Number(e.target.value) })
                            }
                          />
                        </td>
                        <td className='py-2 text-right text-fg tabular-nums'>
                          {computeAllocatedDays(
                            draft.selected ? draft.percentage : 0,
                            sprint.totalValidDays,
                          )}
                        </td>
                        <td className='py-2 text-right'>
                          {!isMember && (
                            <Button
                              variant='ghost'
                              size='sm'
                              aria-label={format(t.newAllocation.removeFromList, { name })}
                              onClick={() =>
                                setDrafts((current) =>
                                  current.filter((d) => d.personId !== draft.personId),
                                )
                              }
                            >
                              <Trash2 size={14} aria-hidden />
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}

            <SelectField
              label={t.newAllocation.includeOther}
              value=''
              placeholder={t.allocations.selectPerson}
              options={extraOptions}
              onChange={(e) => addExtra(e.target.value)}
            />
          </>
        )}
      </div>
    </Modal>
  )
}

export default NewSprintAllocationModal
