import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { SelectField, TextField } from '@/components/molecules/FormField'
import { Modal } from '@/components/molecules/Modal'
import { DataTable } from '@/components/organisms/DataTable'
import { useStoredList } from '@/features/shared/useStoredList'
import {
  deleteSkill,
  loadPersonSkills,
  loadSkills,
  upsertSkill,
  type Skill,
} from '@/features/skills/lib/skillsStorage'
import { useTranslation } from '@/i18n'

const EMPTY_SKILL: Skill = { id: '', name: '', type: 'hard', category: '' }

export interface SkillsCatalogProps {
  /** Confirmação antes de excluir. Padrão: `window.confirm`. */
  confirm?: (message: string) => boolean
}

/** CRUD do catálogo de hard e soft skills, com quantas pessoas têm cada uma. */
export function SkillsCatalog({ confirm = (m) => window.confirm(m) }: SkillsCatalogProps) {
  const t = useTranslation('apps')
  const { items: skills, setItems: setSkills, ready } = useStoredList(loadSkills)
  const { items: personSkills, reload: reloadPersonSkills } = useStoredList(loadPersonSkills)
  const [draft, setDraft] = useState<Skill | null>(null)
  const [error, setError] = useState<string>()

  const peopleCount = useMemo(() => {
    const counts = new Map<string, number>()
    for (const ps of personSkills) counts.set(ps.skillId, (counts.get(ps.skillId) ?? 0) + 1)
    return counts
  }, [personSkills])

  const open = (skill: Skill) => {
    setDraft(skill)
    setError(undefined)
  }

  const save = () => {
    if (!draft) return
    const name = draft.name.trim()
    if (!name) return setError(t.skills.nameRequired)
    const duplicate = skills.some(
      (s) => s.id !== draft.id && s.name.trim().toLowerCase() === name.toLowerCase(),
    )
    if (duplicate) return setError(t.skills.duplicate)
    const category = draft.category?.trim()
    setSkills(upsertSkill({ ...draft, name, category: category || undefined }))
    setDraft(null)
  }

  const remove = (skill: Skill) => {
    if (!confirm(t.skills.deleteConfirm)) return
    setSkills(deleteSkill(skill.id))
    reloadPersonSkills()
  }

  const columns: ColumnDef<Skill, unknown>[] = [
    { accessorKey: 'name', header: t.skills.name },
    {
      accessorKey: 'type',
      header: t.skills.type,
      cell: ({ row }) => (
        <Badge tone={row.original.type}>
          {row.original.type === 'hard' ? t.skills.hard : t.skills.soft}
        </Badge>
      ),
    },
    {
      accessorKey: 'category',
      header: t.skills.category,
      cell: ({ getValue }) => getValue() ?? '—',
    },
    {
      id: 'people',
      header: t.skills.people,
      accessorFn: (skill) => peopleCount.get(skill.id) ?? 0,
      meta: { align: 'right', numeric: true },
    },
    {
      id: 'actions',
      header: t.common.actions,
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex gap-1'>
          <Button
            variant='ghost'
            size='sm'
            aria-label={`${t.common.edit} ${row.original.name}`}
            onClick={() => open(row.original)}
          >
            <Pencil size={14} aria-hidden />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            aria-label={`${t.common.delete} ${row.original.name}`}
            onClick={() => remove(row.original)}
          >
            <Trash2 size={14} aria-hidden />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <p className='text-sm text-fg'>{t.skills.description}</p>
        <Button onClick={() => open(EMPTY_SKILL)}>
          <Plus size={14} aria-hidden /> {t.skills.add}
        </Button>
      </div>

      <DataTable
        data={skills}
        columns={columns}
        caption={t.skills.title}
        emptyMessage={ready ? t.skills.empty : t.common.loading}
      />

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? t.skills.editTitle : t.skills.addTitle}
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
              label={t.skills.name}
              value={draft.name}
              error={error}
              autoFocus
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <SelectField
              label={t.skills.type}
              value={draft.type}
              options={[
                { value: 'hard', label: t.skills.hard },
                { value: 'soft', label: t.skills.soft },
              ]}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as Skill['type'] })}
            />
            <TextField
              label={t.skills.category}
              hint={t.skills.categoryHint}
              value={draft.category ?? ''}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
          </form>
        )}
      </Modal>
    </div>
  )
}

export default SkillsCatalog
