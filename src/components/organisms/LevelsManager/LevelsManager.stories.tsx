import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { resetDemoData } from '@/features/seed/demoSeed'
import { LevelsManager } from './LevelsManager'

const meta = {
  title: 'Organisms/LevelsManager',
  component: LevelsManager,
  tags: ['autodocs'],
  beforeEach: () => resetDemoData(),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Capacity e máximo de pontos por dia de cada nível (APR, ES, JR, PL, SR), editáveis direto na tabela. Esses valores × dias alocados dão a capacidade da squad na sprint. Fica em \`/projects/location-overview/niveis\`.

\`\`\`tsx
<LevelsManager />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof LevelsManager>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Max points/dia SR'),
    ).toBeInTheDocument()
  },
}
