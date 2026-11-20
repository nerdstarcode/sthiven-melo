import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { NavLink } from './NavLink'

const meta = {
  title: 'Atoms/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  args: { href: '/about', children: 'Sobre', onClick: fn() },
  parameters: {
    docs: {
      description: {
        component: `Link de navegação com sublinhado amarelo animado (antigo \`CustomLink\` da NavBar). Na rota ativa o sublinhado fica visível e o link recebe \`aria-current="page"\`. Usado no menu desktop da \`NavBar\` e no \`MobileMenu\`.

\`\`\`tsx
<NavLink href='/about' isActive={isActivePath(router.pathname, '/about')}>Sobre</NavLink>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof NavLink>

export default meta
type Story = StoryObj<typeof meta>

export const Inativo: Story = {
  play: async ({ canvasElement, args }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Sobre' })
    await expect(link).not.toHaveAttribute('aria-current')
    await userEvent.click(link)
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const Ativo: Story = {
  args: { isActive: true },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Sobre' })
    await expect(link).toHaveAttribute('aria-current', 'page')
  },
}

export const Grande: Story = { args: { className: 'text-2xl font-semibold' } }
