import { DEFAULT_LEVELS } from './levelsStorage'
import type { Person } from './peopleStorage'
import type { PersonAllocation } from './personAllocationsStorage'
import type { Sprint } from './sprintsStorage'
import type { Squad } from './squadsStorage'
import type { WorkItemRow } from './workItems'
import {
  buildAllocationGroups,
  matchingWorkItems,
  personPoints,
  validateAllocation,
} from './allocationGroups'

const squads: Squad[] = [
  { id: 'web', name: 'Web' },
  { id: 'api', name: 'API', aliases: ['Backend'] },
]
const sprints: Sprint[] = [
  { id: 's8', number: 8, fiscalYear: 'FY25-26', startDate: '', endDate: '', totalValidDays: 10 },
  { id: 's9', number: 9, fiscalYear: 'FY25-26', startDate: '', endDate: '', totalValidDays: 10 },
]
const people: Person[] = [
  { id: 'ana', nome: 'Ana', email: 'ana@x.dev', cargo: '', nivel: 'SR', squadIds: [] },
  { id: 'bia', nome: 'Bia', email: '', cargo: '', nivel: 'JR', squadIds: [] },
]

const item = (overrides: Partial<WorkItemRow>): WorkItemRow => ({
  id: 1,
  workItemType: 'User Story',
  title: '',
  assignedTo: '',
  email: 'ana@x.dev',
  state: 'Closed',
  tags: '',
  iterationPath: 'Proj\\Backend\\Sprint 08 - FY25-26',
  sprint: 'Sprint 08',
  fiscalYear: 'FY25-26',
  storyPoints: 5,
  effort: 0,
  timeCriticality: 0,
  wsjf: 0,
  pontoExecucao: 1,
  runs: 0,
  isDelayed: false,
  ...overrides,
})

const workItems = [
  item({ id: 1 }),
  item({ id: 2, storyPoints: 3, email: 'outra@x.dev' }),
  item({ id: 3, sprint: 'Sprint 09' }),
  item({ id: 4, iterationPath: 'Proj\\Web\\Sprint 08' }),
]

const allocation = (o: Partial<PersonAllocation>): PersonAllocation => ({
  id: 'x',
  personId: 'ana',
  squadId: 'api',
  sprintId: 's8',
  percentage: 50,
  ...o,
})

describe('matchingWorkItems', () => {
  it('casa squad (inclusive por alias), sprint e fiscal year', () => {
    expect(matchingWorkItems(workItems, squads[1], sprints[0]).map((w) => w.id)).toEqual([1, 2])
  })

  it('filtra por e-mail sem diferenciar maiúsculas', () => {
    expect(
      matchingWorkItems(workItems, squads[1], sprints[0], ' ANA@x.dev ').map((w) => w.id),
    ).toEqual([1])
  })
})

describe('personPoints', () => {
  it('soma story points e pontos de execução da pessoa', () => {
    expect(personPoints(workItems, squads[1], sprints[0], people[0])).toEqual({
      storyPoints: 5,
      pontoExecucao: 1,
    })
  })

  it('pessoa sem e-mail não pontua', () => {
    expect(personPoints(workItems, squads[1], sprints[0], people[1])).toEqual({
      storyPoints: 0,
      pontoExecucao: 0,
    })
  })
})

describe('buildAllocationGroups', () => {
  const context = { squads, sprints, people, levels: DEFAULT_LEVELS, workItems }

  it('agrupa por squad+sprint e soma os pontos pelo nível', () => {
    const groups = buildAllocationGroups(
      [
        allocation({ id: '1', personId: 'ana', percentage: 50 }),
        allocation({ id: '2', personId: 'bia', percentage: 100 }),
      ],
      context,
    )
    expect(groups).toHaveLength(1)
    // Ana SR: 5 dias × 1.5/2 ; Bia JR: 10 dias × 0.5/1
    expect(groups[0]).toMatchObject({ capacityPoints: 12.5, maxPoints: 20, storyPoints: 8 })
  })

  it('ordena por squad e sprint e ignora squad/sprint removidas', () => {
    const groups = buildAllocationGroups(
      [
        allocation({ id: '1', squadId: 'web', sprintId: 's9' }),
        allocation({ id: '2', squadId: 'api', sprintId: 's9' }),
        allocation({ id: '3', squadId: 'api', sprintId: 's8' }),
        allocation({ id: '4', squadId: 'removida' }),
      ],
      context,
    )
    expect(groups.map((g) => g.key)).toEqual(['api::s8', 'api::s9', 'web::s9'])
  })
})

describe('validateAllocation', () => {
  const existing = [
    allocation({ id: 'a', squadId: 'web', percentage: 60 }),
    allocation({ id: 'b', squadId: 'api', percentage: 30 }),
  ]

  it('exige pessoa, squad e sprint', () => {
    expect(validateAllocation(allocation({ squadId: '' }), [])).toEqual({ code: 'missingFields' })
  })

  it.each([0, -5, 101, Number.NaN])('rejeita %s%%', (percentage) => {
    expect(validateAllocation(allocation({ percentage }), [])).toEqual({
      code: 'invalidPercentage',
    })
  })

  it('não deixa a soma da pessoa na sprint passar de 100%', () => {
    expect(validateAllocation(allocation({ id: 'novo', percentage: 20 }), existing)).toEqual({
      code: 'overAllocated',
      otherPercentage: 90,
    })
    expect(validateAllocation(allocation({ id: 'novo', percentage: 10 }), existing)).toBeNull()
  })

  it('ao editar, desconta a própria alocação', () => {
    expect(validateAllocation(allocation({ id: 'b', percentage: 40 }), existing)).toBeNull()
  })
})
