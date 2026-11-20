import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { PageLayout } from './PageLayout'

describe('PageLayout', () => {
  it('envolve o conteúdo em um único <main> entre header e footer', () => {
    renderWithProviders(
      <PageLayout>
        <p>conteúdo</p>
      </PageLayout>,
    )
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('main')).toHaveTextContent('conteúdo')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('aplica className extra (variável da fonte) na raiz', () => {
    // next/font gera algo como `__variable_a1b2c3`
    const { container } = renderWithProviders(
      <PageLayout className='__variable_a1b2c3'>x</PageLayout>,
    )
    expect(container.firstChild).toHaveClass('__variable_a1b2c3', 'font-mont')
  })
})
