import { render, screen } from '@testing-library/react'
import { StatItem } from './StatItem'

describe('StatItem', () => {
  it('mostra legenda, número e sufixo', () => {
    render(<StatItem value={50} label='Repositórios' />)
    expect(screen.getByRole('heading', { name: 'Repositórios' })).toBeInTheDocument()
    expect(screen.getByLabelText('50')).toBeInTheDocument()
    expect(screen.getByLabelText('50').parentElement).toHaveTextContent('+')
  })

  it('aceita sufixo vazio', () => {
    render(<StatItem value={30} label='Cursos' suffix='' />)
    expect(screen.getByLabelText('30').parentElement).not.toHaveTextContent('+')
  })

  it('aplica labelClassName sobrescrevendo o tamanho', () => {
    render(<StatItem value={3} label='Anos' labelClassName='text-sm' />)
    const label = screen.getByRole('heading', { name: 'Anos' })
    expect(label).toHaveClass('text-sm')
    expect(label).not.toHaveClass('text-xl')
  })
})
