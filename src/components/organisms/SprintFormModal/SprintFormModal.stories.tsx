import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { demoSprints } from '@/features/seed/demoSeed'
import { EMPTY_SPRINT, SprintFormModal } from './SprintFormModal'

const meta = {
  title: 'Organisms/SprintFormModal',
  component: SprintFormModal,
  tags: ['autodocs'],
  args: { sprint: EMPTY_SPRINT, onClose: fn(), onSave: fn() },
  parameters: {
    docs: {
      description: {
        component: `Formulário de sprint (número, ano fiscal FYxx-yy, datas e dias úteis), aberto pela linha do tempo do fluxo de sprints. Os dias úteis definem quantos dias cada % de alocação representa.

\`\`\`tsx
<SprintFormModal sprint={editando} onClose={fechar} onSave={salvar} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SprintFormModal>

export default meta
type Story = StoryObj<typeof meta>

export const Nova: Story = {
  play: async ({ canvasElement, args }) => {
    const dialog = within(canvasElement.ownerDocument.body).getByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Salvar' }))
    await expect(args.onSave).not.toHaveBeenCalled()
  },
}

export const Editar: Story = { args: { sprint: demoSprints[1] } }
