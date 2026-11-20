import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { PlanBar } from './PlanBar'

const meta = {
  title: 'Atoms/PlanBar',
  component: PlanBar,
  tags: ['autodocs'],
  args: {
    planned: 33,
    capacity: 35,
    max: 47.5,
    maxExtended: 61.8,
    fillClassName: 'bg-success',
    label: 'Planejado 33 SP; previsto 35; máximo 47,5; máximo com extensão 61,8',
  },
  decorators: [
    (Story) => (
      <div className='w-72'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `Barra do card de squad no planejamento da sprint: o preenchimento é o planejado (SP), o traço cheio é o previsto, o tracejado é o máximo e a faixa listrada é a extensão de +3 dias úteis.

\`\`\`tsx
<PlanBar planned={33} capacity={35} max={47.5} maxExtended={61.8} label='…' />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof PlanBar>

export default meta
type Story = StoryObj<typeof meta>

export const NoEsperado: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img')).toBeInTheDocument()
  },
}

export const Sobrecarga: Story = {
  args: { planned: 70, fillClassName: 'bg-danger', label: 'Planejado 70 SP' },
}
