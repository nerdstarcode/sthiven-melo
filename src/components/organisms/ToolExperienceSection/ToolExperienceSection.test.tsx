import { screen } from '@testing-library/react'
import type { ToolExperience } from '@/data/tools'
import { renderWithProviders } from '@/test/utils'
import { ToolExperienceSection } from './ToolExperienceSection'

const image = { src: '/x.png', width: 1, height: 1 }
const tools: ToolExperience[] = [
  { name: 'React', image, years: '3+', level: 'high' },
  { name: 'Vue', image, years: '1-', level: 'small' },
]

const renderSection = (side: 'left' | 'right') =>
  renderWithProviders(
    <ToolExperienceSection
      illustration={image}
      illustrationAlt='Ilustração'
      illustrationSide={side}
      tools={tools}
      toolImageClassName='rounded-full'
    />,
  )

describe('ToolExperienceSection', () => {
  it('renderiza um card por ferramenta', () => {
    renderSection('right')
    expect(screen.getByAltText('React')).toHaveClass('rounded-full')
    expect(screen.getByAltText('Vue')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Experiência' })).toBeInTheDocument()
  })

  it('ilustração à esquerda desliza para a esquerda', () => {
    renderSection('left')
    expect(screen.getByAltText('Ilustração').closest('.animate-slide-left')).not.toBeNull()
  })

  it('ilustração à direita desliza para a direita', () => {
    renderSection('right')
    expect(screen.getByAltText('Ilustração').closest('.animate-slide-right')).not.toBeNull()
  })
})
