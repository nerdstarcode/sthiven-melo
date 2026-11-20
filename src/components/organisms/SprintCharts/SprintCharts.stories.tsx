import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { demoSprintMetrics } from '@/features/seed/demoPlanning'
import { SprintCharts } from './SprintCharts'

const meta = {
  title: 'Organisms/SprintCharts',
  component: SprintCharts,
  tags: ['autodocs'],
  args: { metrics: demoSprintMetrics('sp-11') },
  parameters: {
    docs: {
      description: {
        component: `Gráficos da análise de sprint (ECharts, carregado sob demanda): burnup com entregas por dia, acumulado, linha ideal e escopo; story points por tipo de work item; e por estado, com as cores padrão de cada estado.

\`\`\`tsx
<SprintCharts metrics={metrics} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SprintCharts>

export default meta
type Story = StoryObj<typeof meta>

export const EmAndamento: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('img', { name: 'Story points entregues por dia' })).toBeInTheDocument()
  },
}

export const SprintFechada: Story = { args: { metrics: demoSprintMetrics('sp-10') } }

export const TemaClaro: Story = { args: { darkMode: false } }

export const SemDados: Story = {
  args: { metrics: { burnup: [], byType: [], byState: [] } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByText('Sem dados para o gráfico.')).toHaveLength(3)
  },
}
