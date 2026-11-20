import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { projects } from '@/data/projects'
import { ProjectsGrid } from './ProjectsGrid'

const meta = {
  title: 'Organisms/ProjectsGrid',
  component: ProjectsGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Grade de 12 colunas da página \`projects\`. Renderiza um \`ProjectCard\` por item de \`src/data/projects.ts\`; a variante de cada card vem do dado. Substitui os 12 cards escritos à mão.

\`\`\`tsx
<ProjectsGrid />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ProjectsGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Todos: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('article')).toHaveLength(projects.length)
  },
}

export const Poucos: Story = { args: { projects: projects.slice(0, 3) } }
