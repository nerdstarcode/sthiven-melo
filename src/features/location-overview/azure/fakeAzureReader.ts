import type { AzureReader } from '@/components/organisms/AzureExplorer'
import { FIXTURE_ITERATIONS, FIXTURE_MEMBERS } from '@/features/location-overview/lib/azure/sprintFixtures'
import type { AzureWorkItem } from '@/features/location-overview/lib/azure/types'

/** Work item no formato da API, com os campos que o mapper lê. */
const workItem = (id: number, storyPoints: number, iterationPath: string): AzureWorkItem => ({
  id,
  fields: {
    'System.WorkItemType': 'User Story',
    'System.Title': `História ${id}`,
    'System.State': 'Active',
    'System.IterationPath': iterationPath,
    'Microsoft.VSTS.Scheduling.StoryPoints': storyPoints,
  },
})

/** Leitor do Azure DevOps em memória, para stories e testes (sem rede). */
export function fakeAzureReader(overrides: Partial<AzureReader> = {}): AzureReader {
  return {
    listProjects: async () => [{ id: 'p1', name: 'Portfolio', state: 'wellFormed' }],
    listTeams: async () => [
      { id: 't1', name: 'Portal', projectId: 'p1', projectName: 'Portfolio' },
      { id: 't2', name: 'Renewals', projectId: 'p1', projectName: 'Portfolio' },
    ],
    listTeamMembers: async () => FIXTURE_MEMBERS,
    listTeamIterations: async () => FIXTURE_ITERATIONS,
    getIterationWorkItems: async (_config, _project, path) => [
      workItem(501, 5, path),
      workItem(502, 3, path),
    ],
    ...overrides,
  }
}
