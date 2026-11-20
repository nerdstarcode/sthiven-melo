import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

const renderModal = (open = true, onClose = vi.fn()) => {
  render(
    <Modal open={open} onClose={onClose} title='Editar' footer={<button>Salvar</button>}>
      <input aria-label='campo' />
    </Modal>,
  )
  return onClose
}

describe('Modal', () => {
  it('não renderiza quando fechado', () => {
    renderModal(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('o título dá nome ao diálogo e o rodapé aparece', () => {
    renderModal()
    expect(screen.getByRole('dialog', { name: 'Editar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('fecha no Esc, no × e no clique fora', async () => {
    const onClose = renderModal()
    await userEvent.keyboard('{Escape}')
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    await userEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalledTimes(3)
  })

  it('clique dentro do painel não fecha', async () => {
    const onClose = renderModal()
    await userEvent.click(screen.getByLabelText('campo'))
    expect(onClose).not.toHaveBeenCalled()
  })
})
