import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { skillsOfPerson } from '@/features/skills/lib/skillsStorage'
import { demoPersonSkills, demoSkills, OWNER_PERSON_ID } from '@/features/seed/demoSeed'
import { SkillsRadar } from './SkillsRadar'

const meta = {
  title: 'Organisms/SkillsRadar',
  component: SkillsRadar,
  tags: ['autodocs'],
  args: { profile: skillsOfPerson(OWNER_PERSON_ID, demoPersonSkills, demoSkills) },
  parameters: {
    docs: {
      description: {
        component: `Radar das hard e das soft skills de um perfil (nível de 1 a 5), com a quantidade e a média de cada tipo. Com menos de 3 skills de um tipo, explica em vez de desenhar.

\`\`\`tsx
<SkillsRadar profile={skillsOfPerson(personId, personSkills, skills)} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SkillsRadar>

export default meta
type Story = StoryObj<typeof meta>

export const PerfilDoSthiven: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img', { name: 'Hard skills' })).toBeInTheDocument()
  },
}

export const PoucasSkills: Story = {
  args: { profile: skillsOfPerson(OWNER_PERSON_ID, demoPersonSkills, demoSkills).slice(0, 2) },
}
