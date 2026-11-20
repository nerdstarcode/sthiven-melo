import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import {
  demoAllocations,
  demoPeople,
  demoPersonSkills,
  demoSkills,
  demoSquads,
} from '@/features/seed/demoSeed'
import { SkillCoveragePanel } from './SkillCoveragePanel'

const meta = {
  title: 'Organisms/SkillCoveragePanel',
  component: SkillCoveragePanel,
  tags: ['autodocs'],
  args: {
    squad: demoSquads[0],
    sprintId: 'sp-10',
    allocations: demoAllocations,
    people: demoPeople,
    skills: demoSkills,
    personSkills: demoPersonSkills,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Cobertura das skills requeridas pela squad na sprint, separada em hard e soft. Vale o **maior nível** entre as pessoas alocadas (a % de alocação não pondera):
- **Coberta**: alguém atinge o mínimo
- **Parcial**: alguém tem a skill, mas abaixo do mínimo
- **Gap**: ninguém alocado tem

Aparece no detalhe de um grupo em \`AllocationsOverview\`.

\`\`\`tsx
<SkillCoveragePanel squad={squad} sprintId={sprint.id} allocations={…} people={…} skills={…} personSkills={…} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SkillCoveragePanel>

export default meta
type Story = StoryObj<typeof meta>

export const FrontendWebSprint10: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByText('Parcial').length).toBeGreaterThan(0)
  },
}

export const FrontendWebSprint11: Story = { args: { sprintId: 'sp-11' } }

export const Plataforma: Story = { args: { squad: demoSquads[1] } }

export const SemRequisitos: Story = { args: { squad: { id: 'x', requiredSkills: [] } } }
