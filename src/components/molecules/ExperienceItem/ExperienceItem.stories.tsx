import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { experiences } from '@/data/experiences'
import { ExperienceItem } from './ExperienceItem'

const meta = {
  title: 'Molecules/ExperienceItem',
  component: ExperienceItem,
  tags: ['autodocs'],
  args: { experience: experiences[0], imageSide: 'left' },
  decorators: [
    (Story) => (
      <ul className='max-w-4xl'>
        <Story />
      </ul>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `Item da linha do tempo de experiências: ilustração, cargo, empresa (link), período/local e descrição (curta no mobile, completa a partir de \`md\`). Todos os textos vêm traduzidos de \`src/data/experiences.ts\`. Substitui o compound \`Details.*\`. Renderizado por \`ExperienceTimeline\`, que alterna \`imageSide\`.

\`\`\`tsx
<ExperienceItem experience={experience} imageSide='right' />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ExperienceItem>

export default meta
type Story = StoryObj<typeof meta>

export const EmpregoAtual: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: 'NTT DATA, Inc' })).toBeInTheDocument()
  },
}

export const ImagemADireita: Story = { args: { experience: experiences[1], imageSide: 'right' } }

export const SemEmpresa: Story = { args: { experience: experiences[3], imageSide: 'right' } }
