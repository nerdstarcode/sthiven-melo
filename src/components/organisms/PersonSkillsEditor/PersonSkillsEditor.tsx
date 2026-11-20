import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Select } from '@/components/atoms/Select'
import { ProficiencyRating } from '@/components/molecules/ProficiencyRating'
import { useStoredList } from '@/features/shared/useStoredList'
import {
  loadPersonSkills,
  loadSkills,
  removePersonSkill,
  setPersonSkill,
  skillsOfPerson,
  SKILL_TYPES,
  type PersonSkill,
} from '@/features/skills/lib/skillsStorage'
import { useTranslation } from '@/i18n'

const DEFAULT_NEW_LEVEL = 3

export interface PersonSkillsEditorProps {
  personId: string
  /** Chamado a cada mudança, com todas as proficiências salvas. */
  onChange?: (personSkills: PersonSkill[]) => void
  /** Só exibe, sem editar (ex.: perfil de outra pessoa). */
  readOnly?: boolean
}

/** Perfil de skills de uma pessoa, separado em hard e soft, com nível de 1 a 5. */
export function PersonSkillsEditor({
  personId,
  onChange,
  readOnly = false,
}: PersonSkillsEditorProps) {
  const t = useTranslation('apps')
  const { items: skills } = useStoredList(loadSkills)
  const { items: personSkills, setItems } = useStoredList(loadPersonSkills)
  const [toAdd, setToAdd] = useState('')

  const profile = useMemo(
    () => skillsOfPerson(personId, personSkills, skills),
    [personId, personSkills, skills],
  )
  const available = useMemo(() => {
    const owned = new Set(profile.map((p) => p.skillId))
    return skills.filter((s) => !owned.has(s.id))
  }, [profile, skills])

  const commit = (next: PersonSkill[]) => {
    setItems(next)
    onChange?.(next)
  }

  const add = () => {
    if (!toAdd) return
    commit(setPersonSkill(personId, toAdd, DEFAULT_NEW_LEVEL))
    setToAdd('')
  }

  return (
    <div className='flex flex-col gap-6'>
      {!readOnly && <p className='text-xs text-fg'>{t.skills.proficiencyHint}</p>}

      {SKILL_TYPES.map((type) => {
        const entries = profile.filter((p) => p.skill.type === type)
        const heading = type === 'hard' ? t.skills.hardPlural : t.skills.softPlural
        return (
          <section key={type} aria-label={heading}>
            <h3 className='mb-2 flex items-center gap-2 text-sm font-semibold text-fg-strong'>
              <Badge tone={type}>{heading}</Badge>
              <span className='text-xs font-normal text-fg'>{entries.length}</span>
            </h3>
            {entries.length === 0 ? (
              <p className='text-xs text-fg'>{t.skills.noneInProfile}</p>
            ) : (
              <ul className='flex flex-col gap-2'>
                {entries.map(({ skill, level }) => (
                  <li key={skill.id} className='flex items-center justify-between gap-3'>
                    <span className='min-w-0 flex-1 truncate text-sm text-fg-strong'>
                      {skill.name}
                      {skill.category && (
                        <span className='ml-2 text-xs text-fg'>{skill.category}</span>
                      )}
                    </span>
                    <ProficiencyRating
                      label={skill.name}
                      value={level}
                      onChange={
                        readOnly ? undefined : (l) => commit(setPersonSkill(personId, skill.id, l))
                      }
                    />
                    {!readOnly && (
                      <Button
                        variant='ghost'
                        size='sm'
                        aria-label={`${t.skills.removeFromProfile} ${skill.name}`}
                        onClick={() => commit(removePersonSkill(personId, skill.id))}
                      >
                        <Trash2 size={14} aria-hidden />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}

      {!readOnly && available.length > 0 && (
        <div className='flex items-end gap-2'>
          <Select
            aria-label={t.skills.addToProfile}
            value={toAdd}
            placeholder={t.skills.chooseSkill}
            onChange={(e) => setToAdd(e.target.value)}
            options={available.map((s) => ({
              value: s.id,
              label: `${s.name} (${s.type === 'hard' ? t.skills.hard : t.skills.soft})`,
            }))}
          />
          <Button onClick={add} disabled={!toAdd}>
            {t.common.add}
          </Button>
        </div>
      )}
    </div>
  )
}

export default PersonSkillsEditor
