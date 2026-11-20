import { DEFAULT_LEVELS } from '@/features/location-overview/lib/levelsStorage'
import {
  sprintPlanSummary,
  sprintSquadPlans,
  type PlanBase,
} from '@/features/location-overview/lib/sprintPlanning'
import { analyzeSquadSprint } from '@/features/location-overview/lib/sprintAnalysis'
import { sprintPhase } from '@/features/location-overview/lib/sprintsStorage'
import { findTestRuns } from '@/features/location-overview/lib/testRunsStorage'
import {
  demoAllocations,
  demoCargos,
  demoPeople,
  demoSprints,
  demoSquads,
  demoTestRuns,
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

/** Métricas da análise da squad Web na sprint (`sp-10` fechada ou `sp-11` em andamento). */
export function demoSprintMetrics(sprintId: 'sp-10' | 'sp-11' | 'sp-12' = 'sp-11') {
  const squad = demoSquads[0]
  const sprint = demoSprints.find((s) => s.id === sprintId)!
  return analyzeSquadSprint(
    squad,
    sprint,
    { ...demoPlanBase, cargos: demoCargos },
    { testRuns: findTestRuns(demoTestRuns, squad.id, sprint.id) },
  )
}

export const demoTimelineRows =demoSprints.map((sprint) => ({
  sprint,
  phase: sprintPhase(sprint, DEMO_TODAY),
  plan: sprintPlanSummary(sprintSquadPlans(sprint, demoSquads, demoPlanBase)),
}))
