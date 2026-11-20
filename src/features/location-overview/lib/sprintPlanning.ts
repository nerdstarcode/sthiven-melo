import { matchingWorkItems } from './allocationGroups'
import type { LevelConfig } from './levelsStorage'
import { loadStatusOf, SPRINT_EXTENSION_DAYS, type LoadStatus } from './loadStatus'
import { round1 } from './numbers'
import type { Person } from './peopleStorage'
import { pointsForEntry, type PersonAllocation } from './personAllocationsStorage'
import type { Sprint } from './sprintsStorage'
import type { Squad } from './squadsStorage'
import type { WorkItemRow } from './workItems'

// Planejamento de uma sprint por squad: o previsto da alocação × os SP planejados da squad.

export interface PlanBase {
  allocations: PersonAllocation[]
  people: Person[]
  levels: LevelConfig[]
  workItems: WorkItemRow[]
}

export interface SprintPlanTotals {
  people: number
  /** % somada das alocações. */
  percentage: number
  capacity: number
  max: number
  /** Máximo com os dias de extensão. */
  maxExtended: number
  plannedPoints: number
  /** null sem alocação (não há previsto para comparar). */
  status: LoadStatus | null
}

export interface SquadSprintPlan extends SprintPlanTotals {
  squad: Squad
  entries: PersonAllocation[]
}

export type SprintPlanSummary = SprintPlanTotals & { squads: number }

function statusOf(totals: Omit<SprintPlanTotals, 'status'>): LoadStatus | null {
  return totals.people > 0
    ? loadStatusOf(totals.plannedPoints, totals.capacity, totals.max, totals.maxExtended)
    : null
}

export function squadSprintPlan(squad: Squad, sprint: Sprint, base: PlanBase): SquadSprintPlan {
  const peopleById = new Map(base.people.map((p) => [p.id, p]))
  const entries = base.allocations.filter(
    (a) => a.squadId === squad.id && a.sprintId === sprint.id,
  )
  const extendedSprint = { totalValidDays: sprint.totalValidDays + SPRINT_EXTENSION_DAYS }
  let capacity = 0
  let max = 0
  let maxExtended = 0
  for (const entry of entries) {
    const person = peopleById.get(entry.personId)
    const points = pointsForEntry(entry, sprint, person, base.levels)
    capacity += points.capacity
    max += points.max
    maxExtended += pointsForEntry(entry, extendedSprint, person, base.levels).max
  }
  const plannedPoints = matchingWorkItems(base.workItems, squad, sprint).reduce(
    (sum, item) => sum + item.storyPoints,
    0,
  )
  const totals = {
    people: entries.length,
    percentage: entries.reduce((sum, e) => sum + e.percentage, 0),
    capacity: round1(capacity),
    max: round1(max),
    maxExtended: round1(maxExtended),
    plannedPoints: round1(plannedPoints),
  }
  return { squad, entries, ...totals, status: statusOf(totals) }
}

/** Ordem dos cards: mais acima do previsto primeiro; squads sem alocação no fim. */
const STATUS_RANK: Record<LoadStatus, number> = {
  overload: 0,
  extension: 1,
  above: 2,
  within: 3,
  below: 4,
}
const rankOf = (plan: SquadSprintPlan) => (plan.status === null ? 99 : STATUS_RANK[plan.status])

export function sprintSquadPlans(
  sprint: Sprint,
  squads: Squad[],
  base: PlanBase,
): SquadSprintPlan[] {
  return squads
    .map((squad) => squadSprintPlan(squad, sprint, base))
    .sort((a, b) => rankOf(a) - rankOf(b) || a.squad.name.localeCompare(b.squad.name))
}

/** Soma das squads com alocação na sprint e a situação geral pela mesma régua. */
export function sprintPlanSummary(plans: SquadSprintPlan[]): SprintPlanSummary {
  const allocated = plans.filter((p) => p.people > 0)
  const sum = (pick: (p: SquadSprintPlan) => number) =>
    round1(allocated.reduce((total, p) => total + pick(p), 0))
  const totals = {
    people: new Set(allocated.flatMap((p) => p.entries.map((e) => e.personId))).size,
    percentage: sum((p) => p.percentage),
    capacity: sum((p) => p.capacity),
    max: sum((p) => p.max),
    maxExtended: sum((p) => p.maxExtended),
    plannedPoints: sum((p) => p.plannedPoints),
  }
  return { ...totals, squads: allocated.length, status: statusOf(totals) }
}
