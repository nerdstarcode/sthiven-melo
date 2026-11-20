import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { demoPeopleSummary } from '@/features/seed/demoDashboard'
import { PeopleSummaryTable } from './PeopleSummaryTable'

const meta = {
  title: 'Organisms/PeopleSummaryTable',
  component: PeopleSummaryTable,
  tags: ['autodocs'],
  args: { rows: demoPeopleSummary, onOpenPerson: fn() },
  parameters: {
    docs: {
      description: {
        component: `Resumo das pessoas no Dashboard: SP entregues, média por sprint, capacity, aderência à alocação e a situação da carga. Clicar (ou Enter) numa linha abre as métricas da pessoa.

\`\`\`tsx
<PeopleSummaryTable rows={dashboardPeople(base, filters)} onOpenPerson={(id) => router.push(...)} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof PeopleSummaryTable>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole('row', { name: 'Ver métricas de Ana (exemplo)' }),
    )
    await expect(args.onOpenPerson).toHaveBeenCalledWith('demo-ana')
  },
}

export const Vazio: Story = { args: { rows: [] } }
