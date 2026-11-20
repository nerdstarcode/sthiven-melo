import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { demoSprintMetrics } from '@/features/seed/demoPlanning'
import { SprintPeopleTable } from './SprintPeopleTable'

const meta = {
  title: 'Organisms/SprintPeopleTable',
  component: SprintPeopleTable,
  tags: ['autodocs'],
  args: { rows: demoSprintMetrics('sp-11').allocation },
  parameters: {
    docs: {
      description: {
        component: `Comparação dos story points de cada pessoa com o Capacity e o Max da alocação na squad/sprint. A situação fica abaixo, dentro ou acima da faixa (para QA, a faixa é uma % do total da sprint).

\`\`\`tsx
<SprintPeopleTable rows={metrics.allocation} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SprintPeopleTable>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Ana (exemplo)')).toBeInTheDocument()
  },
}

export const Vazia: Story = { args: { rows: [] } }
