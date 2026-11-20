import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, within } from 'storybook/test'
import { resetDemoData } from '@/features/seed/demoSeed'
import { SprintAnalysis } from './SprintAnalysis'

const meta = {
  title: 'Organisms/SprintAnalysis',
  component: SprintAnalysis,
  tags: ['autodocs'],
  args: { sprintId: 'sp-11', squadId: 'sq-web', onSelect: fn() },
  beforeEach: () => resetDemoData(),
  parameters: {
    docs: {
      description: {
        component: `Análise de uma squad numa sprint com a base local (work items da demonstração ou sincronizados do Azure DevOps): KPIs, gráficos, pessoas × alocação e test runs. A sprint e a squad abertas vêm por props; a página as grava na URL.

\`\`\`tsx
<SprintAnalysis sprintId='sp-11' squadId='sq-web' onSelect={(s) => router.push(analysisHref(s))} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SprintAnalysis>

export default meta
type Story = StoryObj<typeof meta>

export const EmAndamento: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('table', { name: 'Pessoas × alocação' })).toBeInTheDocument()
  },
}

export const SprintFechada: Story = { args: { sprintId: 'sp-10' } }

export const SemSelecao: Story = {
  args: { sprintId: undefined, squadId: undefined },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Escolha uma sprint e uma squad para ver a análise.'),
    ).toBeInTheDocument()
  },
}
