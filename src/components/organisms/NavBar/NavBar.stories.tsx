import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { NavBar } from './NavBar'

const meta = {
  title: 'Organisms/NavBar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: { router: { pathname: '/' } },
    docs: {
      description: {
        component: `Cabeçalho fixo do site, renderizado pelo template \`PageLayout\`. No desktop mostra os \`NavLink\`, a \`Logo\` central, o \`LanguageSwitcher\`, o \`ThemeToggle\` e as \`SocialLinks\`. No mobile mostra o GitHub e o \`HamburgerButton\`, que abre o \`MobileMenu\`. A rota ativa vem de \`next/router\`; nas stories, use \`parameters.nextjs.router.pathname\`.

\`\`\`tsx
<NavBar />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof NavBar>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = within(canvas.getByRole('navigation'))
    await expect(nav.getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page')
    await expect(nav.getByRole('link', { name: 'Sobre' })).not.toHaveAttribute('aria-current')
  },
}

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Abrir menu' }))
    await expect(await canvas.findByTestId('mobile-menu-overlay')).toBeInTheDocument()
  },
}
