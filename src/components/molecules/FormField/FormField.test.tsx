import { render, screen } from '@testing-library/react'
import { SelectField, TextField } from './FormField'

describe('TextField', () => {
  it('liga o rótulo ao campo', () => {
    render(<TextField label='Nome' />)
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
  })

  it('a dica vira a descrição acessível', () => {
    render(<TextField label='Nome' hint='Nome completo' />)
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription('Nome completo')
  })

  it('o erro substitui a dica e marca o campo inválido', () => {
    render(<TextField label='Nome' hint='dica' error='Obrigatório' />)
    const input = screen.getByLabelText('Nome')
    expect(input).toHaveAccessibleDescription('Obrigatório')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByText('dica')).not.toBeInTheDocument()
  })
})

describe('SelectField', () => {
  it('liga o rótulo ao select e mostra o erro', () => {
    render(
      <SelectField
        label='Squad'
        options={[{ value: 'a', label: 'A' }]}
        error='Escolha uma squad'
      />,
    )
    const select = screen.getByLabelText('Squad')
    expect(select.tagName).toBe('SELECT')
    expect(select).toHaveAccessibleDescription('Escolha uma squad')
  })
})
