import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { resetDemoData } from '@/features/seed/demoSeed'
import { AllocationsOverview } from './AllocationsOverview'

const meta = {
  title: 'Organisms/AllocationsOverview',
  component: AllocationsOverview,
  tags: ['autodocs'],
  args: { onOpenGroup: fn() },
  beforeEach: () => resetDemoData(),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Aba "Alocações" do Location Overview (\`/projects/location-overview/alocacoes\`). Lista todas as alocações agrupadas por squad × sprint, com capacity e max points (dias alocados × pontos/dia do nível) e os story points dos work items. Clicar num grupo chama \`onOpenGroup\`; a página leva ao detalhe da squad no fluxo de sprints. "Nova alocação de sprint" abre o \`NewSprintAllocationModal\`.

\`\`\`tsx
<AllocationsOverview onOpenGroup={(squadId, sprintId) => router.push(sprintsHref({ squadId, sprintId }))} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AllocationsOverview>

export default meta
type Story = StoryObj<typeof meta>

export const Grupos: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('row', { name: 'Abrir Plataforma em Sprint 11 - FY26-27' }),
    )
    await expect(args.onOpenGroup).toHaveBeenCalledWith('sq-platform', 'sp-11')
  },
}
