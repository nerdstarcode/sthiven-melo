import { render, screen } from '@testing-library/react'
import { Container } from './Container'

describe('Container', () => {
  it('renderiza os filhos', () => {
    render(<Container>conteúdo</Container>)
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('aplica o padding padrão', () => {
    render(<Container>x</Container>)
    expect(screen.getByText('x')).toHaveClass('p-8', 'md:p-32')
  })

  it('className sobrescreve classes conflitantes', () => {
    render(<Container className='p-4'>x</Container>)
    const el = screen.getByText('x')
    expect(el).toHaveClass('p-4')
    expect(el).not.toHaveClass('p-8')
  })
})
