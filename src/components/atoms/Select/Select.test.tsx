import { render, screen } from '@testing-library/react'
import { Select } from './Select'

const options = [
  { value: 'a', label: 'Opção A' },
  { value: 'b', label: 'Opção B' },
]

describe('Select', () => {
  it('renderiza as opções', () => {
    render(<Select aria-label='x' options={options} />)
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Opção A', 'Opção B'])
  })

  it('placeholder vira a primeira opção, desabilitada', () => {
    render(<Select aria-label='x' options={options} placeholder='Escolha' defaultValue='' />)
    const first = screen.getAllByRole('option')[0]
    expect(first).toHaveTextContent('Escolha')
    expect(first).toBeDisabled()
  })
})
