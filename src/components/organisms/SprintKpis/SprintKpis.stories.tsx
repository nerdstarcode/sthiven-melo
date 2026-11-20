import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { demoSprintMetrics } from '@/features/seed/demoPlanning'
import { SprintKpis } from './SprintKpis'

const meta = {
  title: 'Organisms/SprintKpis',
  component: SprintKpis,
  tags: ['autodocs'],
  args: { metrics: demoSprintMetrics('sp-11'), workItemsCount: 6 },
  parameters: {
    docs: {
      description: {
        component: `KPIs da análise de sprint: story points, effort, Capacity e Max da alocação, entregas, pontos sem responsável, pessoas com SP e test runs. Avisa quando os pontos passam do Max.

\`\`\`tsx
<SprintKpis metrics={analyzeSquadSprint(squad, sprint, base)} workItemsCount={items.length} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SprintKpis>

export default meta
type Story = StoryObj<typeof meta>

export const EmAndamento: Story = {}

export const SprintFechada: Story = {
  args: { metrics: demoSprintMetrics('sp-10'), workItemsCount: 4 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('100% do total')).toBeInTheDocument()
  },
}
