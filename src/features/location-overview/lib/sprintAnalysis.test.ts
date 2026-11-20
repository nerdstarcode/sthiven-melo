import { DEFAULT_LEVELS } from './levelsStorage'
import { analyzeSquadSprint, type SprintAnalysisBase } from './sprintAnalysis'
import {
  demoAllocations,
  demoCargos,
  demoPeople,
  demoSprints,
  demoSquads,
  demoTestRuns,
  demoWorkItems,
} from '@/features/seed/demoSeed'

const base: SprintAnalysisBase = {
  workItems: demoWorkItems,
  people: demoPeople,
  allocations: demoAllocations,
  levels: DEFAULT_LEVELS,
  cargos: demoCargos,
}
const web = demoSquads[0]
const sprint = (id: string) => demoSprints.find((s) => s.id === id)!

describe('analyzeSquadSprint', () => {
  it('soma só os work items da squad e da sprint', () => {
    const metrics = analyzeSquadSprint(web, sprint('sp-10'), base)
    expect(metrics.totalPoints).toBe(8 + 5 + 5 + 3)
  })

  it('na sprint fechada tudo está entregue e o burnup chega ao total', () => {
    const metrics = analyzeSquadSprint(web, sprint('sp-10'), base)
    expect(metrics.deliveredPoints).toBe(metrics.totalPoints)
    expect(metrics.burnup.at(-1)?.cumulative).toBe(metrics.totalPoints)
    expect(metrics.burnup).toHaveLength(10)
  })

  it('separa por tipo e por estado', () => {
    const metrics = analyzeSquadSprint(web, sprint('sp-11'), base)
    expect(metrics.byType.map((g) => g.key).sort()).toEqual(['Bug', 'User Story'])
    expect(metrics.byState.map((g) => g.key)).toContain('Closed')
    expect(metrics.deliveredPoints).toBeLessThan(metrics.totalPoints)
  })

  it('usa a alocação cadastrada da squad para Capacity e Max', () => {
    const metrics = analyzeSquadSprint(web, sprint('sp-11'), base)
    expect(metrics.sprintAllocation.entries.length).toBeGreaterThan(0)
    expect(metrics.sprintAllocation.max).toBeGreaterThan(0)
  })

  it('repassa o resumo de test runs gravado', () => {
    const summary = demoTestRuns[0].summary
    const metrics = analyzeSquadSprint(web, sprint('sp-10'), base, { testRuns: summary })
    expect(metrics.testRuns).toBe(summary)
    expect(analyzeSquadSprint(web, sprint('sp-10'), base).testRuns).toBeNull()
  })
})
