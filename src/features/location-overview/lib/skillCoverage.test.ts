import type { PersonSkill, Skill } from '@/features/skills/lib/skillsStorage'
import type { PersonAllocation } from './personAllocationsStorage'
import { computeSquadCoverage, coverageStatus, summarizeCoverage } from './skillCoverage'

const skills: Skill[] = [
  { id: 'react', name: 'React', type: 'hard' },
  { id: 'nest', name: 'NestJS', type: 'hard' },
  { id: 'docker', name: 'Docker', type: 'hard' },
  { id: 'com', name: 'Comunicação', type: 'soft' },
]

const allocations: PersonAllocation[] = [
  { id: '1', personId: 'ana', squadId: 'sq', sprintId: 's1', percentage: 50 },
  { id: '2', personId: 'bia', squadId: 'sq', sprintId: 's1', percentage: 100 },
  { id: '3', personId: 'caio', squadId: 'outra', sprintId: 's1', percentage: 100 },
  { id: '4', personId: 'dani', squadId: 'sq', sprintId: 's2', percentage: 100 },
]

const personSkills: PersonSkill[] = [
  { personId: 'ana', skillId: 'react', level: 4 },
  { personId: 'bia', skillId: 'react', level: 2 },
  { personId: 'bia', skillId: 'nest', level: 2 },
  { personId: 'caio', skillId: 'docker', level: 5 },
  { personId: 'dani', skillId: 'com', level: 5 },
]

const squad = {
  id: 'sq',
  requiredSkills: [
    { skillId: 'react', minLevel: 3 },
    { skillId: 'nest', minLevel: 3 },
    { skillId: 'docker', minLevel: 2 },
    { skillId: 'com', minLevel: 3 },
    { skillId: 'removida', minLevel: 1 },
  ],
}

describe('coverageStatus', () => {
  it.each([
    [0, 3, 'gap'],
    [2, 3, 'partial'],
    [3, 3, 'covered'],
    [5, 3, 'covered'],
  ] as const)('melhor nível %i com mínimo %i → %s', (best, min, expected) => {
    expect(coverageStatus(best, min)).toBe(expected)
  })
})

describe('computeSquadCoverage', () => {
  const coverage = computeSquadCoverage(squad, 's1', allocations, personSkills, skills)
  const byId = Object.fromEntries(coverage.map((c) => [c.skill.id, c]))

  it('usa o maior nível entre os alocados na squad e sprint', () => {
    expect(byId.react).toMatchObject({ bestLevel: 4, status: 'covered' })
    expect(byId.react.holders).toEqual([
      { personId: 'ana', level: 4 },
      { personId: 'bia', level: 2 },
    ])
  })

  it('abaixo do mínimo é parcial', () => {
    expect(byId.nest).toMatchObject({ bestLevel: 2, status: 'partial' })
  })

  it('ignora quem está em outra squad ou em outra sprint', () => {
    expect(byId.docker.status).toBe('gap')
    expect(byId.com.status).toBe('gap')
  })

  it('ignora requisitos de skills removidas do catálogo', () => {
    expect(byId.removida).toBeUndefined()
    expect(coverage).toHaveLength(4)
  })

  it('alocação de 0% não conta', () => {
    const zero = allocations.map((a) => (a.personId === 'ana' ? { ...a, percentage: 0 } : a))
    const result = computeSquadCoverage(squad, 's1', zero, personSkills, skills)
    expect(result.find((c) => c.skill.id === 'react')?.status).toBe('partial')
  })

  it('squad sem requisitos retorna lista vazia', () => {
    expect(computeSquadCoverage({ id: 'sq' }, 's1', allocations, personSkills, skills)).toEqual([])
  })
})

describe('summarizeCoverage', () => {
  const coverage = computeSquadCoverage(squad, 's1', allocations, personSkills, skills)

  it('conta por status', () => {
    expect(summarizeCoverage(coverage)).toEqual({ total: 4, covered: 1, partial: 1, gap: 2 })
  })

  it('filtra por tipo de skill', () => {
    expect(summarizeCoverage(coverage, 'soft')).toEqual({ total: 1, covered: 0, partial: 0, gap: 1 })
  })
})
