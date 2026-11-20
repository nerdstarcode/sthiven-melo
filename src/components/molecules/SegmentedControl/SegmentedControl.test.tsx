import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentedControl } from './SegmentedControl'

const options = [
  { value: 'a', label: 'Abertas' },
  { value: 'b', label: 'Fechadas' },
]

describe('SegmentedControl', () => {
  it('marca a opção ativa com aria-pressed', () => {
    render(<SegmentedControl aria-label='Filtro' options={options} value='a' onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Abertas' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Fechadas' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('chama onChange com o valor clicado', async () => {
    const onChange = vi.fn()
    render(<SegmentedControl aria-label='Filtro' options={options} value='a' onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Fechadas' }))
    expect(onChange).toHaveBeenCalledWith('b')
  })
})
