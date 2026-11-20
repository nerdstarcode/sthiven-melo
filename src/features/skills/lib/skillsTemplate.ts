import { createId } from '@/features/location-overview/lib/createId'
import { upsertPerson, type Person } from '@/features/location-overview/lib/peopleStorage'
import {
  loadPersonSkills,
  savePersonSkills,
  SKILL_TYPES,
  type PersonSkillDetail,
  type SkillType,
} from './skillsStorage'

export type ProfileNameError = 'required'

/**
 * Cria o perfil de um visitante no cadastro de pessoas (compartilhado com o Location Overview).
 * Com `copyFromId`, começa com as mesmas skills e níveis daquele perfil (o "template").
 */
export function createProfile(
  name: string,
  copyFromId?: string,
): { person: Person } | { error: ProfileNameError } {
  const nome = name.trim()
  if (!nome) return { error: 'required' }
  const person: Person = { id: createId(), nome, email: '', cargo: '', nivel: '', squadIds: [] }
  upsertPerson(person)
  if (copyFromId) {
    const all = loadPersonSkills()
    const copied = all
      .filter((ps) => ps.personId === copyFromId)
      .map((ps) => ({ ...ps, personId: person.id }))
    savePersonSkills([...all, ...copied])
  }
  return { person }
}

export interface ProfileSummary {
  type: SkillType
  count: number
  /** Média dos níveis (1 a 5), com uma casa; 0 sem skills. */
  average: number
}

/** Quantidade e média de nível das hard e soft skills do perfil. */
export function summarizeProfile(profile: PersonSkillDetail[]): ProfileSummary[] {
  return SKILL_TYPES.map((type) => {
    const levels = profile.filter((p) => p.skill.type === type).map((p) => p.level)
    const average = levels.length ? levels.reduce((s, l) => s + l, 0) / levels.length : 0
    return { type, count: levels.length, average: Math.round(average * 10) / 10 }
  })
}
