import { render, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('marca aria-invalid e a borda de erro quando inválido', () => {
    render(<Input aria-label='x' invalid />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveClass('border-danger')
  })

  it('sem erro não tem aria-invalid', () => {
    render(<Input aria-label='x' />)
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })
})
