import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { EChart } from './EChart'

const meta = {
  title: 'Atoms/EChart',
  component: EChart,
  tags: ['autodocs'],
  args: {
    label: 'Story points por dia',
    height: 260,
    option: {
      xAxis: { type: 'category', data: ['16/11', '17/11', '18/11', '19/11', '20/11'] },
      yAxis: { type: 'value' },
      series: [{ name: 'Entregues', type: 'bar', data: [0, 5, 8, 3, 0] }],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Gráfico do ECharts carregado sob demanda e só no cliente: o pacote entra apenas nas telas com gráfico. A \`label\` descreve o gráfico para leitores de tela.

\`\`\`tsx
<EChart label='Burnup da sprint' option={option} height={320} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof EChart>

export default meta
type Story = StoryObj<typeof meta>

export const Barras: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', { name: 'Story points por dia' }),
    ).toBeInTheDocument()
  },
}
