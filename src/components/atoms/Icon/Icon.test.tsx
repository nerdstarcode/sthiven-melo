import { render } from '@testing-library/react'
import * as Icons from '.'

const iconEntries = Object.entries(Icons).filter(([, value]) => typeof value === 'function') as [
  string,
  (props: Icons.IconProps) => React.JSX.Element,
][]

describe('Icon', () => {
  it.each(iconEntries)('%s renderiza um <svg> com largura total por padrão', (_, Icon) => {
    const { container } = render(<Icon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-full', 'h-auto')
  })

  it.each(iconEntries)('%s aceita className sobrescrevendo a largura', (_, Icon) => {
    const { container } = render(<Icon className='w-6' />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-6')
    expect(svg).not.toHaveClass('w-full')
  })

  it('repassa atributos do svg', () => {
    const { container } = render(<Icons.GithubIcon aria-label='GitHub' />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-label', 'GitHub')
  })
})
