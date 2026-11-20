import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { TextField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import { DataTable } from '@/components/organisms/DataTable'
import { createId } from '@/features/location-overview/lib/createId'
import { formatDateBR } from '@/features/location-overview/lib/dates'
import {
  DEFAULT_TOTAL_VALID_DAYS,
  deleteSprint,
  formatSprintLabel,
  isValidFiscalYear,
  loadSprints,
  upsertSprint,
  type Sprint,
} from '@/features/location-overview/lib/sprintsStorage'
import { useStoredList } from '@/features/shared/useStoredList'
import { useTranslation } from '@/i18n'
import type { AppsTranslation } from '@/i18n/apps'

const EMPTY_SPRINT: Sprint = {
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

/** Cadastro de sprints: número, ano fiscal, datas e dias úteis. */
export function SprintsManager() {
  const t = useTranslation('apps')
  const { items: sprints, setItems: setSprints, ready } = useStoredList(loadSprints)
  const [draft, setDraft] = useState<Sprint | null>(null)
  const [errors, setErrors] = useState<SprintErrors>({})

  const open = (sprint: Sprint) => {
    setDraft(sprint)
    setErrors({})
  }

  const save = () => {
    if (!draft) return
    const nextErrors = validateSprint(draft, t.sprints)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSprints(
      upsertSprint({
        ...draft,
        id: draft.id || createId(),
        fiscalYear: draft.fiscalYear.trim().toUpperCase(),
      }),
    )
    setDraft(null)
  }

  const columns: ColumnDef<Sprint, unknown>[] = [
    {
      id: 'sprint',
      header: t.sprints.sprint,
      accessorFn: (s) => `${s.fiscalYear}-${String(s.number).padStart(3, '0')}`,
      cell: ({ row }) => formatSprintLabel(row.original),
    },
    {
      accessorKey: 'startDate',
      header: t.sprints.start,
      cell: ({ row }) => formatDateBR(row.original.startDate),
    },
    {
      accessorKey: 'endDate',
      header: t.sprints.end,
      cell: ({ row }) => formatDateBR(row.original.endDate),
    },
    {
      accessorKey: 'totalValidDays',
      header: t.sprints.validDays,
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'actions',
      header: t.common.actions,
      enableSorting: false,
      cell: ({ row }) => {
        const label = formatSprintLabel(row.original)
        return (
          <div className='flex gap-1'>
            <Button
              variant='ghost'
              size='sm'
              aria-label={`${t.common.edit} ${label}`}
              onClick={() => open(row.original)}
            >
              <Pencil size={14} aria-hidden />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              aria-label={`${t.common.delete} ${label}`}
              onClick={() => setSprints(deleteSprint(row.original.id))}
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
      <div className='flex items-center justify-between gap-4'>
        <p className='text-sm text-fg'>{t.sprints.description}</p>
        <Button onClick={() => open(EMPTY_SPRINT)}>
          <Plus size={14} aria-hidden /> {t.sprints.add}
        </Button>
      </div>

      <DataTable
        data={sprints}
        columns={columns}
        caption={t.sprints.title}
        emptyMessage={ready ? t.sprints.empty : t.common.loading}
      />

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? t.sprints.editTitle : t.sprints.addTitle}
        closeLabel={t.common.close}
        footer={
          <>
            <Button variant='secondary' onClick={() => setDraft(null)}>
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
    </div>
  )
}

export default SprintsManager
