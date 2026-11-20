import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { resetDemoData } from '@/features/seed/demoSeed'
import { CargosManager } from './CargosManager'

const meta = {
  title: 'Organisms/CargosManager',
  component: CargosManager,
  tags: ['autodocs'],
  beforeEach: () => resetDemoData(),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Cadastro de cargos: cada cargo tem um tipo (Dev, QA, Dados, Gestão) e um nível. No formulário de pessoa, escolher o cargo preenche o nível. Fica em \`/projects/location-overview/niveis\`.

\`\`\`tsx
<CargosManager />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof CargosManager>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Validacao: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Adicionar cargo' }))
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(body.getByRole('button', { name: 'Salvar' }))
    await expect(body.getByLabelText('Cargo')).toHaveAccessibleDescription('Informe o cargo.')
  },
}
