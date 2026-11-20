import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NumberCell } from './NumberCell'

const setup = (value = 1) => {
  const onCommit = vi.fn()
  render(<NumberCell aria-label='Pontos' value={value} onCommit={onCommit} />)
  return { onCommit, input: screen.getByLabelText('Pontos') }
}

describe('NumberCell', () => {
  it('permite valores intermediários e confirma com Enter (aceita vírgula)', async () => {
    const { onCommit, input } = setup()
    await userEvent.clear(input)
    await userEvent.type(input, '2,')
    expect(input).toHaveValue('2,')
    await userEvent.type(input, '5{Enter}')
    expect(onCommit).toHaveBeenCalledExactlyOnceWith(2.5)
  })

  it('confirma ao sair do campo', async () => {
    const { onCommit, input } = setup()
    await userEvent.clear(input)
    await userEvent.type(input, '3')
    await userEvent.tab()
    expect(onCommit).toHaveBeenCalledWith(3)
  })

  it('valor inválido, vazio ou negativo volta ao original sem confirmar', async () => {
    const { onCommit, input } = setup(1.5)
    await userEvent.clear(input)
    await userEvent.tab()
    expect(input).toHaveValue('1.5')
    await userEvent.clear(input)
    await userEvent.type(input, '-2{Enter}')
    expect(input).toHaveValue('1.5')
    expect(onCommit).not.toHaveBeenCalled()
  })

  it('Esc descarta a edição', async () => {
    const { onCommit, input } = setup(1)
    await userEvent.clear(input)
    await userEvent.type(input, '9{Escape}')
    expect(input).toHaveValue('1')
    expect(onCommit).not.toHaveBeenCalled()
  })

  it('não confirma se o número não mudou', async () => {
    const { onCommit, input } = setup(2)
    await userEvent.click(input)
    await userEvent.tab()
    expect(onCommit).not.toHaveBeenCalled()
  })
})
