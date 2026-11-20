import { useEffect, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { TextField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import { createId } from '@/features/location-overview/lib/createId'
import {
  DEFAULT_TOTAL_VALID_DAYS,
  isValidFiscalYear,
  type Sprint,
} from '@/features/location-overview/lib/sprintsStorage'
import { useTranslation } from '@/i18n'
import type { AppsTranslation } from '@/i18n/apps'

export const EMPTY_SPRINT: Sprint = {
  id: '',
  number: 1,
  fiscalYear: '',
  startDate: '',
  endDate: '',
  totalValidDays: DEFAULT_TOTAL_VALID_DAYS,
}

type SprintErrors = Partial<Record<'number' | 'fiscalYear' | 'dates', string>>

/** Valida a sprint e devolve as mensagens por campo (vazio = válida). */
export function validateSprint(sprint: Sprint, t: AppsTranslation['sprints']): SprintErrors {
  const errors: SprintErrors = {}
  if (!(sprint.number > 0)) errors.number = t.numberInvalid
  if (!isValidFiscalYear(sprint.fiscalYear)) errors.fiscalYear = t.fiscalYearInvalid
  if (!sprint.startDate || !sprint.endDate) errors.dates = t.datesRequired
  else if (sprint.startDate > sprint.endDate) errors.dates = t.datesOrder
  return errors
}

export interface SprintFormModalProps {
  /** Sprint em edição (id vazio = nova); `null` fecha o modal. */
  sprint: Sprint | null
  onClose: () => void
  /** Recebe a sprint validada, já com id e ano fiscal normalizado. */
  onSave: (sprint: Sprint) => void
}

/** Formulário de sprint: número, ano fiscal, datas e dias úteis. */
export function SprintFormModal({ sprint, onClose, onSave }: SprintFormModalProps) {
  const t = useTranslation('apps')
  const [draft, setDraft] = useState<Sprint | null>(sprint)
  const [errors, setErrors] = useState<SprintErrors>({})

  useEffect(() => {
    setDraft(sprint)
    setErrors({})
  }, [sprint])

  const save = () => {
    if (!draft) return
    const nextErrors = validateSprint(draft, t.sprints)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    onSave({
      ...draft,
      id: draft.id || createId(),
      fiscalYear: draft.fiscalYear.trim().toUpperCase(),
    })
  }

  return (
    <Modal
      open={sprint !== null}
      onClose={onClose}
      title={sprint?.id ? t.sprints.editTitle : t.sprints.addTitle}
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
          className='grid grid-cols-2 gap-4'
          onSubmit={(event) => {
            event.preventDefault()
            save()
          }}
        >
          <TextField
            label={t.sprints.number}
            type='number'
            min={1}
            value={draft.number}
            error={errors.number}
            onChange={(e) => setDraft({ ...draft, number: Number(e.target.value) })}
          />
          <TextField
            label={t.sprints.fiscalYear}
            placeholder='FY26-27'
            hint={t.sprints.fiscalYearHint}
            value={draft.fiscalYear}
            error={errors.fiscalYear}
            onChange={(e) => setDraft({ ...draft, fiscalYear: e.target.value })}
          />
          <TextField
            label={t.sprints.start}
            type='date'
            value={draft.startDate}
            error={errors.dates}
            onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
          />
          <TextField
            label={t.sprints.end}
            type='date'
            value={draft.endDate}
            onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
          />
          <TextField
            label={t.sprints.validDays}
            type='number'
            min={0}
            value={draft.totalValidDays}
            onChange={(e) => setDraft({ ...draft, totalValidDays: Number(e.target.value) })}
          />
        </form>
      )}
    </Modal>
  )
}

export default SprintFormModal
