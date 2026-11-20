import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { OWNER_PERSON_ID, resetDemoData } from '@/features/seed/demoSeed'
import { PersonSkillsEditor } from './PersonSkillsEditor'

const meta = {
  title: 'Organisms/PersonSkillsEditor',
  component: PersonSkillsEditor,
  tags: ['autodocs'],
  args: { personId: OWNER_PERSON_ID, onChange: fn() },
  beforeEach: () => resetDemoData(),
  decorators: [
    (Story) => (
      <div className='w-[28rem]'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `Perfil de skills de uma pessoa, em dois grupos (hard e soft), com nível de 1 a 5 editável no \`ProficiencyRating\`. Abre pelo botão ✨ da tabela de Pessoas e também é a base do Skills Template. Com \`readOnly\`, só exibe.

\`\`\`tsx
<PersonSkillsEditor personId={person.id} onChange={setPersonSkills} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof PersonSkillsEditor>

export default meta
type Story = StoryObj<typeof meta>

export const PerfilDoSthiven: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('radio', { name: 'Kubernetes: 3' }))
    await expect(args.onChange).toHaveBeenCalledTimes(1)
  },
}

export const SomenteLeitura: Story = { args: { readOnly: true } }

export const PerfilVazio: Story = { args: { personId: 'pessoa-sem-skills' } }
