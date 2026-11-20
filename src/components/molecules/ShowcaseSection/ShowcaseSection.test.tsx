import { render, screen } from '@testing-library/react'
import { ShowcaseSection } from './ShowcaseSection'

const renderSection = (props: Partial<Parameters<typeof ShowcaseSection>[0]> = {}) =>
  render(
    <ShowcaseSection id='demo' title='Título' description='Descrição' {...props}>
      <div data-testid='demo' />
    </ShowcaseSection>,
  )

describe('ShowcaseSection', () => {
  it('mostra título, descrição e demonstração', () => {
    renderSection()
    expect(screen.getByRole('heading', { name: 'Título' })).toBeInTheDocument()
    expect(screen.getByText('Descrição')).toBeInTheDocument()
    expect(screen.getByTestId('demo')).toBeInTheDocument()
  })

  it('demo à direita por padrão; à esquerda inverte a ordem', () => {
    const { container, rerender } = renderSection()
    expect(container.querySelector('section')).not.toHaveClass('flex-row-reverse')
    rerender(
      <ShowcaseSection title='T' description='D' demoSide='left'>
        <div />
      </ShowcaseSection>,
    )
    expect(container.querySelector('section')).toHaveClass('flex-row-reverse')
  })

  it('aplica a cor de destaque no título', () => {
    renderSection({ accentClassName: 'group-hover:text-blue-500' })
    expect(screen.getByRole('heading')).toHaveClass('group-hover:text-blue-500')
  })
})
