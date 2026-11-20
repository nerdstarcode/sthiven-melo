import { render, screen } from '@testing-library/react'
import { AnimatedText } from './AnimatedText'

describe('AnimatedText', () => {
  it('renderiza um h2 por padrão', () => {
    render(<AnimatedText text='Olá mundo' />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('usa a tag informada', () => {
    render(<AnimatedText Tag='h1' text='Título' />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('separa o texto em uma span por palavra', () => {
    render(<AnimatedText text='um dois três' />)
    const heading = screen.getByRole('heading')
    expect(heading.querySelectorAll('span')).toHaveLength(3)
  })

  it('mescla className com as classes padrão', () => {
    render(<AnimatedText text='x' className='text-left' />)
    expect(screen.getByRole('heading')).toHaveClass('text-left', 'font-bold')
  })

  it('não quebra sem texto', () => {
    render(<AnimatedText />)
    expect(screen.getByRole('heading')).toBeEmptyDOMElement()
  })
})
