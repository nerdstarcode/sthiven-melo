import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  demoAllocations,
  demoPeople,
  demoSprints,
  demoSquads,
} from '@/features/seed/demoSeed'
import { NewSprintAllocationModal } from './NewSprintAllocationModal'

const allocations = demoAllocations.filter((a) => a.squadId !== 'sq-data')

const meta = {
  title: 'Organisms/NewSprintAllocationModal',
  component: NewSprintAllocationModal,
  tags: ['autodocs'],
  args: {
    open: true,
    onClose: fn(),
    people: demoPeople,
    squads: demoSquads,
    sprints: demoSprints,
    allocations,
    onSave: fn(() => null),
    onOpenGroup: fn(),
    initialSquadId: 'sq-data',
    initialSprintId: 'sp-12',
  },
  parameters: {
    docs: {
      description: {
        component: `"Nova alocação de sprint" (ou "Criar alocação padrão" num card de squad vazia).
- Traz os membros da squad com o que sobra para cada um na sprint.
- Quem já está 100% em outras squads vem desmarcado.
- A % de cada pessoa pode ser ajustada.
- Dá para incluir alguém de fora da squad.
- Salva todos de uma vez.

\`\`\`tsx
<NewSprintAllocationModal open initialSquadId='sq-data' initialSprintId='sp-12' people={…} squads={…} sprints={…} allocations={…} onSave={…} onOpenGroup={…} onClose={…} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof NewSprintAllocationModal>

export default meta
type Story = StoryObj<typeof meta>

export const AlocacaoPadrao: Story = {
  play: async ({ canvasElement, args }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: /^Alocar 2 pessoa/ }))
    await expect(args.onSave).toHaveBeenCalled()
  },
}

export const EscolherSquadESprint: Story = { args: { initialSquadId: '', initialSprintId: '' } }
