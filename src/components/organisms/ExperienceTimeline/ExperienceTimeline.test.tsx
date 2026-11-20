import { screen } from '@testing-library/react'
import { experiences } from '@/data/experiences'
import { renderWithProviders } from '@/test/utils'
import { ExperienceTimeline } from './ExperienceTimeline'

describe('ExperienceTimeline', () => {
  it('é a âncora #experience com um item por experiência', () => {
    const { container } = renderWithProviders(<ExperienceTimeline />)
    expect(container.querySelector('section#experience')).not.toBeNull()
    expect(screen.getAllByRole('listitem')).toHaveLength(experiences.length)
  })

  it('alterna o lado da ilustração', () => {
    renderWithProviders(<ExperienceTimeline />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).not.toHaveClass('flex-row-reverse')
    expect(items[1]).toHaveClass('flex-row-reverse')
    expect(items[2]).not.toHaveClass('flex-row-reverse')
  })

  it('traduz o título', () => {
    renderWithProviders(<ExperienceTimeline />, { language: 'en' })
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument()
  })
})
