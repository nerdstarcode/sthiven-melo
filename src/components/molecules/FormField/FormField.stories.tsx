import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { SelectField, TextField } from './FormField'

const meta = {
  title: 'Molecules/FormField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Nome', placeholder: 'Ex.: Ana' },
  parameters: {
    docs: {
      description: {
        component: `\`TextField\` e \`SelectField\`: o campo com rótulo e mensagem de ajuda ou erro, ligados por \`htmlFor\` e \`aria-describedby\`. Usados nos modais de pessoa, squad, sprint, alocação e skill.

\`\`\`tsx
<TextField label='% de alocação' type='number' error={errors.percentage} />
<SelectField label='Squad' options={squadOptions} placeholder='Escolha' />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Texto: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Nome')
    await userEvent.type(input, 'Ana')
    await expect(input).toHaveValue('Ana')
  },
}

export const ComAjuda: Story = { args: { hint: 'Como aparece nas tabelas.' } }

export const ComErro: Story = {
  args: { error: 'Informe o nome.' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Nome')
    await expect(input).toHaveAccessibleDescription('Informe o nome.')
  },
}

export const Selecao: Story = {
  render: () => (
    <SelectField
      label='Nível'
      placeholder='Escolha um nível'
      defaultValue=''
      options={[
        { value: 'JR', label: 'Júnior' },
        { value: 'PL', label: 'Pleno' },
      ]}
    />
  ),
}
