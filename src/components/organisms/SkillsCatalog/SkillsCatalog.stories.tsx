import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { resetDemoData } from '@/features/seed/demoSeed'
import { saveSkills } from '@/features/skills/lib/skillsStorage'
import { SkillsCatalog } from './SkillsCatalog'

const meta = {
  title: 'Organisms/SkillsCatalog',
  component: SkillsCatalog,
  tags: ['autodocs'],
  args: { confirm: () => true },
  beforeEach: () => resetDemoData(),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Catálogo de hard e soft skills compartilhado entre o Location Overview e o Skills Template. Mostra quantas pessoas têm cada skill. Excluir uma skill a remove de todos os perfis. Fica em \`/projects/location-overview/skills\`.

\`\`\`tsx
<SkillsCatalog />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SkillsCatalog>

export default meta
type Story = StoryObj<typeof meta>

export const Demonstracao: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('cell', { name: 'Comunicação' })).toBeInTheDocument()
  },
}

export const NovaSkill: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Adicionar skill' }))
    const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog')
    await userEvent.type(within(dialog).getByLabelText('Nome'), 'Liderança')
    await userEvent.selectOptions(within(dialog).getByLabelText('Tipo'), 'soft')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Salvar' }))
    await expect(await canvas.findByRole('cell', { name: 'Liderança' })).toBeInTheDocument()
  },
}

export const Vazio: Story = { beforeEach: () => saveSkills([]) }
