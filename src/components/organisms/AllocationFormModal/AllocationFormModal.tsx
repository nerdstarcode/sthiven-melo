import { useEffect, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { SelectField, TextField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import {
  validateAllocation,
  type AllocationError,
} from '@/features/location-overview/lib/allocationGroups'
import { createId } from '@/features/location-overview/lib/createId'
import type { Person } from '@/features/location-overview/lib/peopleStorage'
import {
  computeAllocatedDays,
  type PersonAllocation,
} from '@/features/location-overview/lib/personAllocationsStorage'
import { formatSprintLabel, type Sprint } from '@/features/location-overview/lib/sprintsStorage'
import type { Squad } from '@/features/location-overview/lib/squadsStorage'
import { format, useTranslation } from '@/i18n'

export const EMPTY_ALLOCATION: PersonAllocation = {
  id: '',
  personId: '',
  squadId: '',
  sprintId: '',
  percentage: 100,
}

export interface AllocationFormModalProps {
  /** Alocação em edição (id vazio = nova); `null` fecha o modal. */
  allocation: PersonAllocation | null
  onClose: () => void
  /** Recebe a alocação validada, já com id. */
  onSave: (allocation: PersonAllocation) => void
  /** Todas as alocações, para validar o limite de 100% por pessoa na sprint. */
  allocations: PersonAllocation[]
  people: Person[]
  squads: Squad[]
  sprints: Sprint[]
}

/** Formulário de alocação: pessoa → squad (só as da pessoa) → sprint → %, com os dias calculados. */
export function AllocationFormModal({
  allocation,
  onClose,
  onSave,
  allocations,
  people,
  squads,
  sprints,
}: AllocationFormModalProps) {
  const t = useTranslation('apps')
  const [draft, setDraft] = useState<PersonAllocation | null>(allocation)
  const [error, setError] = useState<AllocationError | null>(null)

  useEffect(() => {
    setDraft(allocation)
    setError(null)
  }, [allocation])

  const person = people.find((p) => p.id === draft?.personId)
  const personSquads = person ? squads.filter((s) => person.squadIds.includes(s.id)) : []
  const sprint = sprints.find((s) => s.id === draft?.sprintId)

  const errorMessage = (() => {
    if (!error) return undefined
    if (error.code === 'overAllocated') {
      return format(t.allocations.overAllocated, { other: error.otherPercentage })
    }
    return t.allocations[error.code]
  })()

  const save = () => {
    if (!draft) return
    const problem = validateAllocation(draft, allocations)
    setError(problem)
    if (!problem) onSave({ ...draft, id: draft.id || createId() })
  }

  return (
    <Modal
      open={draft !== null}
      onClose={onClose}
      title={draft?.id ? t.allocations.editTitle : t.allocations.addTitle}
      closeLabel={t.common.close}
      footer={
        <>
          <Button variant='secondary' onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button onClick={save}>{t.common.save}</Button>
        </>
      }
    >
      {draft && (
        <form
          className='flex flex-col gap-4'
          onSubmit={(event) => {
            event.preventDefault()
            save()
          }}
        >
          {errorMessage && (
            <p role='alert' className='text-sm text-danger'>
              {errorMessage}
            </p>
          )}
          <SelectField
            label={t.allocations.person}
            value={draft.personId}
            placeholder={t.allocations.selectPerson}
            options={people.map((p) => ({ value: p.id, label: p.nome }))}
            onChange={(e) => setDraft({ ...draft, personId: e.target.value, squadId: '' })}
          />
          {person && personSquads.length === 0 ? (
            <p className='text-sm text-fg'>{t.allocations.noSquadsForPerson}</p>
          ) : (
            <SelectField
              label={t.allocations.squad}
              value={draft.squadId}
              placeholder={t.allocations.selectSquad}
              disabled={!person}
              options={personSquads.map((s) => ({ value: s.id, label: s.name }))}
              onChange={(e) => setDraft({ ...draft, squadId: e.target.value })}
            />
          )}
          <SelectField
            label={t.allocations.sprint}
            value={draft.sprintId}
            placeholder={t.allocations.selectSprint}
            options={sprints.map((s) => ({ value: s.id, label: formatSprintLabel(s) }))}
            onChange={(e) => setDraft({ ...draft, sprintId: e.target.value })}
          />
          <TextField
            label={t.allocations.percentage}
            type='number'
            min={1}
            max={100}
            value={draft.percentage}
            hint={
              sprint
                ? format(t.allocations.computedDays, {
                    days: computeAllocatedDays(draft.percentage, sprint.totalValidDays),
                    total: sprint.totalValidDays,
                  })
                : undefined
            }
            onChange={(e) => setDraft({ ...draft, percentage: Number(e.target.value) })}
          />
        </form>
      )}
    </Modal>
  )
}

export default AllocationFormModal
