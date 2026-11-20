import { useMemo } from 'react'
import { SelectField } from '@/components/molecules/FormField'
import { SprintCharts } from '@/components/organisms/SprintCharts'
import { SprintKpis } from '@/components/organisms/SprintKpis'
import { SprintPeopleTable } from '@/components/organisms/SprintPeopleTable'
import { SprintTestRunsSummary } from '@/components/organisms/SprintTestRunsSummary'
import { matchingWorkItems } from '@/features/location-overview/lib/allocationGroups'
import { loadAzureConfig } from '@/features/location-overview/lib/azure/azureConfigStorage'
import { loadCargos } from '@/features/location-overview/lib/cargosStorage'
import { loadHiddenWorkItems } from '@/features/location-overview/lib/hiddenWorkItemsStorage'
import { loadLevels } from '@/features/location-overview/lib/levelsStorage'
import { loadPeople } from '@/features/location-overview/lib/peopleStorage'
import { loadPersonAllocations } from '@/features/location-overview/lib/personAllocationsStorage'
import { analyzeSquadSprint } from '@/features/location-overview/lib/sprintAnalysis'
import { formatSprintLabel, loadSprints } from '@/features/location-overview/lib/sprintsStorage'
import { loadSquads } from '@/features/location-overview/lib/squadsStorage'
import { findTestRuns, loadTestRuns } from '@/features/location-overview/lib/testRunsStorage'
import { loadWorkItems } from '@/features/location-overview/lib/workItemsStorage'
import { useStoredList } from '@/features/shared/useStoredList'
import { useTranslation } from '@/i18n'

export interface SprintAnalysisSelection {
  sprintId?: string
  squadId?: string
}

export interface SprintAnalysisProps extends SprintAnalysisSelection {
  /** Troca sprint/squad (a página grava na URL). */
  onSelect: (selection: SprintAnalysisSelection) => void
}

const loadAzureSettings = () => [loadAzureConfig()]
const loadHidden = () => loadHiddenWorkItems()

/**
 * Análise de uma squad numa sprint com os dados da base local: KPIs, burnup, pontos por tipo e
 * estado, pessoas × alocação e test runs.
 */
export function SprintAnalysis({ sprintId, squadId, onSelect }: SprintAnalysisProps) {
  const t = useTranslation('apps').analysis
  const sprints = useStoredList(loadSprints)
  const squads = useStoredList(loadSquads)
  const workItems = useStoredList(loadWorkItems)
  const people = useStoredList(loadPeople)
  const allocations = useStoredList(loadPersonAllocations)
  const levels = useStoredList(loadLevels)
  const cargos = useStoredList(loadCargos)
  const testRuns = useStoredList(loadTestRuns)
  const hidden = useStoredList(loadHidden)
  const settings = useStoredList(loadAzureSettings)

  const sprint = sprints.items.find((s) => s.id === sprintId)
  const squad = squads.items.find((s) => s.id === squadId)
  const config = settings.items[0]

  const analysis = useMemo(() => {
    if (!sprint || !squad || !config) return null
    const items = matchingWorkItems(workItems.items, squad, sprint)
    const metrics = analyzeSquadSprint(
      squad,
      sprint,
      {
        workItems: workItems.items,
        people: people.items,
        allocations: allocations.items,
        levels: levels.items,
        cargos: cargos.items,
      },
      {
        pointTypes: config.pointTypes,
        qaMinPercent: config.qaMinPercent,
        qaMaxPercent: config.qaMaxPercent,
        hiddenIds: new Set(hidden.items),
        testRuns: findTestRuns(testRuns.items, squad.id, sprint.id),
      },
    )
    return { metrics, itemsCount: items.length }
  }, [sprint, squad, config, workItems.items, people.items, allocations.items, levels.items, cargos.items, hidden.items, testRuns.items])

  const ready = sprints.ready && squads.ready

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid gap-4 sm:grid-cols-2'>
        <SelectField
          label={t.sprint}
          value={sprintId ?? ''}
          placeholder={t.selectSprint}
          options={sprints.items.map((s) => ({ value: s.id, label: formatSprintLabel(s) }))}
          onChange={(e) => onSelect({ sprintId: e.target.value || undefined, squadId })}
        />
        <SelectField
          label={t.squad}
          value={squadId ?? ''}
          placeholder={t.selectSquad}
          options={squads.items.map((s) => ({ value: s.id, label: s.name }))}
          onChange={(e) => onSelect({ sprintId, squadId: e.target.value || undefined })}
        />
      </div>

      {ready && !analysis && <p className='text-sm text-fg'>{t.choose}</p>}
      {analysis && analysis.itemsCount === 0 && (
        <p role='status' className='text-sm text-fg'>
          {t.noItems}
        </p>
      )}
      {analysis && (
        <>
          <SprintKpis metrics={analysis.metrics} workItemsCount={analysis.itemsCount} />
          <SprintCharts metrics={analysis.metrics} />
          <SprintPeopleTable rows={analysis.metrics.allocation} />
          <SprintTestRunsSummary summary={analysis.metrics.testRuns} />
        </>
      )}
    </div>
  )
}

export default SprintAnalysis
