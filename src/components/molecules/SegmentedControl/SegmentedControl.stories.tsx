import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { SegmentedControl } from './SegmentedControl'

const meta = {
  title: 'Molecules/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Situação das sprints',
    value: 'active',
    onChange: fn(),
    options: [
      { value: 'active', label: 'Atual + abertas' },
      { value: 'closed', label: 'Fechadas' },
      { value: 'all', label: 'Todas' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component: `Botões exclusivos para filtros com poucas opções (ex.: situação das sprints). Usa \`aria-pressed\`.

\`\`\`tsx
<SegmentedControl aria-label='Situação' options={opcoes} value={filtro} onChange={setFiltro} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SegmentedControl<string>>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Todas' }))
    await expect(args.onChange).toHaveBeenCalledWith('all')
  },
}
