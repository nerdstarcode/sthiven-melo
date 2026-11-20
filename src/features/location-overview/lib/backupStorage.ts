import {
  loadPersonSupports,
  savePersonSupports,
  type PersonSupport,
} from './personSupportsStorage'
import { loadWorkItems, saveWorkItems } from './workItemsStorage'
import type { WorkItemRow } from './workItems'
import { loadLevels, saveLevels } from './levelsStorage'
import type { LevelConfig } from './levelsStorage'
import { loadPeople, savePeople } from './peopleStorage'
import type { Person } from './peopleStorage'
import { loadSquads, saveSquads } from './squadsStorage'
import type { Squad } from './squadsStorage'
import { loadSprints, saveSprints } from './sprintsStorage'
import type { Sprint } from './sprintsStorage'
import { loadPersonAllocations, savePersonAllocations } from './personAllocationsStorage'
import type { PersonAllocation } from './personAllocationsStorage'
import { loadHiddenWorkItems, saveHiddenWorkItems } from './hiddenWorkItemsStorage'
import {
  loadTestExecutions,
  saveTestExecutions,
  type TestExecution,
} from './testExecutionsStorage'
import { loadTestRuns, saveTestRuns, type StoredTestRuns } from './testRunsStorage'
import {
  loadPersonSkills,
  loadSkills,
  savePersonSkills,
  saveSkills,
  type PersonSkill,
  type Skill,
} from '@/features/skills/lib/skillsStorage'

export interface AppBackup {
  exportedAt: string
  workItems: WorkItemRow[]
  levels: LevelConfig[]
  people: Person[]
  squads: Squad[]
  sprints: Sprint[]
  personAllocations: PersonAllocation[]
  /** Opcional: backups anteriores à funcionalidade de ocultar work items não têm. */
  hiddenWorkItems?: number[]
  /** Opcionais: backups anteriores às skills não têm. */
  skills?: Skill[]
  personSkills?: PersonSkill[]
  /** Opcional: backups anteriores aos apoios não têm. */
  personSupports?: PersonSupport[]
  /** Opcional: backups anteriores aos test runs não têm. */
  testRuns?: StoredTestRuns[]
  /** Opcional: testes executados por pessoa, vindos da sincronização. */
  testExecutions?: TestExecution[]
}

/** Reúne todos os dados persistidos em localStorage (todas as telas) num único objeto exportável. */
export function exportAllData(): AppBackup {
  return {
    exportedAt: new Date().toISOString(),
    workItems: loadWorkItems(),
    levels: loadLevels(),
    people: loadPeople(),
    squads: loadSquads(),
    sprints: loadSprints(),
    personAllocations: loadPersonAllocations(),
    hiddenWorkItems: loadHiddenWorkItems(),
    skills: loadSkills(),
    personSkills: loadPersonSkills(),
    personSupports: loadPersonSupports(),
    testRuns: loadTestRuns(),
    testExecutions: loadTestExecutions(),
  }
}

/**
 * Substitui os dados de cada tela pelos do backup — só grava as chaves presentes
 * no arquivo (arrays), ignorando o resto, para tolerar backups parciais/antigos.
 */
export function importAllData(data: unknown): void {
  if (!data || typeof data !== 'object')
    throw new Error('Arquivo inválido: esperado um objeto JSON.')
  const backup = data as Partial<AppBackup>

  if (Array.isArray(backup.workItems)) saveWorkItems(backup.workItems)
  if (Array.isArray(backup.levels)) saveLevels(backup.levels)
  if (Array.isArray(backup.people)) savePeople(backup.people)
  if (Array.isArray(backup.squads)) saveSquads(backup.squads)
  if (Array.isArray(backup.sprints)) saveSprints(backup.sprints)
  if (Array.isArray(backup.personAllocations)) savePersonAllocations(backup.personAllocations)
  if (Array.isArray(backup.hiddenWorkItems)) saveHiddenWorkItems(backup.hiddenWorkItems)
  if (Array.isArray(backup.skills)) saveSkills(backup.skills)
  if (Array.isArray(backup.personSkills)) savePersonSkills(backup.personSkills)
  if (Array.isArray(backup.personSupports)) savePersonSupports(backup.personSupports)
  if (Array.isArray(backup.testRuns)) saveTestRuns(backup.testRuns)
  if (Array.isArray(backup.testExecutions)) saveTestExecutions(backup.testExecutions)
}
