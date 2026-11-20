import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProficiencyRating } from './ProficiencyRating'

describe('ProficiencyRating', () => {
  it('sem onChange é um meter só de leitura', () => {
    render(<ProficiencyRating value={4} label='React' />)
    const meter = screen.getByRole('meter', { name: 'React' })
    expect(meter).toHaveAttribute('aria-valuenow', '4')
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  it('preenche os blocos até o valor', () => {
    render(<ProficiencyRating value={2} label='React' />)
    const blocks = screen.getByRole('meter').children
    expect([...blocks].map((b) => b.classList.contains('bg-accent'))).toEqual([
      true,
      true,
      false,
      false,
      false,
    ])
  })

  it('com onChange é um radio group de 1 a 5', async () => {
    const onChange = vi.fn()
    render(<ProficiencyRating value={2} label='React' onChange={onChange} />)
    expect(screen.getAllByRole('radio')).toHaveLength(5)
    expect(screen.getByRole('radio', { name: 'React: 2' })).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(screen.getByRole('radio', { name: 'React: 4' }))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('destaca o nível mínimo', () => {
    render(<ProficiencyRating value={1} label='React' minLevel={3} />)
    expect(screen.getByRole('meter').children[2]).toHaveClass('ring-warning')
  })
})
