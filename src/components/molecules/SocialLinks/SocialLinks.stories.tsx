import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { SocialLinks } from './SocialLinks'

const meta = {
  title: 'Molecules/SocialLinks',
  component: SocialLinks,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Links para Instagram, GitHub e LinkedIn (URLs em \`src/constants/social.ts\`). Antes eram copiados três vezes na NavBar. Usado na \`NavBar\` (desktop: todas; mobile: só GitHub) e no \`MobileMenu\`.

\`\`\`tsx
<SocialLinks />
<SocialLinks networks={['github']} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SocialLinks>

export default meta
type Story = StoryObj<typeof meta>

export const Todas: Story = {
  play: async ({ canvasElement }) => {
    const links = within(canvasElement).getAllByRole('link')
    await expect(links.map((l) => l.getAttribute('aria-label'))).toEqual([
      'Instagram',
      'GitHub',
      'LinkedIn',
    ])
  },
}

export const SoGithub: Story = { args: { networks: ['github'] } }
