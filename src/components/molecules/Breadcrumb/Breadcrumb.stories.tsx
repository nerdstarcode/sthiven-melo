import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { Breadcrumb } from './Breadcrumb'

const meta = {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Você está em',
    items: [
      { label: 'Projetos', href: '/projects' },
      { label: 'Location Overview', href: '/projects/location-overview' },
      { label: 'Sprints', href: '/projects/location-overview/sprints' },
      { label: 'Sprint 11 - FY26-27', href: '/projects/location-overview/sprints?sprint=sp-11' },
      { label: 'Frontend Web' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component: `Trilha de navegação dos apps de /projects. Cada nível é um link e o último é a página atual (\`aria-current="page"\`).

\`\`\`tsx
<Breadcrumb aria-label='Você está em' items={[{ label: 'Projetos', href: '/projects' }, { label: 'Sprints' }]} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const DrillDown: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Frontend Web')).toHaveAttribute(
      'aria-current',
      'page',
    )
  },
}
