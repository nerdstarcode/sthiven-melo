import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { demoSupportContext } from '@/features/seed/demoPlanning'
import { demoSprints, demoSupports } from '@/features/seed/demoSeed'
import { SprintSupports } from './SprintSupports'

const meta = {
  title: 'Organisms/SprintSupports',
  component: SprintSupports,
  tags: ['autodocs'],
  args: {
    sprint: demoSprints[1],
    previousSprint: demoSprints[0],
    supports: demoSupports.filter((s) => s.sprintId === 'sp-11'),
    context: demoSupportContext,
    onAdd: fn(() => null),
    onRemove: fn((ids: string[]) => demoSupports.filter((s) => ids.includes(s.id))),
    onRestore: fn(),
    onSetPercentage: fn(() => null),
    onCopyPrevious: fn(() => 1),
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `"Apoios da sprint", dentro do nível 2 do fluxo de sprints.
- Lista quem apoia (mentora) quem, com a % sobre a carga do apoiado.
- A % pode ser editada na própria tabela.
- Remover oferece "Desfazer".
- Dá para copiar os pares da sprint anterior.
- Apoios que deixaram de valer, como os de alguém que saiu da sprint, aparecem com aviso.

\`\`\`tsx
<SprintSupports sprint={sprint} previousSprint={anterior} supports={apoios} context={contexto} onAdd={…} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SprintSupports>

export default meta
type Story = StoryObj<typeof meta>

export const ComApoio: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remover apoio de Ana (exemplo) a Bruno (exemplo)' }),
    )
    await expect(args.onRemove).toHaveBeenCalled()
    await expect(canvas.getByRole('button', { name: 'Desfazer' })).toBeInTheDocument()
  },
}

export const ApoioInvalido: Story = {
  args: {
    supports: [{ ...demoSupports[0], supportedId: 'demo-diego' }],
  },
}

export const SemSprintAnterior: Story = { args: { previousSprint: undefined, supports: [] } }
