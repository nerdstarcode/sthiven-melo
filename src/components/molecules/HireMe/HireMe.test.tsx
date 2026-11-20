import { screen } from '@testing-library/react'
import { CONTACT_MAILTO } from '@/constants/social'
import { renderWithProviders } from '@/test/utils'
import { HireMe } from './HireMe'

describe('HireMe', () => {
  it('aponta para o e-mail de contato', () => {
    renderWithProviders(<HireMe />)
    expect(screen.getByRole('link')).toHaveAttribute('href', CONTACT_MAILTO)
  })

  it.each([
    ['pt', 'Contato'],
    ['en', 'Contact'],
    ['es', 'Contacto'],
  ] as const)('em %s mostra "%s"', (language, label) => {
    renderWithProviders(<HireMe />, { language })
    expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
  })

  it('texto do botão é claro sobre o fundo escuro', () => {
    renderWithProviders(<HireMe />)
    expect(screen.getByRole('link')).toHaveClass('text-light')
  })
})
