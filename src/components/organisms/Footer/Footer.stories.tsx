import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { CONTACT_MAILTO } from '@/constants/social'
import { Footer } from './Footer'

const meta = {
  title: 'Organisms/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Rodapé do site, renderizado pelo \`PageLayout\`: copyright do ano atual, crédito para NerdStarCode e um link "Diga olá!" por e-mail. Os textos acompanham o idioma.

\`\`\`tsx
<Footer />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: 'Diga olá!' })).toHaveAttribute(
      'href',
      CONTACT_MAILTO,
    )
  },
}
