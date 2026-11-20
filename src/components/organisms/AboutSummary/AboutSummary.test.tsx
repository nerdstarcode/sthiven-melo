import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { AboutSummary } from './AboutSummary'

describe('AboutSummary', () => {
  it('mostra biografia, foto e os três números', () => {
    renderWithProviders(<AboutSummary />)
    expect(screen.getByRole('heading', { name: 'Biografia' })).toBeInTheDocument()
    expect(screen.getByAltText('Foto de Sthiven Melo')).toBeInTheDocument()
    expect(screen.getByLabelText('50')).toBeInTheDocument()
    expect(screen.getByLabelText('30')).toBeInTheDocument()
    expect(screen.getByLabelText('3')).toBeInTheDocument()
  })

  it('quebra a biografia completa em um parágrafo por linha', () => {
    const { container } = renderWithProviders(<AboutSummary />, { language: 'en' })
    expect(container.querySelectorAll('.hidden.md\\:block > p')).toHaveLength(2)
  })
})
