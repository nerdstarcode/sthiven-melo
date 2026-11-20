import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '@/components/atoms/Button'
import { Modal } from './Modal'

const meta = {
  title: 'Molecules/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    open: true,
    onClose: fn(),
    title: 'Nova alocação',
    children: <p className='text-sm text-fg'>Conteúdo do formulário.</p>,
    footer: (
      <>
        <Button variant='secondary'>Cancelar</Button>
        <Button>Salvar</Button>
      </>
    ),
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Diálogo dos formulários dos apps. Fecha no Esc, no "×" ou ao clicar fora do painel. O título dá nome ao \`role="dialog"\`.

\`\`\`tsx
<Modal open={open} onClose={close} title='Editar pessoa' footer={actions}>…</Modal>
\`\`\``,
      },
      story: { inline: false, iframeHeight: 320 },
    },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Aberto: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('dialog', { name: 'Nova alocação' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Fechar' }))
    await expect(args.onClose).toHaveBeenCalledTimes(1)
  },
}

export const SemRodape: Story = { args: { footer: undefined } }
