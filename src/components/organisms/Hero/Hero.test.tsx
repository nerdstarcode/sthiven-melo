import { screen } from '@testing-library/react'
import { CONTACT_MAILTO, RESUME_PATH } from '@/constants/social'
import { renderWithProviders } from '@/test/utils'
import { Hero } from './Hero'

describe('Hero', () => {
  it('mostra título h1 e links de currículo e contato', () => {
    renderWithProviders(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Currículo' })).toHaveAttribute('href', RESUME_PATH)
    expect(screen.getByRole('link', { name: 'Contato' })).toHaveAttribute('href', CONTACT_MAILTO)
  })

  it('traduz os textos', () => {
    renderWithProviders(<Hero />, { language: 'en' })
    expect(screen.getByRole('link', { name: 'Resume' })).toBeInTheDocument()
    expect(screen.getByAltText('Illustration of Sthiven Melo coding')).toBeInTheDocument()
  })
})
