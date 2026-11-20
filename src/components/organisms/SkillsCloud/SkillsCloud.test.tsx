import { screen } from '@testing-library/react'
import { skills } from '@/data/skills'
import { renderWithProviders } from '@/test/utils'
import { SkillsCloud } from './SkillsCloud'

describe('SkillsCloud', () => {
  it('é a âncora #skills', () => {
    const { container } = renderWithProviders(<SkillsCloud />)
    expect(container.querySelector('section#skills')).not.toBeNull()
  })

  it('renderiza uma bolha por skill', () => {
    renderWithProviders(<SkillsCloud />)
    for (const skill of skills) {
      expect(screen.getByText(skill.name)).toBeInTheDocument()
    }
  })

  it('aceita lista customizada', () => {
    renderWithProviders(<SkillsCloud skills={[{ name: 'Go', x: '0', y: '0' }]} />)
    expect(screen.getByText('Go')).toBeInTheDocument()
    expect(screen.queryByText('NestJS')).not.toBeInTheDocument()
  })
})
