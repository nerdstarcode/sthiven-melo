import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  sprintPlanSummary,
  sprintSquadPlans,
} from '@/features/location-overview/lib/sprintPlanning'
import { demoPlanBase } from '@/features/seed/demoPlanning'
import { demoSprints, demoSquads } from '@/features/seed/demoSeed'
import { SprintSquadsPlan } from './SprintSquadsPlan'

const sprint = demoSprints[1]
const mobile = { id: 'sq-mobile', name: 'Mobile' }
const squads = [...demoSquads, mobile]
const plans = sprintSquadPlans(sprint, squads, demoPlanBase)

const meta = {
  title: 'Organisms/SprintSquadsPlan',
  component: SprintSquadsPlan,
  tags: ['autodocs'],
  args: {
    sprint,
    phase: 'current',
    plans,
    summary: sprintPlanSummary(plans),
    coverage: new Map([['sq-web', { total: 4, covered: 3, partial: 1, gap: 0 }]]),
    onOpenSquad: fn(),
    onCreateDefault: fn(),
    onCreateSquad: fn(),
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Nível 2 do fluxo de sprints: um card por squad.
- Cada card compara os SP planejados com o previsto da alocação (\`PlanBar\` + \`LoadStatusChip\`).
- Os cards vão de quem está mais acima do previsto para baixo.
- Squad sem alocação mostra "Criar alocação padrão".
- O \`children\` recebe os apoios da sprint.

\`\`\`tsx
<SprintSquadsPlan sprint={sprint} phase='current' plans={plans} summary={summary} onOpenSquad={abrir} onCreateDefault={criar}>
  <SprintSupports … />
</SprintSquadsPlan>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SprintSquadsPlan>

export default meta
type Story = StoryObj<typeof meta>

export const Sprint11: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Abrir Frontend Web' }))
    await expect(args.onOpenSquad).toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Criar alocação padrão' }))
    await expect(args.onCreateDefault).toHaveBeenCalledWith(mobile)
  },
}

export const SemSquads: Story = { args: { plans: [], summary: sprintPlanSummary([]) } }
