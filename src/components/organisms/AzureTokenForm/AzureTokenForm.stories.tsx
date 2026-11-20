import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, within } from 'storybook/test'
import { DEFAULT_AZURE_CONFIG } from '@/features/location-overview/lib/azure/azureConfigStorage'
import { AzureTokenForm } from './AzureTokenForm'

const meta = {
  title: 'Organisms/AzureTokenForm',
  component: AzureTokenForm,
  tags: ['autodocs'],
  args: {
    initialConfig: DEFAULT_AZURE_CONFIG,
    onSave: fn(),
    onTest: fn(async () => 4),
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Conexão com o Azure DevOps: organização, PAT (oculto por padrão), campo de story points e os tipos que somam pontos. Ao lado, as **permissões mínimas** do token, todas só de leitura: Project and Team, Work Items e Test Management. O token fica só no navegador e não vai no backup.

\`\`\`tsx
<AzureTokenForm initialConfig={config} onSave={salvar} onTest={(c) => listProjects(c).then((p) => p.length)} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AzureTokenForm>

export default meta
type Story = StoryObj<typeof meta>

export const NovaConexao: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Work Items: Read')).toBeInTheDocument()
  },
}

export const Configurado: Story = {
  args: {
    initialConfig: { ...DEFAULT_AZURE_CONFIG, organization: 'acme', pat: 'token-de-exemplo' },
    onClear: fn(),
  },
}
