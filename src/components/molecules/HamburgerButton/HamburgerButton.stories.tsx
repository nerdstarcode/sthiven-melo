import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { HamburgerButton } from './HamburgerButton'

const meta = {
  title: 'Molecules/HamburgerButton',
  component: HamburgerButton,
  tags: ['autodocs'],
  args: { isOpen: false, onClick: fn(), label: 'Abrir menu' },
  parameters: {
    docs: {
      description: {
        component: `Botão "hambúrguer" do mobile que vira um X quando \`isOpen\`. Usado na \`NavBar\` para abrir o \`MobileMenu\`.

\`\`\`tsx
<HamburgerButton isOpen={isOpen} onClick={toggle} label={t.openMenu} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof HamburgerButton>

export default meta
type Story = StoryObj<typeof meta>

export const Fechado: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Abrir menu' })
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const Aberto: Story = { args: { isOpen: true } }
