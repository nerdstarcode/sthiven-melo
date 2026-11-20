import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { SelectField, TextField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import { DataTable } from '@/components/organisms/DataTable'
import { PersonSkillsEditor } from '@/components/organisms/PersonSkillsEditor'
import { loadCargos } from '@/features/location-overview/lib/cargosStorage'
import { createId } from '@/features/location-overview/lib/createId'
import { loadLevels } from '@/features/location-overview/lib/levelsStorage'
import {
  deletePerson,
  loadPeople,
  upsertPerson,
  type Person,
} from '@/features/location-overview/lib/peopleStorage'
import {
  deletePersonAllocation,
  loadPersonAllocations,
} from '@/features/location-overview/lib/personAllocationsStorage'
import { loadSquads } from '@/features/location-overview/lib/squadsStorage'
import { useStoredList } from '@/features/shared/useStoredList'
import {
  loadPersonSkills,
  loadSkills,
  removeSkillsOfPerson,
  skillsOfPerson,
} from '@/features/skills/lib/skillsStorage'
import { useTranslation } from '@/i18n'

const EMPTY_PERSON: Person = { id: '', nome: '', email: '', cargo: '', nivel: '', squadIds: [] }
/** Quantas skills aparecem na coluna antes do "+N". */
const SKILLS_PREVIEW = 3

export interface PeopleManagerProps {
  /** Confirmação antes de excluir. Padrão: `window.confirm`. */
  confirm?: (message: string) => boolean
}

/**
 * Cadastro de pessoas do Location Overview: cargo (que define o nível), squads e skills.
 * Excluir uma pessoa remove também as skills e as alocações dela.
 */
export function PeopleManager({ confirm = (m) => window.confirm(m) }: PeopleManagerProps) {
  const t = useTranslation('apps')
  const { items: people, setItems: setPeople, ready } = useStoredList(loadPeople)
  const { items: squads } = useStoredList(loadSquads)
  const { items: cargos } = useStoredList(loadCargos)
  const { items: levels } = useStoredList(loadLevels)
  const { items: skills } = useStoredList(loadSkills)
  const { items: personSkills, setItems: setPersonSkills } = useStoredList(loadPersonSkills)

  const [draft, setDraft] = useState<Person | null>(null)
  const [error, setError] = useState<string>()
  const [skillsOf, setSkillsOf] = useState<Person | null>(null)

  const squadName = useMemo(() => new Map(squads.map((s) => [s.id, s.name])), [squads])
  const cargoByName = useMemo(() => new Map(cargos.map((c) => [c.cargo, c])), [cargos])

  const openForm = (person: Person) => {
    setDraft(person)
    setError(undefined)
  }

  const save = () => {
    if (!draft) return
    const nome = draft.nome.trim()
    if (!nome) return setError(t.people.nameRequired)
    setPeople(
      upsertPerson({ ...draft, id: draft.id || createId(), nome, email: draft.email.trim() }),
    )
    setDraft(null)
  }

  const remove = (person: Person) => {
    if (!confirm(t.people.deleteConfirm)) return
    loadPersonAllocations()
      .filter((a) => a.personId === person.id)
      .forEach((a) => deletePersonAllocation(a.id))
    setPersonSkills(removeSkillsOfPerson(person.id))
    setPeople(deletePerson(person.id))
  }

  const toggleSquad = (squadId: string) => {
    if (!draft) return
    const has = draft.squadIds.includes(squadId)
    setDraft({
      ...draft,
      squadIds: has ? draft.squadIds.filter((id) => id !== squadId) : [...draft.squadIds, squadId],
    })
  }

  const columns: ColumnDef<Person, unknown>[] = [
    { accessorKey: 'nome', header: t.people.name },
    { accessorKey: 'cargo', header: t.people.role },
    { accessorKey: 'nivel', header: t.people.level },
    {
      id: 'squads',
      header: t.people.squads,
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex flex-wrap gap-1'>
          {row.original.squadIds.map((id) => (
            <Badge key={id}>{squadName.get(id) ?? id}</Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'skills',
      header: t.people.skills,
      enableSorting: false,
      cell: ({ row }) => {
        const profile = skillsOfPerson(row.original.id, personSkills, skills)
        const hidden = profile.length - SKILLS_PREVIEW
        return (
          <div className='flex flex-wrap gap-1'>
            {profile.slice(0, SKILLS_PREVIEW).map((p) => (
              <Badge key={p.skillId} tone={p.skill.type}>
                {p.skill.name} {p.level}
              </Badge>
            ))}
            {hidden > 0 && <Badge>+{hidden}</Badge>}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: t.common.actions,
      enableSorting: false,
      cell: ({ row }) => {
        const person = row.original
        return (
          <div className='flex gap-1'>
            <Button
              variant='ghost'
              size='sm'
              aria-label={`${t.people.editSkills}: ${person.nome}`}
              onClick={() => setSkillsOf(person)}
            >
              <Sparkles size={14} aria-hidden />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              aria-label={`${t.common.edit} ${person.nome}`}
              onClick={() => openForm(person)}
            >
              <Pencil size={14} aria-hidden />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              aria-label={`${t.common.delete} ${person.nome}`}
              onClick={() => remove(person)}
            >
              <Trash2 size={14} aria-hidden />
            </Button>
          </div>
        )
      },
    },
  ]

  const levelLabel = draft?.nivel
    ? `${draft.nivel} · ${levels.find((l) => l.nivel === draft.nivel)?.label ?? ''}`
    : '—'

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <p className='text-sm text-fg'>{t.people.description}</p>
        <Button onClick={() => openForm(EMPTY_PERSON)}>
          <Plus size={14} aria-hidden /> {t.people.add}
        </Button>
      </div>

      <DataTable
        data={people}
        columns={columns}
        caption={t.people.title}
        emptyMessage={ready ? t.people.empty : t.common.loading}
      />

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? t.people.editTitle : t.people.addTitle}
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
              label={t.people.name}
              value={draft.nome}
              error={error}
              autoFocus
              onChange={(e) => setDraft({ ...draft, nome: e.target.value })}
            />
            <TextField
              label={t.people.email}
              type='email'
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            />
            {cargos.length === 0 ? (
              <p className='text-sm text-fg'>{t.people.noRoles}</p>
            ) : (
              <SelectField
                label={t.people.role}
                value={draft.cargo}
                placeholder={t.people.selectRole}
                hint={`${t.people.level}: ${levelLabel} (${t.people.levelFromRole})`}
                options={cargos.map((c) => ({ value: c.cargo, label: `${c.cargo} (${c.tipo})` }))}
                onChange={(e) => {
                  const cargo = cargoByName.get(e.target.value)
                  setDraft({ ...draft, cargo: e.target.value, nivel: cargo?.nivel ?? draft.nivel })
                }}
              />
            )}
            {squads.length > 0 && (
              <fieldset className='flex flex-col gap-2'>
                <legend className='mb-1 text-xs font-medium text-fg'>{t.people.squads}</legend>
                {squads.map((squad) => (
                  <label key={squad.id} className='flex items-center gap-2 text-sm text-fg-strong'>
                    <input
                      type='checkbox'
                      className='accent-accent'
                      checked={draft.squadIds.includes(squad.id)}
                      onChange={() => toggleSquad(squad.id)}
                    />
                    {squad.name}
                  </label>
                ))}
              </fieldset>
            )}
          </form>
        )}
      </Modal>

      <Modal
        open={skillsOf !== null}
        onClose={() => setSkillsOf(null)}
        title={`${t.people.skillsOf} ${skillsOf?.nome ?? ''}`}
        closeLabel={t.common.close}
      >
        {skillsOf && <PersonSkillsEditor personId={skillsOf.id} onChange={setPersonSkills} />}
      </Modal>
    </div>
  )
}

export default PeopleManager
