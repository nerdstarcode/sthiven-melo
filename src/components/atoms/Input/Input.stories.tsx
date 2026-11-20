import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Input } from './Input'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'Nome da pessoa', 'aria-label': 'Nome' },
  parameters: {
    docs: {
      description: {
        component: `Campo de texto base. Nos formulários, prefira a molécula \`TextField\`, que adiciona rótulo e mensagem de erro.

\`\`\`tsx
<Input value={value} onChange={(e) => setValue(e.target.value)} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox')
    await userEvent.type(input, 'Ana')
    await expect(input).toHaveValue('Ana')
  },
}

export const Invalido: Story = { args: { invalid: true } }

export const Numero: Story = { args: { type: 'number', min: 0, max: 100, defaultValue: 50 } }
