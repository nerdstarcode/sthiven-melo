import type { LevelConfig } from './levelsStorage'
import type { Person } from './peopleStorage'
import {
  pointsForEntry,
  sumPercentageForPersonInSprint,
  type PersonAllocation,
} from './personAllocationsStorage'
import { squadMatchesIterationPath } from './squadMatching'
import type { Sprint } from './sprintsStorage'
import type { Squad } from './squadsStorage'
import type { WorkItemRow } from './workItems'

/**
 * Work items cujo Iteration Path bate com a squad e cujo Sprint/Fiscal Year batem com a sprint,
 * opcionalmente restritos ao e-mail de uma pessoa.
 */
export function matchingWorkItems(
  workItems: WorkItemRow[],
  squad: Squad,
  sprint: Sprint,
  email?: string,
): WorkItemRow[] {
  const sprintLabel = `Sprint ${String(sprint.number).padStart(2, '0')}`
  const fiscalYear = sprint.fiscalYear.toUpperCase()
  const normalizedEmail = email?.trim().toLowerCase()
  return workItems.filter(
    (item) =>
      squadMatchesIterationPath(squad, item.iterationPath) &&
      item.sprint === sprintLabel &&
      item.fiscalYear === fiscalYear &&
      (!normalizedEmail || item.email.trim().toLowerCase() === normalizedEmail),
  )
}

/** Story points e pontos de execução dos work items da pessoa (pelo e-mail) na squad e sprint. */
export function personPoints(
  workItems: WorkItemRow[],
  squad: Squad,
  sprint: Sprint,
  person: Person | undefined,
): { storyPoints: number; pontoExecucao: number } {
  if (!person?.email.trim()) return { storyPoints: 0, pontoExecucao: 0 }
  const matches = matchingWorkItems(workItems, squad, sprint, person.email)
  return {
    storyPoints: matches.reduce((sum, item) => sum + item.storyPoints, 0),
    pontoExecucao: matches.reduce((sum, item) => sum + item.pontoExecucao, 0),
  }
}

export interface AllocationGroup {
  key: string
  squad: Squad
  sprint: Sprint
  entries: PersonAllocation[]
  capacityPoints: number
  maxPoints: number
  storyPoints: number
}

export interface AllocationContext {
  squads: Squad[]
  sprints: Sprint[]
  people: Person[]
  levels: LevelConfig[]
  workItems: WorkItemRow[]
}

export const groupKey = (squadId: string, sprintId: string) => `${squadId}::${sprintId}`

/**
 * Agrupa as alocações por squad + sprint, com capacity/max points (dias alocados × pontos/dia
 * do nível) e story points dos work items. Grupos de squad ou sprint removidas são ignorados.
 * Ordena por squad e depois pelo número da sprint.
 */
export function buildAllocationGroups(
  allocations: PersonAllocation[],
  { squads, sprints, people, levels, workItems }: AllocationContext,
): AllocationGroup[] {
  const squadById = new Map(squads.map((s) => [s.id, s]))
  const sprintById = new Map(sprints.map((s) => [s.id, s]))
  const personById = new Map(people.map((p) => [p.id, p]))

  const byKey = new Map<string, PersonAllocation[]>()
  for (const entry of allocations) {
    const key = groupKey(entry.squadId, entry.sprintId)
    byKey.set(key, [...(byKey.get(key) ?? []), entry])
  }

  const groups: AllocationGroup[] = []
  for (const [key, entries] of byKey) {
    const squad = squadById.get(entries[0].squadId)
    const sprint = sprintById.get(entries[0].sprintId)
    if (!squad || !sprint) continue
    let capacityPoints = 0
    let maxPoints = 0
    for (const entry of entries) {
      const points = pointsForEntry(entry, sprint, personById.get(entry.personId), levels)
      capacityPoints += points.capacity
      maxPoints += points.max
    }
    const storyPoints = matchingWorkItems(workItems, squad, sprint).reduce(
      (sum, item) => sum + item.storyPoints,
      0,
    )
    groups.push({ key, squad, sprint, entries, capacityPoints, maxPoints, storyPoints })
  }

  return groups.sort(
    (a, b) => a.squad.name.localeCompare(b.squad.name) || a.sprint.number - b.sprint.number,
  )
}

export type AllocationError =
  | { code: 'missingFields' }
  | { code: 'invalidPercentage' }
  | { code: 'overAllocated'; otherPercentage: number }

/**
 * Valida uma alocação: pessoa, squad e sprint obrigatórias; % entre 1 e 100;
 * e a soma da pessoa na sprint (em todas as squads) não pode passar de 100%.
 */
export function validateAllocation(
  draft: PersonAllocation,
  allocations: PersonAllocation[],
): AllocationError | null {
  if (!draft.personId || !draft.squadId || !draft.sprintId) return { code: 'missingFields' }
  if (!(draft.percentage > 0 && draft.percentage <= 100)) return { code: 'invalidPercentage' }
  const otherPercentage = sumPercentageForPersonInSprint(
    allocations,
    draft.personId,
    draft.sprintId,
    draft.id,
  )
  if (otherPercentage + draft.percentage > 100) return { code: 'overAllocated', otherPercentage }
  return null
}
