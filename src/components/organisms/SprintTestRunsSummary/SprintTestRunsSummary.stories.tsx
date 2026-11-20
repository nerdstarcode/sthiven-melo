import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { demoTestRuns } from '@/features/seed/demoSeed'
import { SprintTestRunsSummary } from './SprintTestRunsSummary'

const meta = {
  title: 'Organisms/SprintTestRunsSummary',
  component: SprintTestRunsSummary,
  tags: ['autodocs'],
  args: { summary: demoTestRuns[0].summary },
  parameters: {
    docs: {
      description: {
        component: `Resumo dos test runs da squad na sprint, gravado na sincronização com o Azure DevOps: runs automatizados e manuais, taxa de aprovação, resultados e runs por dia.

\`\`\`tsx
<SprintTestRunsSummary summary={findTestRuns(list, squad.id, sprint.id)} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SprintTestRunsSummary>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('91%')).toBeInTheDocument()
  },
}

export const SemTestRuns: Story = { args: { summary: null } }
