import { matchingWorkItems } from './allocationGroups'
import { DEFAULT_AZURE_CONFIG } from './azure/azureConfigStorage'
import type { TestRunsSummary } from './azure/mappers'
import { computeSprintMetrics, type SprintMetrics } from './azure/sprintMetrics'
import type { CargoConfig } from './cargosStorage'
import { workingDaysBetween } from './dates'
import type { LevelConfig } from './levelsStorage'
import type { Person } from './peopleStorage'
import type { PersonAllocation } from './personAllocationsStorage'
import type { Sprint } from './sprintsStorage'
import type { Squad } from './squadsStorage'
import type { WorkItemRow } from './workItems'

export interface SprintAnalysisBase {
  workItems: WorkItemRow[]
  people: Person[]
  allocations: PersonAllocation[]
  levels: LevelConfig[]
  cargos: CargoConfig[]
}

export interface SprintAnalysisOptions {
  pointTypes?: string[]
  qaMinPercent?: number
  qaMaxPercent?: number
  hiddenIds?: ReadonlySet<number>
  /** Resumo dos test runs gravado na sincronização; null quando não há. */
  testRuns?: TestRunsSummary | null
}

/**
 * Métricas de uma squad numa sprint a partir da base local (work items sincronizados do Azure
 * ou da demonstração), no mesmo formato da análise ao vivo do Location Overview.
 */
export function analyzeSquadSprint(
  squad: Squad,
  sprint: Sprint,
  base: SprintAnalysisBase,
  {
    pointTypes = DEFAULT_AZURE_CONFIG.pointTypes,
    qaMinPercent = DEFAULT_AZURE_CONFIG.qaMinPercent,
    qaMaxPercent = DEFAULT_AZURE_CONFIG.qaMaxPercent,
    hiddenIds,
    testRuns = null,
  }: SprintAnalysisOptions = {},
): SprintMetrics {
  const metrics = computeSprintMetrics({
    items: matchingWorkItems(base.workItems, squad, sprint),
    pointTypes,
    workingDays: workingDaysBetween(sprint.startDate, sprint.endDate),
    testRuns: undefined,
    members: [],
    people: base.people,
    allocations: base.allocations,
    levels: base.levels,
    cargos: base.cargos,
    squadId: squad.id,
    sprint,
    qaMinPercent,
    qaMaxPercent,
    hiddenIds,
  })
  return { ...metrics, testRuns }
}
