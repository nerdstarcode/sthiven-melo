import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Plus } from 'lucide-react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Salvar', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'danger', 'ghost'] },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
  },
  parameters: {
    docs: {
      description: {
        component: `Botão dos apps de \`/projects\` (formulários, modais, tabelas). Use \`buttonClasses()\` para estilizar um \`Link\` como botão.

\`\`\`tsx
<Button variant='secondary' onClick={close}>Cancelar</Button>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primario: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Salvar' }))
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const Secundario: Story = { args: { variant: 'secondary', children: 'Cancelar' } }

export const Perigo: Story = { args: { variant: 'danger', children: 'Excluir' } }

export const ComIcone: Story = {
  args: {
    children: (
      <>
        <Plus size={14} aria-hidden /> Nova alocação
      </>
    ),
  },
}

export const Desabilitado: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button')
    await expect(button).toBeDisabled()
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}
