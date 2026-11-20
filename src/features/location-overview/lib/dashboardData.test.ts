import { DEFAULT_AZURE_CONFIG } from './azure/azureConfigStorage'
import { dashboardPeople, dashboardSupport, type DashboardBase } from './dashboardData'
import { DEFAULT_LEVELS } from './levelsStorage'
import { DEMO_TODAY } from '@/features/seed/demoPlanning'
import {
  demoAllocations,
  demoCargos,
  demoPeople,
  demoSprints,
  demoSquads,
  demoSupports,
  demoWorkItems,
} from '@/features/seed/demoSeed'

const base: DashboardBase = {
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
const filters = { pointTypes: DEFAULT_AZURE_CONFIG.pointTypes, today: DEMO_TODAY }

describe('dashboardPeople', () => {
  it('traz as pessoas com entrega ou alocação, em ordem alfabética', () => {
    const rows = dashboardPeople(base, filters)
    const names = rows.map((r) => r.person.nome)
    expect(names).toContain('Ana (exemplo)')
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('soma os SP fechados da Ana', () => {
    const ana = dashboardPeople(base, filters).find((r) => r.person.id === 'demo-ana')!
    expect(ana.dev.delivered).toBeGreaterThan(0)
    expect(ana.dev.sprints.length).toBeGreaterThan(0)
  })

  it('o filtro de squad deixa só as entregas da squad', () => {
    const rows = dashboardPeople(base, { ...filters, selectedSquads: ['Dados'] })
    const ana = rows.find((r) => r.person.id === 'demo-ana')
    expect(ana?.dev.delivered ?? 0).toBe(0)
  })
})

describe('dashboardSupport', () => {
  it('a Ana apoia o Bruno', () => {
    const ana = dashboardPeople(base, filters).find((r) => r.person.id === 'demo-ana')!
    const support = dashboardSupport(ana, base, filters)
    expect(support?.card?.given.map((g) => g.nome)).toEqual(['Bruno (exemplo)'])
  })

  it('o Bruno é apoiado pela Ana', () => {
    const bruno = dashboardPeople(base, filters).find((r) => r.person.id === 'demo-bruno')!
    const support = dashboardSupport(bruno, base, filters)
    expect(support?.receivedFrom.map((r) => r.nome)).toContain('Ana (exemplo)')
  })

  it('sem apoio devolve null', () => {
    const carla = dashboardPeople(base, filters).find((r) => r.person.id === 'demo-carla')!
    expect(dashboardSupport(carla, base, filters)).toBeNull()
  })
})
