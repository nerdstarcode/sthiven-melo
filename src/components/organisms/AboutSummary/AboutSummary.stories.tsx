import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { AboutSummary } from './AboutSummary'

const meta = {
  title: 'Organisms/AboutSummary',
  component: AboutSummary,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Topo da página \`about\`: biografia (curta no mobile, completa a partir de \`md\`), foto em moldura (\`ProfileImage\`) e três \`StatItem\` animados.

\`\`\`tsx
<AboutSummary />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AboutSummary>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Biografia' })).toBeInTheDocument()
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(3)
  },
}
