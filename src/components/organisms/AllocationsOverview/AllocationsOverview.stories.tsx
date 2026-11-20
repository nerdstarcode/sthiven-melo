import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { resetDemoData } from '@/features/seed/demoSeed'
import { AllocationsOverview } from './AllocationsOverview'

const meta = {
  title: 'Organisms/AllocationsOverview',
  component: AllocationsOverview,
  tags: ['autodocs'],
  beforeEach: () => resetDemoData(),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Tela principal do Location Overview (\`/projects/location-overview/alocacoes\`). Lista as alocações agrupadas por squad × sprint, com capacity e max points (dias alocados × pontos/dia do nível) e os story points dos work items do Azure. Clicar num grupo abre as pessoas alocadas, ações de editar, excluir e mover todos de squad, e o \`SkillCoveragePanel\`.

\`\`\`tsx
<AllocationsOverview />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AllocationsOverview>

export default meta
type Story = StoryObj<typeof meta>

export const Grupos: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('row', { name: 'Abrir Plataforma em Sprint 11 - FY26-27' }),
    )
    await expect(canvas.getByRole('region', { name: 'Cobertura de skills' })).toBeInTheDocument()
  },
}

export const DetalheFrontendWeb: Story = { args: { initialGroupKey: 'sq-web::sp-10' } }
