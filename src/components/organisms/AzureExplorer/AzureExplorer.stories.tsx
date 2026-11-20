import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, within } from 'storybook/test'
import { fakeAzureReader } from '@/features/location-overview/azure/fakeAzureReader'
import { DEFAULT_AZURE_CONFIG } from '@/features/location-overview/lib/azure/azureConfigStorage'
import { resetDemoData } from '@/features/seed/demoSeed'
import { AzureExplorer } from './AzureExplorer'

const meta = {
  title: 'Organisms/AzureExplorer',
  component: AzureExplorer,
  tags: ['autodocs'],
  args: {
    config: { ...DEFAULT_AZURE_CONFIG, organization: 'acme', pat: '***' },
    projectId: 'p1',
    teamId: 't1',
    onSelect: fn(),
    onOpenFlow: fn(),
    api: fakeAzureReader(),
  },
  beforeEach: () => resetDemoData(),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Integração com o Azure DevOps (\`/projects/location-overview/azure\`), somente leitura: projeto → team → pessoas e sprints do team.
- "Sincronizar squad, pessoas e sprints" cria ou atualiza a squad, as pessoas e as sprints na base local.
- "Work items" busca os itens de uma sprint (WIQL + workitemsbatch) e grava os story points que alimentam o fluxo de sprints.

As stories usam um leitor falso (\`fakeAzureReader\`), sem rede.

\`\`\`tsx
<AzureExplorer config={config} projectId={projeto} teamId={time} onSelect={trocar} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AzureExplorer>

export default meta
type Story = StoryObj<typeof meta>

export const TeamEscolhido: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('Ada Lovelace')).toBeInTheDocument()
  },
}

export const EscolherProjeto: Story = { args: { projectId: undefined, teamId: undefined } }

export const TokenInvalido: Story = {
  args: {
    projectId: undefined,
    teamId: undefined,
    api: fakeAzureReader({
      listProjects: async () => {
        throw new Error('Token inválido ou expirado. Atualize o PAT na configuração do Azure DevOps.')
      },
    }),
  },
}
