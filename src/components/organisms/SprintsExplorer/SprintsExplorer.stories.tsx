import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { SprintsSelection } from '@/features/location-overview/navigation'
import { DEMO_TODAY } from '@/features/seed/demoPlanning'
import { resetDemoData } from '@/features/seed/demoSeed'
import { SprintsExplorer, type SprintsExplorerProps } from './SprintsExplorer'

/** Guarda o nível em estado (na página ele fica na URL). */
function Navegavel(props: SprintsExplorerProps) {
  const [selection, setSelection] = useState<SprintsSelection>({
    sprintId: props.sprintId,
    squadId: props.squadId,
  })
  return (
    <SprintsExplorer
      {...props}
      {...selection}
      onNavigate={(next) => {
        props.onNavigate(next)
        if (!next.createPerson && !next.createSquad) setSelection(next)
      }}
    />
  )
}

const meta = {
  title: 'Organisms/SprintsExplorer',
  component: SprintsExplorer,
  tags: ['autodocs'],
  args: { onNavigate: fn(), confirm: () => true, today: DEMO_TODAY },
  beforeEach: () => resetDemoData(),
  render: (args) => <Navegavel {...args} />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Fluxo principal do Location Overview (\`/projects/location-overview/sprints\`), em três níveis:
1. **Sprints:** a linha do tempo, com a situação de cada sprint.
2. **Squads da sprint:** um card por squad com o planejado × previsto, mais os apoios da sprint.
3. **Alocação da squad:** as pessoas da squad na sprint, com edição rápida e a cobertura de skills.

A trilha "Projetos › Location Overview › Sprints › Sprint › Squad" leva de volta a qualquer nível. Na página, o nível aberto fica na URL (\`?sprint=sp-11&squad=sq-web\`).

\`\`\`tsx
<SprintsExplorer sprintId={sprintId} squadId={squadId} onNavigate={(s) => router.push(sprintsHref(s))} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SprintsExplorer>

export default meta
type Story = StoryObj<typeof meta>

export const Navegacao: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('row', { name: 'Abrir Sprint 11 - FY26-27' }))
    await userEvent.click(await canvas.findByRole('button', { name: 'Abrir Frontend Web' }))
    await expect(
      await canvas.findByRole('heading', { name: 'Frontend Web · Sprint 11 - FY26-27' }),
    ).toBeInTheDocument()
  },
}

export const SquadsDaSprint: Story = { args: { sprintId: 'sp-11' } }

export const AlocacaoDaSquad: Story = { args: { sprintId: 'sp-10', squadId: 'sq-web' } }
