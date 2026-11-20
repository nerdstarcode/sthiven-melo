import type { ColumnDef } from '@tanstack/react-table'
import { AlertTriangle, Copy, HeartHandshake, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { NumberCell } from '@/components/molecules/NumberCell'
import { SupportForm, supportErrorMessage } from '@/components/molecules/SupportForm'
import { UndoNotice } from '@/components/molecules/UndoNotice'
import { DataTable } from '@/components/organisms/DataTable'
import {
  supportIssue,
  type PersonSupport,
  type SupportContext,
  type SupportDraft,
  type SupportDraftError,
} from '@/features/location-overview/lib/personSupportsStorage'
import { formatSprintLabel, type Sprint } from '@/features/location-overview/lib/sprintsStorage'
import { format, useTranslation } from '@/i18n'

export interface SprintSupportsProps {
  sprint: Sprint
  /** Sprint anterior, de onde "Copiar" traz os pares; sem ela, o botão fica desabilitado. */
  previousSprint?: Sprint
  /** Apoios desta sprint. */
  supports: PersonSupport[]
  context: SupportContext
  /** Devolve o erro, ou null quando gravou. */
  onAdd: (draft: SupportDraft) => SupportDraftError | null
  /** Remove e devolve os apoios removidos (para o Desfazer). */
  onRemove: (ids: string[]) => PersonSupport[]
  onRestore: (entries: PersonSupport[]) => void
  onSetPercentage: (id: string, percentage: number) => SupportDraftError | null
  /** Devolve quantos pares foram copiados. */
  onCopyPrevious: () => number
}

/** "Apoios da sprint": quem está apoiando (mentorando) quem nesta sprint e com quanto. */
export function SprintSupports({
  sprint,
  previousSprint,
  supports,
  context,
  onAdd,
  onRemove,
  onRestore,
  onSetPercentage,
  onCopyPrevious,
}: SprintSupportsProps) {
  const t = useTranslation('apps')
  const [error, setError] = useState<string>()
  const [notice, setNotice] = useState<string>()
  const [undo, setUndo] = useState<{ items: PersonSupport[]; message: string } | null>(null)

  const nameOf = (personId: string) => context.people.find((p) => p.id === personId)?.nome ?? '—'
  const pair = (s: PersonSupport) => ({
    supporter: nameOf(s.supporterId),
    supported: nameOf(s.supportedId),
  })
  const allocatedIds = new Set(
    context.allocations
      .filter((a) => a.sprintId === sprint.id && a.percentage > 0)
      .map((a) => a.personId),
  )
  const candidates = context.people.filter((p) => allocatedIds.has(p.id))

  const remove = (support: PersonSupport) => {
    const removed = onRemove([support.id])
    if (removed.length) setUndo({ items: removed, message: format(t.supports.removed, pair(support)) })
  }

  const changePercentage = (support: PersonSupport, value: number) => {
    const result = onSetPercentage(support.id, value)
    setError(result ? supportErrorMessage(result, t.supports) : undefined)
  }

  const copy = () => {
    const copied = onCopyPrevious()
    setNotice(
      copied > 0 && previousSprint
        ? format(t.supports.copied, { count: copied, sprint: formatSprintLabel(previousSprint) })
        : t.supports.nothingToCopy,
    )
  }

  const columns: ColumnDef<PersonSupport, unknown>[] = [
    { id: 'supporter', header: t.supports.supporter, accessorFn: (s) => nameOf(s.supporterId) },
    { id: 'supported', header: t.supports.supported, accessorFn: (s) => nameOf(s.supportedId) },
    {
      accessorKey: 'percentage',
      header: t.supports.percentage,
      cell: ({ row }) => (
        <NumberCell
          value={row.original.percentage}
          min={1}
          aria-label={`${t.supports.percentage}: ${format(t.supports.supports, {
            name: nameOf(row.original.supportedId),
            percentage: row.original.percentage,
          })}`}
          onCommit={(value) => changePercentage(row.original, value)}
        />
      ),
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'status',
      header: t.supports.status,
      enableSorting: false,
      cell: ({ row }) => {
        const issue = supportIssue(row.original, context)
        return issue ? (
          <span className='inline-flex items-center gap-1 text-xs text-warning'>
            <AlertTriangle size={12} aria-hidden /> {supportErrorMessage(issue, t.supports)}{' '}
            {t.supports.outOfCalc}
          </span>
        ) : (
          <span className='text-xs text-fg'>{t.supports.valid}</span>
        )
      },
    },
    {
      id: 'actions',
      header: t.common.actions,
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          variant='ghost'
          size='sm'
          aria-label={format(t.supports.remove, pair(row.original))}
          onClick={() => remove(row.original)}
        >
          <Trash2 size={14} aria-hidden />
        </Button>
      ),
    },
  ]

  return (
    <section
      aria-label={t.supports.title}
      className='flex flex-col gap-3 rounded-md border border-line p-4'
    >
      <div className='flex flex-wrap items-start justify-between gap-2'>
        <div>
          <h3 className='flex items-center gap-2 text-sm font-semibold text-fg-strong'>
            <HeartHandshake size={16} aria-hidden /> {t.supports.title}
          </h3>
          <p className='mt-0.5 max-w-2xl text-xs text-fg'>{t.supports.description}</p>
        </div>
        <Button variant='secondary' disabled={!previousSprint} onClick={copy}>
          <Copy size={14} aria-hidden />
          {previousSprint
            ? format(t.supports.copyFrom, { sprint: formatSprintLabel(previousSprint) })
            : t.supports.noPrevious}
        </Button>
      </div>

      <SupportForm
        people={candidates}
        cargos={context.cargos}
        onSubmit={(draft) => onAdd({ ...draft, sprintId: sprint.id })}
      />

      {notice && (
        <p aria-live='polite' className='text-sm text-fg-strong'>
          {notice}
        </p>
      )}
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

      <DataTable
        data={supports}
        columns={columns}
        caption={t.supports.title}
        emptyMessage={t.supports.empty}
      />
    </section>
  )
}

export default SprintSupports
