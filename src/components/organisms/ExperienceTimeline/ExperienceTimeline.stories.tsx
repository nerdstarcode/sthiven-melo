import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { experiences } from '@/data/experiences'
import { ExperienceTimeline } from './ExperienceTimeline'

const meta = {
  title: 'Organisms/ExperienceTimeline',
  component: ExperienceTimeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Seção "Experiências" da página \`about\` (âncora \`#experience\`). Lista os \`ExperienceItem\` de \`src/data/experiences.ts\`, alternando o lado da ilustração.

\`\`\`tsx
<ExperienceTimeline />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ExperienceTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Completa: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('listitem')).toHaveLength(experiences.length)
  },
}

export const UmaExperiencia: Story = { args: { experiences: experiences.slice(0, 1) } }
