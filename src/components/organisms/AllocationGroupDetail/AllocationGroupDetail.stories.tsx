import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { DEFAULT_LEVELS } from '@/features/location-overview/lib/levelsStorage'
import { squadSprintPlan } from '@/features/location-overview/lib/sprintPlanning'
import { demoPlanBase, demoSupportContext } from '@/features/seed/demoPlanning'
import {
  demoAllocations,
  demoPeople,
  demoSprints,
  demoSquads,
  demoSupports,
  demoWorkItems,
} from '@/features/seed/demoSeed'
import { AllocationGroupDetail } from './AllocationGroupDetail'

const squad = demoSquads[0]
const sprint = demoSprints[0]
const plan = squadSprintPlan(squad, sprint, demoPlanBase)

const meta = {
  title: 'Organisms/AllocationGroupDetail',
  component: AllocationGroupDetail,
  tags: ['autodocs'],
  args: {
    squad,
    sprint,
    entries: plan.entries,
    allocations: demoAllocations,
    people: demoPeople,
    squads: demoSquads,
    levels: DEFAULT_LEVELS,
    workItems: demoWorkItems,
    summary: { capacityPoints: plan.capacity, maxPoints: plan.max, storyPoints: plan.plannedPoints },
    onAdd: fn(() => null),
    onRemove: fn((ids: string[]) => demoAllocations.filter((a) => ids.includes(a.id))),
    onRestore: fn(),
    onSetPercentage: fn(() => null),
    onMove: fn(() => null),
    onEdit: fn(),
    onCreatePerson: fn(),
    support: { supports: demoSupports, context: demoSupportContext, onAdd: fn(() => null) },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Nível 3 do fluxo de sprints: a alocação de uma squad numa sprint.
- **Adicionar:** pela linha do topo, já com a % que sobra para a pessoa; ou "Adicionar membros da squad" para puxar quem falta.
- **Editar:** a % muda na própria tabela.
- **Remover:** com "Desfazer".
- **Mover:** todos do grupo vão para outra squad.
- **Apoios:** cadastrados pela linha (ícone de coração), com a coluna "Apoio" mostrando quem apoia quem.

O \`children\` recebe a cobertura de skills.

\`\`\`tsx
<AllocationGroupDetail squad={squad} sprint={sprint} entries={entries} … >
  <SkillCoveragePanel … />
</AllocationGroupDetail>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AllocationGroupDetail>

export default meta
type Story = StoryObj<typeof meta>

export const FrontendWebSprint10: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Apoia Bruno (exemplo) (25%)')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Remover Ana (exemplo)' }))
    await expect(args.onRemove).toHaveBeenCalled()
    await expect(canvas.getByRole('button', { name: 'Desfazer' })).toBeInTheDocument()
  },
}

export const SemPessoas: Story = { args: { entries: [], support: undefined } }
