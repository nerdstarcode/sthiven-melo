import { render, screen } from '@testing-library/react'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('mostra rótulo, valor e dica', () => {
    render(<StatCard label='Pessoas' value={5} hint='na sprint' />)
    expect(screen.getByText('Pessoas')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('na sprint')).toBeInTheDocument()
  })

  it('o alerta aparece como status', () => {
    render(<StatCard label='Gaps' value={1} alert='Atenção' />)
    expect(screen.getByRole('status')).toHaveTextContent('Atenção')
  })

  it('sem alerta não há status', () => {
    render(<StatCard label='Gaps' value={0} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
