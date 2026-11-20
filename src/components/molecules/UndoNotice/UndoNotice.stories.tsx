import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { UndoNotice } from './UndoNotice'

const meta = {
  title: 'Molecules/UndoNotice',
  component: UndoNotice,
  tags: ['autodocs'],
  args: {
    message: 'Ana (exemplo) removido(a)',
    undoLabel: 'Desfazer',
    closeLabel: 'Fechar',
    onUndo: fn(),
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        component: `Aviso exibido depois de uma remoção (alocação ou apoio), com o botão "Desfazer".

\`\`\`tsx
<UndoNotice message='Ana removida' undoLabel='Desfazer' closeLabel='Fechar' onUndo={restaurar} onClose={fechar} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof UndoNotice>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Desfazer' }))
    await expect(args.onUndo).toHaveBeenCalled()
  },
}
