import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, within } from 'storybook/test'
import { demoPersonDashboard } from '@/features/seed/demoDashboard'
import { PersonMetricsView } from './PersonMetricsView'

const ana = demoPersonDashboard('demo-ana')
const bruno = demoPersonDashboard('demo-bruno')

const meta = {
  title: 'Organisms/PersonMetricsView',
  component: PersonMetricsView,
  tags: ['autodocs'],
  args: { ...ana, onBack: fn() },
  parameters: {
    docs: {
      description: {
        component: `Métricas de uma pessoa no Dashboard: SP entregues, média por sprint, aderência à alocação, atrasos, testes (para quem executou) e a entrega de cada sprint frente ao Capacity e ao Max. Quando há apoio (mentoria), mostra quem a pessoa apoiou e quem a apoiou.

\`\`\`tsx
<PersonMetricsView row={row} support={dashboardSupport(row, base, filters)} onBack={...} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof PersonMetricsView>

export default meta
type Story = StoryObj<typeof meta>

export const QuemApoia: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(/Apoiou: Bruno/)).toBeInTheDocument()
  },
}

export const QuemEApoiado: Story = { args: { ...bruno } }
