import {
  clampProficiency,
  deleteSkill,
  loadPersonSkills,
  loadSkills,
  removeSkillsOfPerson,
  setPersonSkill,
  skillsOfPerson,
  upsertSkill,
  type Skill,
} from './skillsStorage'

describe('skillsStorage', () => {
  it('cria skill com id e mantém o catálogo ordenado por nome', () => {
    upsertSkill({ id: '', name: 'TypeScript', type: 'hard' })
    upsertSkill({ id: '', name: 'Comunicação', type: 'soft' })
    const skills = loadSkills()
    expect(skills.map((s) => s.name)).toEqual(['Comunicação', 'TypeScript'])
    expect(skills.every((s) => s.id)).toBe(true)
  })

  it('atualiza uma skill existente pelo id', () => {
    upsertSkill({ id: 's1', name: 'React', type: 'hard' })
    upsertSkill({ id: 's1', name: 'React', type: 'hard', category: 'Frontend' })
    expect(loadSkills()).toEqual([{ id: 's1', name: 'React', type: 'hard', category: 'Frontend' }])
  })

  it('limita a proficiência entre 1 e 5', () => {
    expect(clampProficiency(0)).toBe(1)
    expect(clampProficiency(9)).toBe(5)
    expect(clampProficiency(3.4)).toBe(3)
  })

  it('setPersonSkill substitui o nível anterior da mesma skill', () => {
    setPersonSkill('p1', 's1', 2)
    setPersonSkill('p1', 's1', 4)
    expect(loadPersonSkills()).toEqual([{ personId: 'p1', skillId: 's1', level: 4 }])
  })

  it('excluir uma skill remove as proficiências ligadas a ela', () => {
    upsertSkill({ id: 's1', name: 'React', type: 'hard' })
    setPersonSkill('p1', 's1', 3)
    setPersonSkill('p1', 's2', 3)
    deleteSkill('s1')
    expect(loadPersonSkills()).toEqual([{ personId: 'p1', skillId: 's2', level: 3 }])
  })

  it('removeSkillsOfPerson apaga só as da pessoa', () => {
    setPersonSkill('p1', 's1', 3)
    setPersonSkill('p2', 's1', 5)
    removeSkillsOfPerson('p1')
    expect(loadPersonSkills()).toEqual([{ personId: 'p2', skillId: 's1', level: 5 }])
  })

  it('skillsOfPerson junta o catálogo, ordena por nível e ignora skills removidas', () => {
    const skills: Skill[] = [
      { id: 'a', name: 'Angular', type: 'hard' },
      { id: 'b', name: 'Empatia', type: 'soft' },
    ]
    const result = skillsOfPerson(
      'p1',
      [
        { personId: 'p1', skillId: 'a', level: 2 },
        { personId: 'p1', skillId: 'b', level: 5 },
        { personId: 'p1', skillId: 'removida', level: 5 },
        { personId: 'p2', skillId: 'a', level: 5 },
      ],
      skills,
    )
    expect(result.map((r) => [r.skill.name, r.level])).toEqual([
      ['Empatia', 5],
      ['Angular', 2],
    ])
  })
})
