import type { ColumnDef } from '@tanstack/react-table'
import { GitMerge, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { SelectField, TextField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import { RequiredSkillsEditor } from '@/components/molecules/RequiredSkillsEditor'
import { DataTable } from '@/components/organisms/DataTable'
import { createId } from '@/features/location-overview/lib/createId'
import { loadPeople, setSquadMembers } from '@/features/location-overview/lib/peopleStorage'
import { squadMatchesName } from '@/features/location-overview/lib/squadMatching'
import { dedupeAliases, mergeSquads } from '@/features/location-overview/lib/squadMerge'
import {
  deleteSquad,
  loadSquads,
  upsertSquad,
  type RequiredSkill,
  type Squad,
} from '@/features/location-overview/lib/squadsStorage'
import { useStoredList } from '@/features/shared/useStoredList'
import { loadSkills } from '@/features/skills/lib/skillsStorage'
import { format, useTranslation } from '@/i18n'

interface SquadDraft {
  id: string
  name: string
  /** Como digitado no campo: nomes separados por vírgula. */
  aliases: string
  memberIds: string[]
  requiredSkills: RequiredSkill[]
}

const EMPTY_DRAFT: SquadDraft = { id: '', name: '', aliases: '', memberIds: [], requiredSkills: [] }

export interface SquadsManagerProps {
  /** Confirmação antes de excluir. Padrão: `window.confirm`. */
  confirm?: (message: string) => boolean
}

/**
 * Cadastro de squads: nome, nomes alternativos (para casar com o Azure), membros e skills
 * requeridas. Permite mesclar uma squad em outra. O vínculo pessoa↔squad fica em `Person.squadIds`.
 */
export function SquadsManager({ confirm = (m) => window.confirm(m) }: SquadsManagerProps) {
  const t = useTranslation('apps')
  const { items: squads, setItems: setSquads, ready } = useStoredList(loadSquads)
  const { items: people, setItems: setPeople } = useStoredList(loadPeople)
  const { items: skills } = useStoredList(loadSkills)
  const [draft, setDraft] = useState<SquadDraft | null>(null)
  const [error, setError] = useState<string>()
  const [mergeSource, setMergeSource] = useState<Squad | null>(null)
  const [mergeTargetId, setMergeTargetId] = useState('')
  const [mergeError, setMergeError] = useState<string>()
  const [summary, setSummary] = useState<string>()

  const skillById = useMemo(() => new Map(skills.map((s) => [s.id, s])), [skills])
  const membersOf = (squadId: string) => people.filter((p) => p.squadIds.includes(squadId))

  const openForm = (squad?: Squad) => {
    setError(undefined)
    setDraft(
      squad
        ? {
            id: squad.id,
            name: squad.name,
            aliases: (squad.aliases ?? []).join(', '),
            memberIds: membersOf(squad.id).map((p) => p.id),
            requiredSkills: squad.requiredSkills ?? [],
          }
        : EMPTY_DRAFT,
    )
  }

  const save = () => {
    if (!draft) return
    const name = draft.name.trim()
    if (!name) return setError(t.squads.nameRequired)
    const aliases = dedupeAliases(name, draft.aliases.split(','))
    for (const candidate of [name, ...aliases]) {
      const owner = squads.find((s) => s.id !== draft.id && squadMatchesName(s, candidate))
      if (owner) return setError(format(t.squads.nameTaken, { name: candidate, owner: owner.name }))
    }
    const id = draft.id || createId()
    setSquads(
      upsertSquad({
        id,
        name,
        ...(aliases.length > 0 && { aliases }),
        ...(draft.requiredSkills.length > 0 && { requiredSkills: draft.requiredSkills }),
      }),
    )
    setPeople(setSquadMembers(id, draft.memberIds))
    setDraft(null)
  }

  const remove = (squad: Squad) => {
    if (!confirm(t.squads.deleteConfirm)) return
    setSquads(deleteSquad(squad.id))
    setPeople(setSquadMembers(squad.id, []))
  }

  const merge = () => {
    if (!mergeSource) return
    const target = squads.find((s) => s.id === mergeTargetId)
    if (!target) return setMergeError(t.squads.mergeTargetRequired)
    const result = mergeSquads(mergeSource.id, target.id)
    setSquads(loadSquads())
    setPeople(loadPeople())
    setSummary(
      format(t.squads.mergeSummary, {
        source: mergeSource.name,
        target: target.name,
        moved: result.allocationsMoved,
        discarded: result.allocationsDiscarded,
      }),
    )
    setMergeSource(null)
  }

  const toggleMember = (personId: string) => {
    if (!draft) return
    const has = draft.memberIds.includes(personId)
    setDraft({
      ...draft,
      memberIds: has
        ? draft.memberIds.filter((id) => id !== personId)
        : [...draft.memberIds, personId],
    })
  }

  const columns: ColumnDef<Squad, unknown>[] = [
    { accessorKey: 'name', header: t.squads.name },
    {
      id: 'aliases',
      header: t.squads.aliases,
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex flex-wrap gap-1'>
          {(row.original.aliases ?? []).map((alias) => (
            <Badge key={alias}>{alias}</Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'members',
      header: t.squads.members,
      accessorFn: (s) => membersOf(s.id).length,
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'requiredSkills',
      header: t.squads.requiredSkills,
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex flex-wrap gap-1'>
          {(row.original.requiredSkills ?? [])
            .filter((r) => skillById.has(r.skillId))
            .map((r) => {
              const skill = skillById.get(r.skillId)!
              return (
                <Badge key={r.skillId} tone={skill.type}>
                  {skill.name} ≥{r.minLevel}
                </Badge>
              )
            })}
        </div>
      ),
    },
    {
      id: 'actions',
      header: t.common.actions,
      enableSorting: false,
      cell: ({ row }) => {
        const squad = row.original
        return (
          <div className='flex gap-1'>
            <Button
              variant='ghost'
              size='sm'
              aria-label={`${t.common.edit} ${squad.name}`}
              onClick={() => openForm(squad)}
            >
              <Pencil size={14} aria-hidden />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              aria-label={format(t.squads.mergeInto, { name: squad.name })}
              onClick={() => {
                setMergeSource(squad)
                setMergeTargetId('')
                setMergeError(undefined)
              }}
            >
              <GitMerge size={14} aria-hidden />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              aria-label={`${t.common.delete} ${squad.name}`}
              onClick={() => remove(squad)}
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
        <p className='text-sm text-fg'>{t.squads.description}</p>
        <Button onClick={() => openForm()}>
          <Plus size={14} aria-hidden /> {t.squads.add}
        </Button>
      </div>

      {summary && (
        <p role='status' className='text-sm text-accent'>
          {summary}
        </p>
      )}

      <DataTable
        data={squads}
        columns={columns}
        caption={t.squads.title}
        emptyMessage={ready ? t.squads.empty : t.common.loading}
      />

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? t.squads.editTitle : t.squads.addTitle}
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
            className='flex flex-col gap-4'
            onSubmit={(event) => {
              event.preventDefault()
              save()
            }}
          >
            <TextField
              label={t.squads.name}
              value={draft.name}
              error={error}
              autoFocus
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <TextField
              label={t.squads.aliases}
              hint={t.squads.aliasesHint}
              value={draft.aliases}
              onChange={(e) => setDraft({ ...draft, aliases: e.target.value })}
            />
            {people.length > 0 && (
              <fieldset className='flex flex-col gap-2'>
                <legend className='mb-1 text-xs font-medium text-fg'>{t.squads.members}</legend>
                <div className='grid grid-cols-2 gap-2'>
                  {people.map((person) => (
                    <label
                      key={person.id}
                      className='flex items-center gap-2 text-sm text-fg-strong'
                    >
                      <input
                        type='checkbox'
                        className='accent-accent'
                        checked={draft.memberIds.includes(person.id)}
                        onChange={() => toggleMember(person.id)}
                      />
                      {person.nome}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <RequiredSkillsEditor
              skills={skills}
              value={draft.requiredSkills}
              onChange={(requiredSkills) => setDraft({ ...draft, requiredSkills })}
            />
          </form>
        )}
      </Modal>

      <Modal
        open={mergeSource !== null}
        onClose={() => setMergeSource(null)}
        title={format(t.squads.mergeTitle, { name: mergeSource?.name ?? '' })}
        closeLabel={t.common.close}
        footer={
          <>
            <Button variant='secondary' onClick={() => setMergeSource(null)}>
              {t.common.cancel}
            </Button>
            <Button onClick={merge}>{t.squads.mergeButton}</Button>
          </>
        }
      >
        {mergeSource && (
          <div className='flex flex-col gap-4'>
            <p className='text-sm text-fg'>
              {format(t.squads.mergeHelp, { name: mergeSource.name })}
            </p>
            <SelectField
              label={t.squads.mergeTarget}
              value={mergeTargetId}
              placeholder={t.allocations.selectSquad}
              error={mergeError}
              options={squads
                .filter((s) => s.id !== mergeSource.id)
                .map((s) => ({ value: s.id, label: s.name }))}
              onChange={(e) => setMergeTargetId(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SquadsManager
