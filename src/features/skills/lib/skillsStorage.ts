import { createId } from '@/features/location-overview/lib/createId'
import { readList, writeJson } from '@/features/location-overview/lib/localStore'

export const SKILL_TYPES = ['hard', 'soft'] as const
export type SkillType = (typeof SKILL_TYPES)[number]

export const MIN_PROFICIENCY = 1
export const MAX_PROFICIENCY = 5

export interface Skill {
  id: string
  name: string
  type: SkillType
  /** Agrupamento livre (ex.: "Frontend", "Comunicação"). */
  category?: string
}

/** Proficiência de uma pessoa numa skill, de 1 a 5. */
export interface PersonSkill {
  personId: string
  skillId: string
  level: number
}

const SKILLS_KEY = 'skills:catalog'
const PERSON_SKILLS_KEY = 'skills:person-skills'

export function loadSkills(): Skill[] {
  return readList<Skill>(SKILLS_KEY)
}

export function saveSkills(skills: Skill[]): void {
  writeJson(SKILLS_KEY, skills)
}

export function loadPersonSkills(): PersonSkill[] {
  return readList<PersonSkill>(PERSON_SKILLS_KEY)
}

export function savePersonSkills(personSkills: PersonSkill[]): void {
  writeJson(PERSON_SKILLS_KEY, personSkills)
}

export function clampProficiency(level: number): number {
  return Math.min(MAX_PROFICIENCY, Math.max(MIN_PROFICIENCY, Math.round(level)))
}

/** Cria (id vazio) ou atualiza uma skill, mantendo o catálogo ordenado por nome. */
export function upsertSkill(skill: Skill): Skill[] {
  const withId = skill.id ? skill : { ...skill, id: createId() }
  const skills = loadSkills()
  const index = skills.findIndex((s) => s.id === withId.id)
  const next = index >= 0 ? skills.map((s, i) => (i === index ? withId : s)) : [...skills, withId]
  next.sort((a, b) => a.name.localeCompare(b.name))
  saveSkills(next)
  return next
}

/** Remove a skill do catálogo e as proficiências ligadas a ela. */
export function deleteSkill(id: string): Skill[] {
  const next = loadSkills().filter((s) => s.id !== id)
  saveSkills(next)
  savePersonSkills(loadPersonSkills().filter((ps) => ps.skillId !== id))
  return next
}

/** Define (ou atualiza) a proficiência da pessoa na skill. */
export function setPersonSkill(personId: string, skillId: string, level: number): PersonSkill[] {
  const entry: PersonSkill = { personId, skillId, level: clampProficiency(level) }
  const others = loadPersonSkills().filter((ps) => !(ps.personId === personId && ps.skillId === skillId))
  const next = [...others, entry]
  savePersonSkills(next)
  return next
}

export function removePersonSkill(personId: string, skillId: string): PersonSkill[] {
  const next = loadPersonSkills().filter((ps) => !(ps.personId === personId && ps.skillId === skillId))
  savePersonSkills(next)
  return next
}

/** Remove todas as proficiências de uma pessoa (ex.: ao excluí-la). */
export function removeSkillsOfPerson(personId: string): PersonSkill[] {
  const next = loadPersonSkills().filter((ps) => ps.personId !== personId)
  savePersonSkills(next)
  return next
}

export interface PersonSkillDetail extends PersonSkill {
  skill: Skill
}

/** Skills da pessoa com os dados do catálogo, ordenadas por nível (desc) e nome. Ignora skills removidas. */
export function skillsOfPerson(
  personId: string,
  personSkills: PersonSkill[],
  skills: Skill[],
): PersonSkillDetail[] {
  const byId = new Map(skills.map((s) => [s.id, s]))
  return personSkills
    .filter((ps) => ps.personId === personId && byId.has(ps.skillId))
    .map((ps) => ({ ...ps, skill: byId.get(ps.skillId)! }))
    .sort((a, b) => b.level - a.level || a.skill.name.localeCompare(b.skill.name))
}
