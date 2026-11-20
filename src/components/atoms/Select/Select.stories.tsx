import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Select } from './Select'

const meta = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Squad',
    placeholder: 'Escolha uma squad',
    defaultValue: '',
    options: [
      { value: 'web', label: 'Frontend Web' },
      { value: 'plat', label: 'Plataforma' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component: `Select nativo no estilo do \`Input\`. Nos formulários, prefira \`SelectField\`.

\`\`\`tsx
<Select options={squads.map((s) => ({ value: s.id, label: s.name }))} placeholder='Squad' />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const ComPlaceholder: Story = {
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox')
    await userEvent.selectOptions(select, 'plat')
    await expect(select).toHaveValue('plat')
  },
}

export const Invalido: Story = { args: { invalid: true } }
