import { screen } from '@testing-library/react'
import { backendStack } from '@/data/tools'
import { renderWithProviders } from '@/test/utils'
import { BackendStackSection } from './BackendStackSection'

describe('BackendStackSection', () => {
  it('mostra a logo de cada tecnologia com alt descritivo', () => {
    renderWithProviders(<BackendStackSection />)
    for (const tool of backendStack) {
      expect(screen.getByAltText(tool.name)).toBeInTheDocument()
    }
  })

  it('aceita uma stack customizada', () => {
    renderWithProviders(<BackendStackSection stack={backendStack.slice(0, 1)} />)
    expect(screen.getByAltText(backendStack[0].name)).toBeInTheDocument()
    expect(screen.queryByAltText(backendStack[1].name)).not.toBeInTheDocument()
  })

  it('traduz os títulos', () => {
    renderWithProviders(<BackendStackSection />, { language: 'es' })
    expect(screen.getByRole('heading', { name: 'Proyectos' })).toBeInTheDocument()
    expect(screen.getByText('Y más...')).toBeInTheDocument()
  })
})
