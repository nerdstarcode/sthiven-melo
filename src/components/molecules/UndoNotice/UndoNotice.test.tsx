import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UndoNotice } from './UndoNotice'

describe('UndoNotice', () => {
  it('mostra a mensagem e chama desfazer/fechar', async () => {
    const onUndo = vi.fn()
    const onClose = vi.fn()
    render(
      <UndoNotice
        message='Ana removida'
        undoLabel='Desfazer'
        closeLabel='Fechar'
        onUndo={onUndo}
        onClose={onClose}
      />,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Ana removida')
    await userEvent.click(screen.getByRole('button', { name: 'Desfazer' }))
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onUndo).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
