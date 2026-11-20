import { isQaPerson } from './azure/sprintMetrics'
import type { CargoConfig } from './cargosStorage'
import { createId } from './createId'
import { readList, writeJson } from './localStore'
import type { Person } from './peopleStorage'
import type { PersonAllocation } from './personAllocationsStorage'

// Apoio (mentoria) entre pessoas numa sprint: `supporterId` dedica `percentage`% a apoiar
// `supportedId`. A % vale sobre a carga do apoiado; os números do apoiado não mudam.

export interface PersonSupport {
  id: string
  supporterId: string
  supportedId: string
  sprintId: string
  percentage: number
}

export type SupportDraft = Omit<PersonSupport, 'id'>

/** Atalhos de intensidade do apoio (o rótulo vem do i18n por `key`). */
export const SUPPORT_PRESETS = [
  { key: 'light', percentage: 10 },
  { key: 'medium', percentage: 25 },
  { key: 'intense', percentage: 50 },
] as const

export const DEFAULT_SUPPORT_PERCENTAGE = 25

const STORAGE_KEY = 'location-overview:person-supports'

export function loadPersonSupports(): PersonSupport[] {
  return readList<PersonSupport>(STORAGE_KEY)
}

export function savePersonSupports(supports: PersonSupport[]): void {
  writeJson(STORAGE_KEY, supports)
}

export interface SupportContext {
  allocations: PersonAllocation[]
  people: Person[]
  cargos: CargoConfig[]
}

export type SupportIssue =
  | { code: 'unknownPerson' }
  | { code: 'notAllocated'; name: string }
  | { code: 'mixedQa' }

export type SupportDraftError =
  | SupportIssue
  | { code: 'missingPeople' }
  | { code: 'samePerson' }
  | { code: 'invalidPercentage' }
  | { code: 'duplicate' }

const isAllocated = (allocations: PersonAllocation[], personId: string, sprintId: string) =>
  allocations.some((a) => a.personId === personId && a.sprintId === sprintId && a.percentage > 0)

/**
 * Por que um apoio guardado não vale (pessoa desalocada da sprint, QA × não-QA); null quando
 * vale. Apoios com aviso ficam guardados, mas fora do cálculo.
 */
export function supportIssue(support: SupportDraft, context: SupportContext): SupportIssue | null {
  const supporter = context.people.find((p) => p.id === support.supporterId)
  const supported = context.people.find((p) => p.id === support.supportedId)
  if (!supporter || !supported) return { code: 'unknownPerson' }
  for (const person of [supporter, supported]) {
    if (!isAllocated(context.allocations, person.id, support.sprintId)) {
      return { code: 'notAllocated', name: person.nome }
    }
  }
  if (isQaPerson(supporter, context.cargos) !== isQaPerson(supported, context.cargos)) {
    return { code: 'mixedQa' }
  }
  return null
}

/** Erro do cadastro de um apoio novo; null quando pode gravar. */
export function validateSupportDraft(
  draft: SupportDraft,
  supports: PersonSupport[],
  context: SupportContext,
): SupportDraftError | null {
  if (!draft.supporterId || !draft.supportedId) return { code: 'missingPeople' }
  if (draft.supporterId === draft.supportedId) return { code: 'samePerson' }
  if (!(draft.percentage > 0 && draft.percentage <= 100)) return { code: 'invalidPercentage' }
  const duplicate = supports.some(
    (s) =>
      s.sprintId === draft.sprintId &&
      s.supporterId === draft.supporterId &&
      s.supportedId === draft.supportedId,
  )
  if (duplicate) return { code: 'duplicate' }
  return supportIssue(draft, context)
}

/** Grava um apoio novo (já validado). */
export function addPersonSupport(draft: SupportDraft): PersonSupport[] {
  const next = [...loadPersonSupports(), { ...draft, id: createId() }]
  savePersonSupports(next)
  return next
}

/** Remove vários apoios; devolve também os removidos, para o "Desfazer". */
export function deletePersonSupports(ids: string[]): {
  supports: PersonSupport[]
  removed: PersonSupport[]
} {
  const idSet = new Set(ids)
  const all = loadPersonSupports()
  const next = all.filter((s) => !idSet.has(s.id))
  savePersonSupports(next)
  return { supports: next, removed: all.filter((s) => idSet.has(s.id)) }
}

/** Devolve apoios removidos (o "Desfazer"), sem duplicar os que ainda existam. */
export function restorePersonSupports(entries: PersonSupport[]): PersonSupport[] {
  const supports = loadPersonSupports()
  const ids = new Set(supports.map((s) => s.id))
  const next = [...supports, ...entries.filter((entry) => !ids.has(entry.id))]
  savePersonSupports(next)
  return next
}

export function setSupportPercentage(id: string, percentage: number): PersonSupport[] {
  const next = loadPersonSupports().map((s) => (s.id === id ? { ...s, percentage } : s))
  savePersonSupports(next)
  return next
}

/** Remove os apoios em que a pessoa aparece (ao excluir a pessoa). */
export function removeSupportsOfPerson(personId: string): PersonSupport[] {
  const next = loadPersonSupports().filter(
    (s) => s.supporterId !== personId && s.supportedId !== personId,
  )
  savePersonSupports(next)
  return next
}

/**
 * Copia para `toSprintId` os apoios de `fromSprintId` que ainda não existem lá. Os que ficarem
 * inválidos (pessoa não alocada na nova sprint) são copiados mesmo assim e aparecem com aviso.
 */
export function copySupportsFromSprint(
  fromSprintId: string,
  toSprintId: string,
): { supports: PersonSupport[]; copied: number } {
  const supports = loadPersonSupports()
  const pairKey = (s: SupportDraft) => `${s.supporterId}|${s.supportedId}`
  const existing = new Set(supports.filter((s) => s.sprintId === toSprintId).map(pairKey))
  const copies = supports
    .filter((s) => s.sprintId === fromSprintId && !existing.has(pairKey(s)))
    .map((s) => ({ ...s, id: createId(), sprintId: toSprintId }))
  const next = [...supports, ...copies]
  savePersonSupports(next)
  return { supports: next, copied: copies.length }
}
