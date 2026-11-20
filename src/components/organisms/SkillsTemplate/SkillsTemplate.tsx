import { UserPlus } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { SelectField } from '@/components/molecules/FormField'
import { PersonSkillsEditor } from '@/components/organisms/PersonSkillsEditor'
import { SkillsRadar } from '@/components/organisms/SkillsRadar'
import { loadPeople } from '@/features/location-overview/lib/peopleStorage'
import { OWNER_PERSON_ID } from '@/features/seed/demoSeed'
import { useStoredList } from '@/features/shared/useStoredList'
import { loadPersonSkills, loadSkills, skillsOfPerson } from '@/features/skills/lib/skillsStorage'
import { createProfile } from '@/features/skills/lib/skillsTemplate'
import { format, useTranslation } from '@/i18n'

export interface SkillsTemplateProps {
  /** Perfil aberto; sem ele, o do Sthiven. */
  personId?: string
  /** Troca o perfil (a página grava na URL). */
  onSelectPerson: (personId: string) => void
}

/**
 * Perfil de skills público: o do Sthiven abre por padrão e cada visitante cria o seu, do zero ou
 * copiando as skills de outro perfil. Edita no `PersonSkillsEditor` e resume num radar.
 */
export function SkillsTemplate({ personId, onSelectPerson }: SkillsTemplateProps) {
  const t = useTranslation('apps')
  const people = useStoredList(loadPeople)
  const skills = useStoredList(loadSkills)
  const personSkills = useStoredList(loadPersonSkills)
  const [name, setName] = useState('')
  const [copy, setCopy] = useState(true)
  const [error, setError] = useState<string>()
  const [message, setMessage] = useState<string>()

  const currentId = personId ?? OWNER_PERSON_ID
  const current = people.items.find((p) => p.id === currentId)
  const owner = people.items.find((p) => p.id === OWNER_PERSON_ID)
  const template = current ?? owner

  const profile = useMemo(
    () => skillsOfPerson(currentId, personSkills.items, skills.items),
    [currentId, personSkills.items, skills.items],
  )

  const create = (event: FormEvent) => {
    event.preventDefault()
    const result = createProfile(name, copy ? template?.id : undefined)
    if ('error' in result) return setError(t.skillsTemplate.nameRequired)
    setError(undefined)
    setName('')
    people.reload()
    personSkills.reload()
    setMessage(format(t.skillsTemplate.created, { name: result.person.nome }))
    onSelectPerson(result.person.id)
  }

  if (!people.ready) return <p className='text-sm text-fg'>{t.common.loading}</p>

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid gap-4 lg:grid-cols-2'>
        <SelectField
          label={t.skillsTemplate.profile}
          value={current ? currentId : ''}
          options={[...people.items]
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map((p) => ({ value: p.id, label: p.nome }))}
          onChange={(e) => {
            setMessage(undefined)
            onSelectPerson(e.target.value)
          }}
        />

        <form
          onSubmit={create}
          aria-label={t.skillsTemplate.createTitle}
          className='flex flex-col gap-2 rounded-md border border-line p-3'
        >
          <p className='text-sm font-semibold text-fg-strong'>{t.skillsTemplate.createTitle}</p>
          <div className='flex flex-wrap items-end gap-2'>
            <label className='flex min-w-48 flex-1 flex-col gap-1'>
              <span className='text-xs font-medium text-fg'>{t.skillsTemplate.yourName}</span>
              <Input
                value={name}
                aria-invalid={error ? true : undefined}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <Button type='submit'>
              <UserPlus size={14} aria-hidden /> {t.skillsTemplate.create}
            </Button>
          </div>
          {template && (
            <label className='flex items-center gap-2 text-xs text-fg'>
              <input
                type='checkbox'
                className='size-4 accent-accent'
                checked={copy}
                onChange={(e) => setCopy(e.target.checked)}
              />
              {format(t.skillsTemplate.copyFrom, { name: template.nome })}
            </label>
          )}
          {error && (
            <p role='alert' className='text-xs text-danger'>
              {error}
            </p>
          )}
        </form>
      </div>

      {message && (
        <p role='status' className='text-sm text-fg-strong'>
          {message}
        </p>
      )}

      {current && (
        <>
          <SkillsRadar profile={profile} />
          <section aria-label={current.nome} className='flex flex-col gap-3'>
            <h2 className='text-lg font-semibold text-fg-strong'>{current.nome}</h2>
            <PersonSkillsEditor
              key={currentId}
              personId={currentId}
              onChange={(next) => personSkills.setItems(next)}
            />
          </section>
        </>
      )}
    </div>
  )
}

export default SkillsTemplate
