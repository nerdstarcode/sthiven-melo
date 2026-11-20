import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { skills } from '@/data/skills'
import { SkillsCloud } from './SkillsCloud'

const meta = {
  title: 'Organisms/SkillsCloud',
  component: SkillsCloud,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Seção "Skills" da página \`about\` (âncora \`#skills\`, usada pela NavBar). Espalha as \`SkillBubble\` sobre o fundo circular, com posições definidas em \`src/data/skills.ts\`.

\`\`\`tsx
<SkillsCloud />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SkillsCloud>

export default meta
type Story = StoryObj<typeof meta>

export const Todas: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('NestJS')).toBeInTheDocument()
  },
}

export const Poucas: Story = { args: { skills: skills.slice(0, 4) } }
