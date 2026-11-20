import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { CONTACT_MAILTO } from '@/constants/social'
import { HireMe } from './HireMe'

const meta = {
  title: 'Molecules/HireMe',
  component: HireMe,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Selo circular giratório, fixo no canto inferior esquerdo, com link de contato por e-mail. O texto acompanha o idioma.

⚠️ **Hoje não é renderizado em nenhuma página.** Decida se volta para a home ou se sai.

\`\`\`tsx
<HireMe />
\`\`\``,
      },
      story: { inline: false, iframeHeight: 260 },
    },
  },
} satisfies Meta<typeof HireMe>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('link')).toHaveAttribute('href', CONTACT_MAILTO)
  },
}
