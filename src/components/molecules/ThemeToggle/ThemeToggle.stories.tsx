import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ThemeToggle } from './ThemeToggle'

const meta = {
  title: 'Molecules/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  args: { isDark: true, onToggle: fn() },
  parameters: {
    docs: {
      description: {
        component: `Botão que alterna entre tema escuro (☾) e claro (☼). Sem props, usa o \`ThemeContext\`, que aplica a classe \`dark\` em \`<html>\`. Usado na \`NavBar\` e no \`MobileMenu\`.

\`\`\`tsx
<ThemeToggle />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Escuro: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button')
    await expect(button).toHaveTextContent('☾')
    await userEvent.click(button)
    await expect(args.onToggle).toHaveBeenCalledTimes(1)
  },
}

export const Claro: Story = { args: { isDark: false } }

export const LigadoAoContexto: Story = {
  args: { isDark: undefined, onToggle: undefined },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button')
    await userEvent.click(button)
    await expect(button).toHaveTextContent('☼')
  },
}
