import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { projects } from '@/data/projects'
import { ProjectCard } from './ProjectCard'

const featured = projects.find((p) => p.variant === 'featured')!
const codeOnly = projects.find((p) => p.variant === 'codeOnly')!

const meta = {
  title: 'Molecules/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
  args: { project: featured },
  decorators: [
    (Story) => (
      <div className='grid grid-cols-12 gap-8'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `Card de projeto com duas variantes, definidas pelo campo \`variant\` do dado:
- **featured**: largo, com resumo traduzido e link para o projeto publicado (antigo \`templates/default\`);
- **codeOnly**: compacto, aponta para o GitHub (antigo \`templates/codedOnly\`).

Renderizado por \`ProjectsGrid\` a partir de \`src/data/projects.ts\`. Precisa estar dentro de um grid de 12 colunas.

\`\`\`tsx
<ProjectCard project={project} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ProjectCard>

export default meta
type Story = StoryObj<typeof meta>

export const Destaque: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: featured.title })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Ver projeto' })).toHaveAttribute(
      'href',
      featured.variant === 'featured' ? featured.link : '',
    )
  },
}

export const SoCodigo: Story = { args: { project: codeOnly } }
