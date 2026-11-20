import { BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Breadcrumb, type BreadcrumbItem } from '@/components/molecules/Breadcrumb'
import { AllocationFormModal } from '@/components/organisms/AllocationFormModal'
import { AllocationGroupDetail } from '@/components/organisms/AllocationGroupDetail'
import {
  NewSprintAllocationModal,
  percentageIssueMessage,
} from '@/components/organisms/NewSprintAllocationModal'
import { SkillCoveragePanel } from '@/components/organisms/SkillCoveragePanel'
import { SprintFormModal, EMPTY_SPRINT } from '@/components/organisms/SprintFormModal'
import { SprintSquadsPlan } from '@/components/organisms/SprintSquadsPlan'
import { SprintSupports } from '@/components/organisms/SprintSupports'
import {
  SprintTimeline,
  type SprintPhaseFilter,
  type SprintTimelineRow,
} from '@/components/organisms/SprintTimeline'
import { LOCATION_OVERVIEW_NAME } from '@/features/location-overview/constants'
import { loadCargos } from '@/features/location-overview/lib/cargosStorage'
import { loadLevels } from '@/features/location-overview/lib/levelsStorage'
import { addPeopleToSquad, loadPeople } from '@/features/location-overview/lib/peopleStorage'
import {
  addPersonAllocations,
  deletePersonAllocations,
  loadPersonAllocations,
  moveAllocationsToSquad,
  restorePersonAllocations,
  setAllocationsPercentage,
  upsertPersonAllocation,
  type PersonAllocation,
} from '@/features/location-overview/lib/personAllocationsStorage'
import {
  addPersonSupport,
  copySupportsFromSprint,
  deletePersonSupports,
  loadPersonSupports,
  restorePersonSupports,
  setSupportPercentage,
  validateSupportDraft,
  type SupportDraft,
} from '@/features/location-overview/lib/personSupportsStorage'
import { computeSquadCoverage, summarizeCoverage } from '@/features/location-overview/lib/skillCoverage'
import {
  sprintPlanSummary,
  sprintSquadPlans,
  squadSprintPlan,
} from '@/features/location-overview/lib/sprintPlanning'
import {
  deleteSprint,
  formatSprintLabel,
  loadSprints,
  sprintPhase,
  upsertSprint,
  type Sprint,
} from '@/features/location-overview/lib/sprintsStorage'
import { loadSquads } from '@/features/location-overview/lib/squadsStorage'
import { loadWorkItems } from '@/features/location-overview/lib/workItemsStorage'
import {
  analysisHref,
  locationOverviewRoutes,
  sprintsHref,
  type SprintsSelection,
} from '@/features/location-overview/navigation'
import { useStoredList } from '@/features/shared/useStoredList'
import { loadPersonSkills, loadSkills } from '@/features/skills/lib/skillsStorage'
import { format, useTranslation } from '@/i18n'

export interface SprintsExplorerProps {
  /** Sprint aberta (nível 2); sem ela mostra a linha do tempo. */
  sprintId?: string
  /** Squad aberta dentro da sprint (nível 3). */
  squadId?: string
  /** Troca o nível (a página grava na URL; stories/testes guardam em estado). */
  onNavigate: (selection: SprintsSelection) => void
  /** Confirmação antes de excluir uma sprint. Padrão: `window.confirm`. */
  confirm?: (message: string) => boolean
  /** "Hoje" para calcular a fase das sprints (fixo nas stories). */
  today?: Date
}

/**
 * Fluxo do Location Overview: linha do tempo das sprints → squads da sprint (com os apoios) →
 * alocação de uma squad na sprint, com trilha de navegação em cada nível.
 */
export function SprintsExplorer({
  sprintId,
  squadId,
  onNavigate,
  confirm = (m) => window.confirm(m),
  today,
}: SprintsExplorerProps) {
  const t = useTranslation('apps')
  const { items: sprints, setItems: setSprints, ready } = useStoredList(loadSprints)
  const { items: squads } = useStoredList(loadSquads)
  const { items: people, setItems: setPeople } = useStoredList(loadPeople)
  const { items: levels } = useStoredList(loadLevels)
  const { items: cargos } = useStoredList(loadCargos)
  const { items: workItems } = useStoredList(loadWorkItems)
  const { items: allocations, setItems: setAllocations } = useStoredList(loadPersonAllocations)
  const { items: supports, setItems: setSupports } = useStoredList(loadPersonSupports)
  const { items: skills } = useStoredList(loadSkills)
  const { items: personSkills } = useStoredList(loadPersonSkills)

  const [phaseFilter, setPhaseFilter] = useState<SprintPhaseFilter>('active')
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null)
  const [defaultFor, setDefaultFor] = useState<string | null>(null)
  const [editingAllocation, setEditingAllocation] = useState<PersonAllocation | null>(null)

  const base = useMemo(
    () => ({ allocations, people, levels, workItems }),
    [allocations, people, levels, workItems],
  )
  const ordered = useMemo(
    () =>
      [...sprints].sort(
        (a, b) => a.startDate.localeCompare(b.startDate) || a.number - b.number,
      ),
    [sprints],
  )
  const sprint = ordered.find((s) => s.id === sprintId)
  const squad = sprint ? squads.find((s) => s.id === squadId) : undefined
  const supportContext = { allocations, people, cargos }

  const go = (selection: SprintsSelection) => onNavigate(selection)

  // ---- ações -------------------------------------------------------------------------------

  const addEntries = (entries: Omit<PersonAllocation, 'id'>[]): string | null => {
    const result = addPersonAllocations(entries)
    if (result.duplicates.length) return t.group.duplicate
    setAllocations(result.allocations)
    return null
  }

  const setPercentage = (ids: string[], percentage: number): string | null => {
    const result = setAllocationsPercentage(ids, percentage)
    const issue = [...result.errors.values()][0]
    if (issue) return percentageIssueMessage(issue, t.allocations)
    setAllocations(result.allocations)
    return null
  }

  const move = (ids: string[], targetSquadId: string): string | null => {
    const result = moveAllocationsToSquad(ids, targetSquadId)
    if (result.conflicts.length) {
      const names = result.conflicts.map(
        (c) => people.find((p) => p.id === c.personId)?.nome ?? '—',
      )
      return format(t.allocations.moveConflicts, { names: names.join(', ') })
    }
    const moved = allocations.filter((a) => ids.includes(a.id)).map((a) => a.personId)
    setPeople(addPeopleToSquad(targetSquadId, moved))
    setAllocations(result.allocations)
    if (sprint) go({ sprintId: sprint.id, squadId: targetSquadId })
    return null
  }

  const addSupport = (draft: SupportDraft) => {
    const error = validateSupportDraft(draft, supports, supportContext)
    if (error) return error
    setSupports(addPersonSupport(draft))
    return null
  }

  // ---- trilha ------------------------------------------------------------------------------

  const crumbs: BreadcrumbItem[] = [
    { label: t.breadcrumb.projects, href: '/projects' },
    { label: LOCATION_OVERVIEW_NAME, href: locationOverviewRoutes.home },
    { label: t.sprints.title, href: sprintsHref({}) },
    ...(sprint
      ? [{ label: formatSprintLabel(sprint), href: sprintsHref({ sprintId: sprint.id }) }]
      : []),
    ...(sprint && squad ? [{ label: squad.name }] : []),
  ]
  const trail = <Breadcrumb aria-label={t.breadcrumb.label} items={crumbs} />

  // ---- nível 3: squad na sprint ------------------------------------------------------------

  if (sprint && squad) {
    const plan = squadSprintPlan(squad, sprint, base)
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          {trail}
          <Link
            href={analysisHref({ sprintId: sprint.id, squadId: squad.id })}
            className='inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline'
          >
            <BarChart3 size={14} aria-hidden /> {t.analysis.openAnalysis}
          </Link>
        </div>
        <AllocationGroupDetail
          squad={squad}
          sprint={sprint}
          entries={plan.entries}
          allocations={allocations}
          people={people}
          squads={squads}
          levels={levels}
          workItems={workItems}
          summary={{
            capacityPoints: plan.capacity,
            maxPoints: plan.max,
            storyPoints: plan.plannedPoints,
          }}
          onAdd={addEntries}
          onRemove={(ids) => {
            const result = deletePersonAllocations(ids)
            setAllocations(result.allocations)
            return result.removed
          }}
          onRestore={(entries) => setAllocations(restorePersonAllocations(entries))}
          onSetPercentage={setPercentage}
          onMove={move}
          onEdit={setEditingAllocation}
          onCreatePerson={() => go({ createPerson: true })}
          support={{ supports, context: supportContext, onAdd: addSupport }}
        >
          <SkillCoveragePanel
            squad={squad}
            sprintId={sprint.id}
            allocations={allocations}
            people={people}
            skills={skills}
            personSkills={personSkills}
          />
        </AllocationGroupDetail>
        <AllocationFormModal
          allocation={editingAllocation}
          onClose={() => setEditingAllocation(null)}
          onSave={(allocation) => {
            setAllocations(upsertPersonAllocation(allocation))
            setEditingAllocation(null)
          }}
          allocations={allocations}
          people={people}
          squads={squads}
          sprints={sprints}
        />
      </div>
    )
  }

  // ---- nível 2: squads da sprint -----------------------------------------------------------

  if (sprint) {
    const plans = sprintSquadPlans(sprint, squads, base)
    const coverage = new Map(
      squads.map((s) => [
        s.id,
        summarizeCoverage(computeSquadCoverage(s, sprint.id, allocations, personSkills, skills)),
      ]),
    )
    const index = ordered.findIndex((s) => s.id === sprint.id)
    const previousSprint = index > 0 ? ordered[index - 1] : undefined

    return (
      <div className='flex flex-col gap-4'>
        {trail}
        <SprintSquadsPlan
          sprint={sprint}
          phase={sprintPhase(sprint, today)}
          plans={plans}
          summary={sprintPlanSummary(plans)}
          coverage={coverage}
          onOpenSquad={(s) => go({ sprintId: sprint.id, squadId: s.id })}
          onCreateDefault={(s) => setDefaultFor(s.id)}
          onCreateSquad={() => go({ createSquad: true })}
        >
          <SprintSupports
            sprint={sprint}
            previousSprint={previousSprint}
            supports={supports.filter((s) => s.sprintId === sprint.id)}
            context={supportContext}
            onAdd={addSupport}
            onRemove={(ids) => {
              const result = deletePersonSupports(ids)
              setSupports(result.supports)
              return result.removed
            }}
            onRestore={(entries) => setSupports(restorePersonSupports(entries))}
            onSetPercentage={(id, percentage) => {
              if (!(percentage > 0 && percentage <= 100)) return { code: 'invalidPercentage' }
              setSupports(setSupportPercentage(id, percentage))
              return null
            }}
            onCopyPrevious={() => {
              if (!previousSprint) return 0
              const result = copySupportsFromSprint(previousSprint.id, sprint.id)
              setSupports(result.supports)
              return result.copied
            }}
          />
        </SprintSquadsPlan>
        {defaultFor && (
          <NewSprintAllocationModal
            key={defaultFor}
            open
            onClose={() => setDefaultFor(null)}
            people={people}
            squads={squads}
            sprints={ordered}
            allocations={allocations}
            initialSquadId={defaultFor}
            initialSprintId={sprint.id}
            onSave={(entries) => {
              const message = addEntries(entries)
              if (message) return message
              setDefaultFor(null)
              go({ sprintId: entries[0].sprintId, squadId: entries[0].squadId })
              return null
            }}
            onOpenGroup={(sqId, spId) => {
              setDefaultFor(null)
              go({ sprintId: spId, squadId: sqId })
            }}
          />
        )}
      </div>
    )
  }

  // ---- nível 1: linha do tempo -------------------------------------------------------------

  const rows: SprintTimelineRow[] = ordered.map((s) => ({
    sprint: s,
    phase: sprintPhase(s, today),
    plan: sprintPlanSummary(sprintSquadPlans(s, squads, base)),
  }))

  return (
    <div className='flex flex-col gap-4'>
      {trail}
      <SprintTimeline
        rows={rows}
        loading={!ready}
        phaseFilter={phaseFilter}
        onPhaseFilterChange={setPhaseFilter}
        onOpen={(s) => go({ sprintId: s.id })}
        onCreate={() => setEditingSprint(EMPTY_SPRINT)}
        onEdit={setEditingSprint}
        onDelete={(s) => {
          if (confirm(t.timeline.deleteConfirm)) setSprints(deleteSprint(s.id))
        }}
      />
      <SprintFormModal
        sprint={editingSprint}
        onClose={() => setEditingSprint(null)}
        onSave={(saved) => {
          setSprints(upsertSprint(saved))
          setEditingSprint(null)
        }}
      />
    </div>
  )
}

export default SprintsExplorer
