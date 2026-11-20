import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'
import { savePeople } from '@/features/location-overview/lib/peopleStorage'
import { resetDemoData } from '@/features/seed/demoSeed'
import { PeopleManager } from './PeopleManager'

const meta = {
  title: 'Organisms/PeopleManager',
  component: PeopleManager,
  tags: ['autodocs'],
  args: { confirm: () => true },
  beforeEach: () => resetDemoData(),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Cadastro de pessoas do Location Overview (\`/projects/location-overview/pessoas\`). O cargo define o nível, as squads são marcadas no formulário e o botão ✨ abre o \`PersonSkillsEditor\`. A tabela mostra as 3 skills de maior nível. Excluir remove também as skills e as alocações da pessoa.

\`\`\`tsx
<PeopleManager />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof PeopleManager>

export default meta
type Story = StoryObj<typeof meta>

export const Demonstracao: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole('cell', { name: 'Sthiven Melo' }),
    ).toBeInTheDocument()
  },
}

export const EditarSkills: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Editar skills: Diego (exemplo)' }),
    )
    const body = within(canvasElement.ownerDocument.body)
    await expect(
      body.getByRole('dialog', { name: 'Skills de Diego (exemplo)' }),
    ).toBeInTheDocument()
  },
}

export const Vazio: Story = { beforeEach: () => savePeople([]) }
