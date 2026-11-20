import { screen } from '@testing-library/react'
import { CONTACT_MAILTO } from '@/constants/social'
import { renderWithProviders } from '@/test/utils'
import { Footer } from './Footer'

describe('Footer', () => {
  it('mostra o ano atual sem o "A" solto do código antigo', () => {
    renderWithProviders(<Footer />, { language: 'en' })
    const year = new Date().getFullYear()
    expect(screen.getByText(`${year}© All Rights Reserved.`)).toBeInTheDocument()
  })

  it('"Diga olá!" abre o e-mail de contato', () => {
    renderWithProviders(<Footer />)
    expect(screen.getByRole('link', { name: 'Diga olá!' })).toHaveAttribute('href', CONTACT_MAILTO)
  })

  it('não usa mais o fundo amber de debug', () => {
    const { container } = renderWithProviders(<Footer />)
    expect(container.querySelector('.bg-amber-50')).toBeNull()
  })
})
