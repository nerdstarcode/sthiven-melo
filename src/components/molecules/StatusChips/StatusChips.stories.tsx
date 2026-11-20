import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { LoadStatusChip, SprintPhaseChip } from './StatusChips'

const meta = {
  title: 'Molecules/StatusChips',
  component: LoadStatusChip,
  tags: ['autodocs'],
  args: { status: 'within' },
  argTypes: {
    status: {
      control: 'select',
      options: ['below', 'within', 'above', 'extension', 'overload', null],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Chips do planejamento de sprint. \`LoadStatusChip\` compara o planejado com o previsto (abaixo, no esperado, acima, na extensão, sobrecarga); \`SprintPhaseChip\` mostra se a sprint está fechada, atual ou aberta.

\`\`\`tsx
<LoadStatusChip status='above' />
<SprintPhaseChip phase='current' />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof LoadStatusChip>

export default meta
type Story = StoryObj<typeof meta>

export const NoEsperado: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('No esperado')).toBeInTheDocument()
  },
}

export const Todos: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <LoadStatusChip status='below' />
      <LoadStatusChip status='within' />
      <LoadStatusChip status='above' />
      <LoadStatusChip status='extension' />
      <LoadStatusChip status='overload' />
      <LoadStatusChip status={null} />
    </div>
  ),
}

export const Fases: Story = {
  render: () => (
    <div className='flex gap-2'>
      <SprintPhaseChip phase='closed' />
      <SprintPhaseChip phase='current' />
      <SprintPhaseChip phase='open' />
    </div>
  ),
}
