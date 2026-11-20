import { DEFAULT_LEVELS } from '@/features/location-overview/lib/levelsStorage'
import {
  sprintPlanSummary,
  sprintSquadPlans,
  type PlanBase,
} from '@/features/location-overview/lib/sprintPlanning'
import { sprintPhase } from '@/features/location-overview/lib/sprintsStorage'
import {
  demoAllocations,
  demoCargos,
  demoPeople,
  demoSprints,
  demoSquads,
  demoWorkItems,
} from './demoSeed'

/** "Hoje" fixo das stories e testes: sp-10 fechada, sp-11 atual, sp-12 aberta. */
export const DEMO_TODAY = new Date(2026, 10, 20)

export const demoPlanBase: PlanBase = {
  allocations: demoAllocations,
  people: demoPeople,
  levels: DEFAULT_LEVELS,
  workItems: demoWorkItems,
}

export const demoSupportContext = {
  allocations: demoAllocations,
  people: demoPeople,
  cargos: demoCargos,
}

export const demoTimelineRows = demoSprints.map((sprint) => ({
  sprint,
  phase: sprintPhase(sprint, DEMO_TODAY),
  plan: sprintPlanSummary(sprintSquadPlans(sprint, demoSquads, demoPlanBase)),
}))
