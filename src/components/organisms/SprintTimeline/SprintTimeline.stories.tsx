import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { demoTimelineRows } from '@/features/seed/demoPlanning'
import { SprintTimeline } from './SprintTimeline'

const meta = {
  title: 'Organisms/SprintTimeline',
  component: SprintTimeline,
  tags: ['autodocs'],
  args: {
    rows: demoTimelineRows,
    phaseFilter: 'all',
    onPhaseFilterChange: fn(),
    onOpen: fn(),
    onCreate: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Nível 1 do fluxo de sprints do Location Overview. Mostra as sprints em ordem com:
- a fase: fechada, atual ou aberta
- as squads e as pessoas alocadas
- previsto/máximo e os SP planejados
- a situação, planejado × previsto

Clicar numa linha chama \`onOpen\`.

\`\`\`tsx
<SprintTimeline rows={rows} phaseFilter={filtro} onPhaseFilterChange={setFiltro} onOpen={abrir} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SprintTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Todas: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole('row', { name: 'Abrir Sprint 11 - FY26-27' }),
    )
    await expect(args.onOpen).toHaveBeenCalled()
  },
}

export const AtualEAbertas: Story = { args: { phaseFilter: 'active' } }

export const Vazia: Story = { args: { rows: [] } }
