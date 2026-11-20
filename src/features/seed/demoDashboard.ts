import { DEFAULT_AZURE_CONFIG } from '@/features/location-overview/lib/azure/azureConfigStorage'
import {
  dashboardPeople,
  dashboardSupport,
  type DashboardBase,
} from '@/features/location-overview/lib/dashboardData'
import { DEFAULT_LEVELS } from '@/features/location-overview/lib/levelsStorage'
import { DEMO_TODAY } from './demoPlanning'
import {
  demoAllocations,
  demoCargos,
  demoPeople,
  demoSprints,
  demoSquads,
  demoSupports,
  demoWorkItems,
} from './demoSeed'

/** Base do Dashboard com os dados da demonstração, para stories e testes. */
export const demoDashboardBase: DashboardBase = {
  people: demoPeople,
  rows: demoWorkItems,
  sprints: demoSprints,
  allocations: demoAllocations,
  levels: DEFAULT_LEVELS,
  cargos: demoCargos,
  executions: [],
  testReports: [],
  squads: demoSquads,
  supports: demoSupports,
}

export const demoDashboardFilters = {
  pointTypes: DEFAULT_AZURE_CONFIG.pointTypes,
  today: DEMO_TODAY,
}

export const demoPeopleSummary = dashboardPeople(demoDashboardBase, demoDashboardFilters)

/** Linha e apoio de uma pessoa da demonstração. */
export function demoPersonDashboard(personId: string) {
  const row = demoPeopleSummary.find((r) => r.person.id === personId)!
  return { row, support: dashboardSupport(row, demoDashboardBase, demoDashboardFilters) }
}
