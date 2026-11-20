import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Logo } from './Logo'

const meta = {
  title: 'Organisms/Logo',
  component: Logo,
  tags: ['autodocs'],
  args: { onSelect: fn() },
  parameters: {
    docs: {
      description: {
        component: `Logo "SM" com gradiente animado. No hover mostra as \`WorkTab\` (UI/UX, Front, Backend), que trocam a seção da home pelo \`WorkContext\`. Clicar no "SM" volta ao Hero. Fica no centro da \`NavBar\` (desktop) e na barra inferior do \`PageLayout\` (mobile).

\`\`\`tsx
<Logo />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('link', { name: 'Backend' }))
    await expect(args.onSelect).toHaveBeenLastCalledWith('Backend')
    await userEvent.click(canvas.getByRole('link', { name: /início/ }))
    await expect(args.onSelect).toHaveBeenLastCalledWith('')
  },
}
