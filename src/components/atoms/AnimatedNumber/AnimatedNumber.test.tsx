import { render, screen } from '@testing-library/react'
import { AnimatedNumber } from './AnimatedNumber'

describe('AnimatedNumber', () => {
  it('começa em 0 antes de entrar na viewport', () => {
    render(<AnimatedNumber value={50} />)
    expect(screen.getByLabelText('50')).toHaveTextContent('0')
  })

  it('expõe o valor final para leitores de tela', () => {
    render(<AnimatedNumber value={30} />)
    expect(screen.getByLabelText('30')).toBeInTheDocument()
  })

  it('aplica className', () => {
    render(<AnimatedNumber value={3} className='text-7xl' />)
    expect(screen.getByLabelText('3')).toHaveClass('text-7xl')
  })
})
