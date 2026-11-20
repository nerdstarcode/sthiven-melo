import type { CargoConfig } from './cargosStorage'
import type { LevelConfig } from './levelsStorage'
import type { Person } from './peopleStorage'
import {
  computePeopleSummary,
  computePersonDevMetrics,
  computePersonQaMetrics,
  type PersonSummaryRow,
} from './personMetrics'
import type { PersonAllocation } from './personAllocationsStorage'
import type { PersonSupport } from './personSupportsStorage'
import type { Sprint } from './sprintsStorage'
import type { Squad } from './squadsStorage'
import {
  devLoadBySprint,
  personSupportView,
  qaLoadBySprint,
  type LoadBySprint,
  type PersonSupportView,
} from './supportMetrics'
import type { TestExecution } from './testExecutionsStorage'
import type { TestReport } from './testReportsStorage'
import type { WorkItemRow } from './workItems'

/** Tudo o que o Dashboard lê da base local. */
export interface DashboardBase {
  people: Person[]
  rows: WorkItemRow[]
  sprints: Sprint[]
  allocations: PersonAllocation[]
  levels: LevelConfig[]
  cargos: CargoConfig[]
  executions: TestExecution[]
  testReports: TestReport[]
  squads: Squad[]
  supports: PersonSupport[]
}

export interface DashboardFilters {
  pointTypes: string[]
  /** Nomes de squad; vazio = todas. */
  selectedSquads?: string[]
  today?: Date
}

const inputOf = (base: DashboardBase, filters: DashboardFilters) => ({
  ...base,
  selectedSprints: [],
  selectedSquads: filters.selectedSquads ?? [],
  today: filters.today,
  mode: 'assigned' as const,
  pointTypes: filters.pointTypes,
})

/** Métricas de Dev e QA de cada pessoa com algo nos filtros (item, teste ou alocação). */
export function dashboardPeople(base: DashboardBase, filters: DashboardFilters): PersonSummaryRow[] {
  return computePeopleSummary(inputOf(base, filters))
}

/**
 * Apoio dado e recebido pela pessoa, nas mesmas sprints das métricas dela. A carga de cada apoiado
 * vem da mesma visão (SP para Dev, Test Points para QA), sem o filtro de squad, porque o apoio é
 * por sprint. null sem apoio.
 */
export function dashboardSupport(
  row: PersonSummaryRow,
  base: DashboardBase,
  filters: DashboardFilters,
): PersonSupportView | null {
  const isQa = row.tipo === 'QA'
  const supportedInput = { ...inputOf(base, filters), selectedSquads: [] }
  const cache = new Map<string, LoadBySprint>()
  const loadOf = (personId: string): LoadBySprint => {
    const person = base.people.find((p) => p.id === personId)
    if (!person) return new Map()
    if (!cache.has(personId)) {
      const input = { ...supportedInput, person }
      cache.set(
        personId,
        isQa
          ? qaLoadBySprint(computePersonQaMetrics(input))
          : devLoadBySprint(computePersonDevMetrics(input)),
      )
    }
    return cache.get(personId)!
  }
  const common = {
    personId: row.person.id,
    supports: base.supports,
    sprints: base.sprints,
    context: base,
    loadOf,
  }
  return isQa
    ? personSupportView({ ...common, metricsSprints: row.qa.sprints, loadOfSprint: (s) => s.testPoints })
    : personSupportView({
        ...common,
        metricsSprints: row.dev.sprints,
        loadOfSprint: (s) => s.onTime + s.delayed + s.inProgress + s.inProgressDelayed,
      })
}
