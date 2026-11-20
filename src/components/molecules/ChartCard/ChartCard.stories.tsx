import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { ChartCard } from './ChartCard'

const meta = {
  title: 'Molecules/ChartCard',
  component: ChartCard,
  tags: ['autodocs'],
  args: {
    title: 'Story points por tipo',
    description: 'Somente os tipos que somam pontos.',
    children: <div className='h-32 rounded bg-surface-muted' />,
  },
  parameters: {
    docs: {
      description: {
        component: `Moldura dos gráficos e tabelas da análise de sprint, com título, descrição e estado vazio.

\`\`\`tsx
<ChartCard title='Burnup' isEmpty={!points.length} emptyMessage='Sem dados'>
  <EChart label='Burnup' option={option} />
</ChartCard>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ChartCard>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Vazio: Story = {
  args: { isEmpty: true, emptyMessage: 'Sem dados para o gráfico.' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Sem dados para o gráfico.')).toBeInTheDocument()
  },
}
