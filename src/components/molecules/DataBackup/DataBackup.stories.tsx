import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, within } from 'storybook/test'
import { DataBackup } from './DataBackup'

const meta = {
  title: 'Molecules/DataBackup',
  component: DataBackup,
  tags: ['autodocs'],
  args: { onImported: fn() },
  parameters: {
    docs: {
      description: {
        component: `Exporta e importa, em JSON, todos os dados dos apps de /projects (pessoas, squads, sprints, alocações, apoios, skills e work items). O token do Azure fica de fora. Aparece no topo de todas as telas do Location Overview.

\`\`\`tsx
<DataBackup />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof DataBackup>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Exportar backup' }),
    ).toBeInTheDocument()
  },
}
