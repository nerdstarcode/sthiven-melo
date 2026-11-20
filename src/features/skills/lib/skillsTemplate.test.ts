import { loadPeople } from '@/features/location-overview/lib/peopleStorage'
import { createProfile, summarizeProfile } from './skillsTemplate'
import { loadPersonSkills, savePersonSkills, type PersonSkillDetail } from './skillsStorage'

describe('createProfile', () => {
  it('exige um nome', () => {
    expect(createProfile('   ')).toEqual({ error: 'required' })
    expect(loadPeople()).toEqual([])
  })

  it('cria a pessoa sem skills', () => {
    const result = createProfile(' Maria ')
    if (!('person' in result)) throw new Error('esperava a pessoa')
    expect(result.person.nome).toBe('Maria')
    expect(loadPeople()).toEqual([result.person])
    expect(loadPersonSkills()).toEqual([])
  })

  it('copia as skills e os níveis do template sem mexer no original', () => {
    savePersonSkills([
      { personId: 'owner', skillId: 'sk-react', level: 4 },
      { personId: 'owner', skillId: 'sk-comm', level: 5 },
      { personId: 'other', skillId: 'sk-react', level: 1 },
    ])
    const result = createProfile('Maria', 'owner')
    if (!('person' in result)) throw new Error('esperava a pessoa')
    const all = loadPersonSkills()
    expect(all.filter((ps) => ps.personId === result.person.id)).toEqual([
      { personId: result.person.id, skillId: 'sk-react', level: 4 },
      { personId: result.person.id, skillId: 'sk-comm', level: 5 },
    ])
    expect(all.filter((ps) => ps.personId === 'owner')).toHaveLength(2)
  })
})

describe('summarizeProfile', () => {
  const detail = (type: 'hard' | 'soft', level: number): PersonSkillDetail => ({
    personId: 'p',
    skillId: `${type}-${level}`,
    level,
    skill: { id: `${type}-${level}`, name: `${type} ${level}`, type },
  })

  it('conta e tira a média por tipo', () => {
    expect(summarizeProfile([detail('hard', 4), detail('hard', 3), detail('soft', 5)])).toEqual([
      { type: 'hard', count: 2, average: 3.5 },
      { type: 'soft', count: 1, average: 5 },
    ])
  })

  it('sem skills a média é zero', () => {
    expect(summarizeProfile([])).toEqual([
      { type: 'hard', count: 0, average: 0 },
      { type: 'soft', count: 0, average: 0 },
    ])
  })
})
