import { loadPeople, savePeople } from '@/features/location-overview/lib/peopleStorage'
import {
  loadPersonAllocations,
  sumPercentageForPersonInSprint,
} from '@/features/location-overview/lib/personAllocationsStorage'
import { loadSquads } from '@/features/location-overview/lib/squadsStorage'
import { loadSkills } from '@/features/skills/lib/skillsStorage'
import {
  demoAllocations,
  demoPeople,
  demoPersonSkills,
  demoSkills,
  demoSprints,
  demoSquads,
  OWNER_PERSON_ID,
  resetDemoData,
  seedDemoDataIfNeeded,
} from './demoSeed'

describe('demoSeed', () => {
  it('grava a demonstração só na primeira vez', () => {
    expect(seedDemoDataIfNeeded()).toBe(true)
    expect(loadPeople()).toHaveLength(demoPeople.length)
    savePeople([])
    expect(seedDemoDataIfNeeded()).toBe(false)
    expect(loadPeople()).toEqual([])
  })

  it('reset volta para a demonstração e preserva a config do Azure', () => {
    window.localStorage.setItem('location-overview:azure-config', '{"pat":"x"}')
    window.localStorage.setItem('location-overview:people', '[]')
    window.localStorage.setItem('outro-app:dado', '1')
    resetDemoData()
    expect(loadPeople()).toHaveLength(demoPeople.length)
    expect(loadSkills()).toHaveLength(demoSkills.length)
    expect(loadSquads()).toHaveLength(demoSquads.length)
    expect(window.localStorage.getItem('location-overview:azure-config')).toBe('{"pat":"x"}')
    expect(window.localStorage.getItem('outro-app:dado')).toBe('1')
  })

  it('só o Sthiven é pessoa real; as demais são marcadas como exemplo', () => {
    for (const person of demoPeople.filter((p) => p.id !== OWNER_PERSON_ID)) {
      expect(person.nome).toMatch(/\(exemplo\)$/)
    }
  })

  it('ninguém passa de 100% numa sprint', () => {
    resetDemoData()
    const allocations = loadPersonAllocations()
    for (const person of demoPeople) {
      for (const sprint of demoSprints) {
        expect(
          sumPercentageForPersonInSprint(allocations, person.id, sprint.id),
        ).toBeLessThanOrEqual(100)
      }
    }
  })

  it('referências são consistentes (pessoas, squads, sprints e skills existem)', () => {
    const ids = {
      people: new Set(demoPeople.map((p) => p.id)),
      squads: new Set(demoSquads.map((s) => s.id)),
      sprints: new Set(demoSprints.map((s) => s.id)),
      skills: new Set(demoSkills.map((s) => s.id)),
    }
    for (const a of demoAllocations) {
      expect(ids.people.has(a.personId)).toBe(true)
      expect(ids.squads.has(a.squadId)).toBe(true)
      expect(ids.sprints.has(a.sprintId)).toBe(true)
    }
    for (const ps of demoPersonSkills) {
      expect(ids.people.has(ps.personId)).toBe(true)
      expect(ids.skills.has(ps.skillId)).toBe(true)
    }
    for (const squad of demoSquads) {
      for (const req of squad.requiredSkills ?? []) expect(ids.skills.has(req.skillId)).toBe(true)
    }
  })

  it('squadIds das pessoas refletem as alocações', () => {
    const sthiven = demoPeople.find((p) => p.id === OWNER_PERSON_ID)!
    expect(sthiven.squadIds.sort()).toEqual(['sq-platform', 'sq-web'])
  })
})
