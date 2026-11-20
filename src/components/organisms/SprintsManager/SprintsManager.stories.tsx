import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { resetDemoData } from '@/features/seed/demoSeed'
import { SprintsManager } from './SprintsManager'

const meta = {
  title: 'Organisms/SprintsManager',
  component: SprintsManager,
  tags: ['autodocs'],
  beforeEach: () => resetDemoData(),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Cadastro de sprints (número, ano fiscal FYxx-yy, datas e dias úteis). Os dias úteis definem quantos dias cada % de alocação representa. Fica em \`/projects/location-overview/sprints\`.

\`\`\`tsx
<SprintsManager />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SprintsManager>

export default meta
type Story = StoryObj<typeof meta>

export const Demonstracao: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole('cell', { name: 'Sprint 11 - FY26-27' }),
    ).toBeInTheDocument()
  },
}

export const Validacao: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Adicionar sprint' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Salvar' }))
    await expect(canvas.getByLabelText('Ano fiscal')).toHaveAccessibleDescription(
      'Use o formato FY25-26.',
    )
  },
}
