import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { resetDemoData } from '@/features/seed/demoSeed'
import { SquadsManager } from './SquadsManager'

const meta = {
  title: 'Organisms/SquadsManager',
  component: SquadsManager,
  tags: ['autodocs'],
  args: { confirm: () => true },
  beforeEach: () => resetDemoData(),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Cadastro de squads do Location Overview (\`/projects/location-overview/squads\`): nome, nomes alternativos (usados para casar com Iteration Path e Team do Azure), membros e **skills requeridas com nível mínimo**, que alimentam a cobertura de skills. Também mescla uma squad em outra, levando alocações, membros e requisitos.

\`\`\`tsx
<SquadsManager />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SquadsManager>

export default meta
type Story = StoryObj<typeof meta>

export const Demonstracao: Story = {
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('React ≥4')).toBeInTheDocument()
  },
}

export const EditarSquad: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Editar Plataforma' }))
    await expect(canvas.getByRole('dialog', { name: 'Editar squad' })).toBeInTheDocument()
  },
}
