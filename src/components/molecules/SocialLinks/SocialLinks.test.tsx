import { render, screen } from '@testing-library/react'
import { GITHUB_URL, INSTAGRAM_URL, LINKEDIN_URL } from '@/constants/social'
import { SocialLinks } from './SocialLinks'

describe('SocialLinks', () => {
  it('mostra as três redes por padrão, abrindo em nova aba', () => {
    render(<SocialLinks />)
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', INSTAGRAM_URL)
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', GITHUB_URL)
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', LINKEDIN_URL)
    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('mostra só as redes pedidas', () => {
    render(<SocialLinks networks={['github']} />)
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
  })
})
