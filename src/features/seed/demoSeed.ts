import { saveCargos, type CargoConfig } from '@/features/location-overview/lib/cargosStorage'
import { DEFAULT_LEVELS, saveLevels } from '@/features/location-overview/lib/levelsStorage'
import { readJson, writeJson } from '@/features/location-overview/lib/localStore'
import { savePeople, type Person } from '@/features/location-overview/lib/peopleStorage'
import {
  savePersonAllocations,
  type PersonAllocation,
} from '@/features/location-overview/lib/personAllocationsStorage'
import {
  savePersonSupports,
  type PersonSupport,
} from '@/features/location-overview/lib/personSupportsStorage'
import { saveSprints, type Sprint } from '@/features/location-overview/lib/sprintsStorage'
import type { WorkItemRow } from '@/features/location-overview/lib/workItems'
import { saveWorkItems } from '@/features/location-overview/lib/workItemsStorage'
import { saveSquads, type Squad } from '@/features/location-overview/lib/squadsStorage'
import {
  savePersonSkills,
  saveSkills,
  type PersonSkill,
  type Skill,
} from '@/features/skills/lib/skillsStorage'

/**
 * Dados de demonstração dos apps de /projects. Ficam no localStorage de cada visitante.
 * Só o Sthiven é pessoa real; as demais são fictícias e marcadas como "(exemplo)".
 */

export const OWNER_PERSON_ID = 'demo-sthiven'

const SEED_FLAG_KEY = 'portfolio:demo-seeded'
const SEED_VERSION = 1

/** Prefixos das chaves dos apps; a config do Azure (com o PAT) nunca é apagada pelo reset. */
const APP_KEY_PREFIXES = ['location-overview:', 'skills:']
const PRESERVED_KEYS = new Set(['location-overview:azure-config'])

export const demoSkills: Skill[] = [
  { id: 'sk-react', name: 'React', type: 'hard', category: 'Frontend' },
  { id: 'sk-next', name: 'Next.js', type: 'hard', category: 'Frontend' },
  { id: 'sk-angular', name: 'Angular', type: 'hard', category: 'Frontend' },
  { id: 'sk-ts', name: 'TypeScript', type: 'hard', category: 'Linguagens' },
  { id: 'sk-nest', name: 'NestJS', type: 'hard', category: 'Backend' },
  { id: 'sk-postgres', name: 'PostgreSQL', type: 'hard', category: 'Dados' },
  { id: 'sk-docker', name: 'Docker', type: 'hard', category: 'DevOps' },
  { id: 'sk-k8s', name: 'Kubernetes', type: 'hard', category: 'DevOps' },
  { id: 'sk-azure', name: 'Azure', type: 'hard', category: 'Cloud' },
  { id: 'sk-figma', name: 'Figma', type: 'hard', category: 'Design' },
  { id: 'sk-tests', name: 'Testes automatizados', type: 'hard', category: 'Qualidade' },
  { id: 'sk-comm', name: 'Comunicação', type: 'soft' },
  { id: 'sk-team', name: 'Trabalho em equipe', type: 'soft' },
  { id: 'sk-mentor', name: 'Mentoria', type: 'soft' },
  { id: 'sk-problem', name: 'Resolução de problemas', type: 'soft' },
  { id: 'sk-org', name: 'Organização', type: 'soft' },
]

export const demoCargos: CargoConfig[] = [
  { id: 'cg-dev-jr', cargo: 'Associate Software Developer', tipo: 'Dev', nivel: 'JR' },
  { id: 'cg-dev-pl', cargo: 'Software Developer', tipo: 'Dev', nivel: 'PL' },
  { id: 'cg-dev-sr', cargo: 'Sr Software Developer', tipo: 'Dev', nivel: 'SR' },
  { id: 'cg-qa-pl', cargo: 'Software Tester Quality', tipo: 'QA', nivel: 'PL' },
  { id: 'cg-data-jr', cargo: 'Data Analyst', tipo: 'Dados', nivel: 'JR' },
]

export const demoSquads: Squad[] = [
  {
    id: 'sq-web',
    name: 'Frontend Web',
    requiredSkills: [
      { skillId: 'sk-react', minLevel: 4 },
      { skillId: 'sk-ts', minLevel: 3 },
      { skillId: 'sk-figma', minLevel: 2 },
      { skillId: 'sk-tests', minLevel: 3 },
      { skillId: 'sk-comm', minLevel: 3 },
    ],
  },
  {
    id: 'sq-platform',
    name: 'Plataforma',
    requiredSkills: [
      { skillId: 'sk-nest', minLevel: 4 },
      { skillId: 'sk-postgres', minLevel: 3 },
      { skillId: 'sk-k8s', minLevel: 3 },
      { skillId: 'sk-azure', minLevel: 3 },
      { skillId: 'sk-mentor', minLevel: 3 },
    ],
  },
  {
    id: 'sq-data',
    name: 'Dados',
    requiredSkills: [
      { skillId: 'sk-postgres', minLevel: 4 },
      { skillId: 'sk-problem', minLevel: 3 },
      { skillId: 'sk-org', minLevel: 3 },
    ],
  },
]

const squadIdsOf = (personId: string) =>
  demoAllocations.filter((a) => a.personId === personId).map((a) => a.squadId)

export const demoSprints: Sprint[] = [
  {
    id: 'sp-10',
    number: 10,
    fiscalYear: 'FY26-27',
    startDate: '2026-11-02',
    endDate: '2026-11-13',
    totalValidDays: 10,
  },
  {
    id: 'sp-11',
    number: 11,
    fiscalYear: 'FY26-27',
    startDate: '2026-11-16',
    endDate: '2026-11-27',
    totalValidDays: 10,
  },
  {
    id: 'sp-12',
    number: 12,
    fiscalYear: 'FY26-27',
    startDate: '2026-11-30',
    endDate: '2026-12-11',
    totalValidDays: 10,
  },
]

export const demoAllocations: PersonAllocation[] = [
  // Sthiven divide o tempo entre Web e Plataforma
  ...demoSprints.flatMap((sp) => [
    {
      id: `al-sthiven-web-${sp.id}`,
      personId: OWNER_PERSON_ID,
      squadId: 'sq-web',
      sprintId: sp.id,
      percentage: 50,
    },
    {
      id: `al-sthiven-plat-${sp.id}`,
      personId: OWNER_PERSON_ID,
      squadId: 'sq-platform',
      sprintId: sp.id,
      percentage: 50,
    },
    {
      id: `al-ana-${sp.id}`,
      personId: 'demo-ana',
      squadId: 'sq-web',
      sprintId: sp.id,
      percentage: 100,
    },
    {
      id: `al-bruno-${sp.id}`,
      personId: 'demo-bruno',
      squadId: 'sq-platform',
      sprintId: sp.id,
      percentage: 100,
    },
    {
      id: `al-carla-${sp.id}`,
      personId: 'demo-carla',
      squadId: 'sq-data',
      sprintId: sp.id,
      percentage: 80,
    },
  ]),
  // Diego (QA) entra no Web só a partir da sprint 11
  {
    id: 'al-diego-web-sp-11',
    personId: 'demo-diego',
    squadId: 'sq-web',
    sprintId: 'sp-11',
    percentage: 100,
  },
  {
    id: 'al-diego-web-sp-12',
    personId: 'demo-diego',
    squadId: 'sq-web',
    sprintId: 'sp-12',
    percentage: 60,
  },
  {
    id: 'al-diego-data-sp-12',
    personId: 'demo-diego',
    squadId: 'sq-data',
    sprintId: 'sp-12',
    percentage: 40,
  },
]

const basePeople: Omit<Person, 'squadIds'>[] = [
  {
    id: OWNER_PERSON_ID,
    nome: 'Sthiven Melo',
    email: '',
    cargo: 'Software Developer',
    nivel: 'PL',
  },
  {
    id: 'demo-ana',
    nome: 'Ana (exemplo)',
    email: 'ana@exemplo.dev',
    cargo: 'Sr Software Developer',
    nivel: 'SR',
  },
  {
    id: 'demo-bruno',
    nome: 'Bruno (exemplo)',
    email: 'bruno@exemplo.dev',
    cargo: 'Associate Software Developer',
    nivel: 'JR',
  },
  {
    id: 'demo-carla',
    nome: 'Carla (exemplo)',
    email: 'carla@exemplo.dev',
    cargo: 'Data Analyst',
    nivel: 'JR',
  },
  {
    id: 'demo-diego',
    nome: 'Diego (exemplo)',
    email: 'diego@exemplo.dev',
    cargo: 'Software Tester Quality',
    nivel: 'PL',
  },
]

export const demoPeople: Person[] = basePeople.map((p) => ({
  ...p,
  squadIds: [...new Set(squadIdsOf(p.id))],
}))

const levels = (personId: string, entries: Record<string, number>): PersonSkill[] =>
  Object.entries(entries).map(([skillId, level]) => ({ personId, skillId, level }))

export const demoPersonSkills: PersonSkill[] = [
  ...levels(OWNER_PERSON_ID, {
    'sk-react': 4,
    'sk-next': 4,
    'sk-angular': 3,
    'sk-ts': 4,
    'sk-nest': 4,
    'sk-postgres': 3,
    'sk-docker': 3,
    'sk-k8s': 2,
    'sk-azure': 3,
    'sk-figma': 3,
    'sk-comm': 4,
    'sk-team': 4,
    'sk-mentor': 3,
    'sk-problem': 4,
  }),
  ...levels('demo-ana', { 'sk-react': 5, 'sk-ts': 5, 'sk-tests': 2, 'sk-comm': 2, 'sk-team': 4 }),
  ...levels('demo-bruno', { 'sk-nest': 3, 'sk-postgres': 2, 'sk-docker': 3, 'sk-org': 4 }),
  ...levels('demo-carla', { 'sk-postgres': 3, 'sk-problem': 4, 'sk-org': 2, 'sk-comm': 3 }),
  ...levels('demo-diego', { 'sk-tests': 5, 'sk-ts': 3, 'sk-comm': 4, 'sk-org': 4 }),
]

/** Ana (Sr) apoia Bruno (Associate) nas duas primeiras sprints. */
export const demoSupports: PersonSupport[] = ['sp-10', 'sp-11'].map((sprintId) => ({
  id: `su-ana-bruno-${sprintId}`,
  supporterId: 'demo-ana',
  supportedId: 'demo-bruno',
  sprintId,
  percentage: 25,
}))

/**
 * SP planejados por squad e sprint, para os cards da sprint mostrarem situações diferentes
 * (abaixo, no esperado, acima, na extensão, sobrecarga). Viram work items de exemplo.
 */
const DEMO_PLANNED: { squad: string; owner: string; points: Record<string, number[]> }[] = [
  { squad: 'Frontend Web', owner: 'ana@exemplo.dev', points: { 10: [8, 5, 5, 3], 11: [13, 8, 8, 5, 5, 3], 12: [8, 8, 5, 3] } },
  { squad: 'Plataforma', owner: 'bruno@exemplo.dev', points: { 10: [8, 5, 3], 11: [13, 8, 5, 3], 12: [8, 5, 3, 3] } },
  { squad: 'Dados', owner: 'carla@exemplo.dev', points: { 10: [3, 2], 11: [5, 3, 1] } },
]

export const demoWorkItems: WorkItemRow[] = DEMO_PLANNED.flatMap(({ squad, owner, points }) =>
  Object.entries(points).flatMap(([sprint, values]) =>
    values.map((storyPoints, index) => ({
      id: 0,
      workItemType: 'User Story',
      title: `${squad} · história ${index + 1} (exemplo)`,
      assignedTo: owner,
      email: owner,
      state: 'Active',
      tags: '',
      iterationPath: `Portfolio/${squad}/Sprint ${sprint}`,
      sprint: `Sprint ${sprint}`,
      fiscalYear: 'FY26-27',
      storyPoints,
      effort: 0,
      timeCriticality: 0,
      wsjf: 0,
      pontoExecucao: 0,
      runs: 0,
      isDelayed: false,
    })),
  ),
).map((item, index) => ({ ...item, id: 9000 + index }))

function writeDemoData() {
  saveSkills(demoSkills)
  savePersonSkills(demoPersonSkills)
  saveLevels(DEFAULT_LEVELS)
  saveCargos(demoCargos)
  saveSquads(demoSquads)
  saveSprints(demoSprints)
  savePeople(demoPeople)
  savePersonAllocations(demoAllocations)
  savePersonSupports(demoSupports)
  saveWorkItems(demoWorkItems)
  writeJson(SEED_FLAG_KEY, SEED_VERSION)
}

const isNumber = (value: unknown): value is number => typeof value === 'number'

/** Grava a demonstração na primeira visita. Não sobrescreve dados de quem já usou os apps. */
export function seedDemoDataIfNeeded(): boolean {
  if (readJson(SEED_FLAG_KEY, 0, isNumber) >= SEED_VERSION) return false
  writeDemoData()
  return true
}

/** Apaga os dados dos apps (menos a config do Azure) e volta para a demonstração. */
export function resetDemoData(): void {
  try {
    const keys = Object.keys(window.localStorage)
    for (const key of keys) {
      if (APP_KEY_PREFIXES.some((p) => key.startsWith(p)) && !PRESERVED_KEYS.has(key)) {
        window.localStorage.removeItem(key)
      }
    }
  } catch {
    // localStorage indisponível: só regrava a demonstração
  }
  writeDemoData()
}
