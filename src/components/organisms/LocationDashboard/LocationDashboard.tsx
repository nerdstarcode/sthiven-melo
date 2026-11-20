import { useMemo } from 'react'
import { SelectField } from '@/components/molecules/FormField'
import { SegmentedControl } from '@/components/molecules/SegmentedControl'
import { PeopleSummaryTable } from '@/components/organisms/PeopleSummaryTable'
import { PersonMetricsView } from '@/components/organisms/PersonMetricsView'
import { SquadsDeliveryChart } from '@/components/organisms/SquadsDeliveryChart'
import { loadAzureConfig } from '@/features/location-overview/lib/azure/azureConfigStorage'
import { loadCargos } from '@/features/location-overview/lib/cargosStorage'
import {
  dashboardPeople,
  dashboardSupport,
  type DashboardBase,
} from '@/features/location-overview/lib/dashboardData'
import { loadLevels } from '@/features/location-overview/lib/levelsStorage'
import { loadPeople } from '@/features/location-overview/lib/peopleStorage'
import { loadPersonAllocations } from '@/features/location-overview/lib/personAllocationsStorage'
import { loadPersonSupports } from '@/features/location-overview/lib/personSupportsStorage'
import { squadDeliveryBySprint } from '@/features/location-overview/lib/squadDelivery'
import { loadSprints } from '@/features/location-overview/lib/sprintsStorage'
import { loadSquads } from '@/features/location-overview/lib/squadsStorage'
import { loadTestExecutions } from '@/features/location-overview/lib/testExecutionsStorage'
import { loadTestReports } from '@/features/location-overview/lib/testReportsStorage'
import { loadWorkItems } from '@/features/location-overview/lib/workItemsStorage'
import { useStoredList } from '@/features/shared/useStoredList'
import { useTranslation } from '@/i18n'

export type DashboardView = 'squads' | 'people'

export interface DashboardSelection {
  view: DashboardView
  /** Pessoa aberta na visão de pessoas. */
  personId?: string
  /** Squad do filtro (id); sem ela, todas. */
  squadId?: string
}

export interface LocationDashboardProps extends DashboardSelection {
  onNavigate: (selection: DashboardSelection) => void
  /** "Hoje", para saber a sprint atual (padrão: agora). */
  today?: Date
}

const loadSettings = () => [loadAzureConfig()]

/** Dashboard do Location Overview: entregas por squad e métricas das pessoas. */
export function LocationDashboard({
  view,
  personId,
  squadId,
  onNavigate,
  today,
}: LocationDashboardProps) {
  const t = useTranslation('apps').dashboard
  const people = useStoredList(loadPeople)
  const rows = useStoredList(loadWorkItems)
  const sprints = useStoredList(loadSprints)
  const allocations = useStoredList(loadPersonAllocations)
  const levels = useStoredList(loadLevels)
  const cargos = useStoredList(loadCargos)
  const executions = useStoredList(loadTestExecutions)
  const testReports = useStoredList(loadTestReports)
  const squads = useStoredList(loadSquads)
  const supports = useStoredList(loadPersonSupports)
  const settings = useStoredList(loadSettings)
  const pointTypes = settings.items[0]?.pointTypes

  const base = useMemo<DashboardBase>(
    () => ({
      people: people.items,
      rows: rows.items,
      sprints: sprints.items,
      allocations: allocations.items,
      levels: levels.items,
      cargos: cargos.items,
      executions: executions.items,
      testReports: testReports.items,
      squads: squads.items,
      supports: supports.items,
    }),
    [people.items, rows.items, sprints.items, allocations.items, levels.items, cargos.items, executions.items, testReports.items, squads.items, supports.items],
  )

  const squad = base.squads.find((s) => s.id === squadId)
  const filters = useMemo(
    () => ({ pointTypes: pointTypes ?? [], selectedSquads: squad ? [squad.name] : [], today }),
    [pointTypes, squad, today],
  )

  const deliveries = useMemo(
    () =>
      squadDeliveryBySprint(base.sprints, squad ? [squad] : base.squads, base.rows, filters.pointTypes),
    [base, squad, filters.pointTypes],
  )
  const summary = useMemo(
    () => (view === 'people' && pointTypes ? dashboardPeople(base, filters) : []),
    [view, base, filters, pointTypes],
  )
  const personRow = personId ? summary.find((r) => r.person.id === personId) : undefined
  const support = useMemo(
    () => (personRow ? dashboardSupport(personRow, base, filters) : null),
    [personRow, base, filters],
  )

  if (!settings.ready) return null

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div className='w-full max-w-xs'>
          <SelectField
            label={t.squadFilter}
            value={squadId ?? ''}
            placeholder={t.allSquads}
            options={base.squads.map((s) => ({ value: s.id, label: s.name }))}
            onChange={(e) => onNavigate({ view, personId, squadId: e.target.value || undefined })}
          />
        </div>
        <SegmentedControl
          aria-label={t.viewLabel}
          options={[
            { value: 'squads', label: t.views.squads },
            { value: 'people', label: t.views.people },
          ]}
          value={view}
          onChange={(next) => onNavigate({ view: next, squadId })}
        />
      </div>

      {view === 'squads' && <SquadsDeliveryChart deliveries={deliveries} />}
      {view === 'people' && !personId && (
        <PeopleSummaryTable
          rows={summary}
          onOpenPerson={(id) => onNavigate({ view, personId: id, squadId })}
        />
      )}
      {view === 'people' && personId && personRow && (
        <PersonMetricsView
          row={personRow}
          support={support}
          onBack={() => onNavigate({ view, squadId })}
        />
      )}
      {view === 'people' && personId && !personRow && people.ready && (
        <p role='status' className='text-sm text-fg'>
          {t.person.notFound}
        </p>
      )}
    </div>
  )
}

export default LocationDashboard
