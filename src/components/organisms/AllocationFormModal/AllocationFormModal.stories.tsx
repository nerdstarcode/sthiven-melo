import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { demoAllocations, demoPeople, demoSprints, demoSquads } from '@/features/seed/demoSeed'
import { AllocationFormModal, EMPTY_ALLOCATION } from './AllocationFormModal'

const meta = {
  title: 'Organisms/AllocationFormModal',
  component: AllocationFormModal,
  tags: ['autodocs'],
  args: {
    allocation: EMPTY_ALLOCATION,
    onClose: fn(),
    onSave: fn(),
    allocations: demoAllocations,
    people: demoPeople,
    squads: demoSquads,
    sprints: demoSprints,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Formulário de alocação: pessoa → squad (só as squads da pessoa) → sprint → porcentagem, mostrando quantos dias a % representa. Bloqueia campos vazios, % fora de 1–100 e soma acima de 100% para a pessoa na sprint. Usado em \`AllocationsOverview\`.

\`\`\`tsx
<AllocationFormModal allocation={editing} onSave={save} onClose={close} allocations={…} people={…} squads={…} sprints={…} />
\`\`\``,
      },
      story: { inline: false, iframeHeight: 520 },
    },
  },
} satisfies Meta<typeof AllocationFormModal>

export default meta
type Story = StoryObj<typeof meta>

export const Nova: Story = {}

export const AcimaDe100: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.selectOptions(canvas.getByLabelText('Pessoa'), 'demo-sthiven')
    await userEvent.selectOptions(canvas.getByLabelText('Squad'), 'sq-web')
    await userEvent.selectOptions(canvas.getByLabelText('Sprint'), 'sp-10')
    await userEvent.click(canvas.getByRole('button', { name: 'Salvar' }))
    await expect(canvas.getByRole('alert')).toBeInTheDocument()
    await expect(args.onSave).not.toHaveBeenCalled()
  },
}

export const Edicao: Story = { args: { allocation: demoAllocations[0] } }
