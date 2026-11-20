import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { NumberCell } from './NumberCell'

const meta = {
  title: 'Molecules/NumberCell',
  component: NumberCell,
  tags: ['autodocs'],
  args: { value: 1.5, onCommit: fn(), 'aria-label': 'Max points/dia SR' },
  parameters: {
    docs: {
      description: {
        component: `Número editável dentro de tabelas (ex.: pontos por dia em \`LevelsManager\`). Guarda o texto enquanto a pessoa digita e só confirma no blur ou no Enter. Esc ou um valor inválido voltam ao original. Aceita vírgula decimal.

\`\`\`tsx
<NumberCell aria-label='Max points/dia SR' value={1.5} onCommit={save} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof NumberCell>

export default meta
type Story = StoryObj<typeof meta>

export const Editar: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByLabelText('Max points/dia SR')
    await userEvent.clear(input)
    await userEvent.type(input, '2,5{Enter}')
    await expect(args.onCommit).toHaveBeenCalledWith(2.5)
  },
}
