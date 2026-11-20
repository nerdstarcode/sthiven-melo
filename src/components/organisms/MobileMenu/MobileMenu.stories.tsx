import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { MobileMenu } from './MobileMenu'

const meta = {
  title: 'Organisms/MobileMenu',
  component: MobileMenu,
  tags: ['autodocs'],
  args: { isOpen: true, onClose: fn(), pathname: '/' },
  globals: { viewport: { value: 'mobile1' } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Overlay de navegação do mobile, aberto pelo \`HamburgerButton\` da \`NavBar\`. Reúne \`LanguageSwitcher\`, \`ThemeToggle\`, \`NavLink\` e \`SocialLinks\`. Fecha ao clicar fora do painel ou em um link. Só aparece abaixo de \`md\`.

\`\`\`tsx
<MobileMenu isOpen={isOpen} onClose={close} pathname={router.pathname} />
\`\`\``,
      },
      story: { inline: false, iframeHeight: 640 },
    },
  },
} satisfies Meta<typeof MobileMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Aberto: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('link', { name: 'Projetos' }))
    await expect(args.onClose).toHaveBeenCalledTimes(1)
  },
}

export const Fechado: Story = { args: { isOpen: false } }
