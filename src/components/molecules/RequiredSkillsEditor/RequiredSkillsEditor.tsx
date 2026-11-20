import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Select } from '@/components/atoms/Select'
import { ProficiencyRating } from '@/components/molecules/ProficiencyRating'
import type { RequiredSkill } from '@/features/location-overview/lib/squadsStorage'
import type { Skill } from '@/features/skills/lib/skillsStorage'
import { useTranslation } from '@/i18n'

const DEFAULT_MIN_LEVEL = 3

export interface RequiredSkillsEditorProps {
  value: RequiredSkill[]
  onChange: (value: RequiredSkill[]) => void
  /** Catálogo de skills disponíveis. */
  skills: Skill[]
}

/** Lista controlada de skills requeridas (skill + nível mínimo), usada no formulário de squad. */
export function RequiredSkillsEditor({ value, onChange, skills }: RequiredSkillsEditorProps) {
  const t = useTranslation('apps')
  const [toAdd, setToAdd] = useState('')
  const skillById = new Map(skills.map((s) => [s.id, s]))
  const required = new Set(value.map((r) => r.skillId))
  const available = skills.filter((s) => !required.has(s.id))

  const setLevel = (skillId: string, minLevel: number) =>
    onChange(value.map((r) => (r.skillId === skillId ? { ...r, minLevel } : r)))

  const add = () => {
    if (!toAdd) return
    onChange([...value, { skillId: toAdd, minLevel: DEFAULT_MIN_LEVEL }])
    setToAdd('')
  }

  return (
    <fieldset className='flex flex-col gap-2'>
      <legend className='mb-1 text-xs font-medium text-fg'>{t.squads.requiredSkills}</legend>
      {value.length === 0 && <p className='text-xs text-fg'>{t.squads.noRequirements}</p>}
      <ul className='flex flex-col gap-2'>
        {value
          .filter((r) => skillById.has(r.skillId))
          .map(({ skillId, minLevel }) => {
            const skill = skillById.get(skillId)!
            return (
              <li key={skillId} className='flex items-center gap-3'>
                <Badge tone={skill.type} className='min-w-0 flex-1 justify-start'>
                  {skill.name}
                </Badge>
                <ProficiencyRating
                  size='sm'
                  label={`${t.squads.minLevel} ${skill.name}`}
                  value={minLevel}
                  onChange={(level) => setLevel(skillId, level)}
                />
                <Button
                  variant='ghost'
                  size='sm'
                  aria-label={`${t.common.delete} ${skill.name}`}
                  onClick={() => onChange(value.filter((r) => r.skillId !== skillId))}
                >
                  <Trash2 size={14} aria-hidden />
                </Button>
              </li>
            )
          })}
      </ul>
      {available.length > 0 && (
        <div className='flex gap-2'>
          <Select
            aria-label={t.squads.addRequirement}
            value={toAdd}
            placeholder={t.skills.chooseSkill}
            className='h-8'
            onChange={(e) => setToAdd(e.target.value)}
            options={available.map((s) => ({ value: s.id, label: s.name }))}
          />
          <Button size='sm' variant='secondary' disabled={!toAdd} onClick={add}>
            {t.common.add}
          </Button>
        </div>
      )}
    </fieldset>
  )
}

export default RequiredSkillsEditor
