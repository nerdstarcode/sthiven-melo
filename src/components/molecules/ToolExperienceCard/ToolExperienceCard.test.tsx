import { screen } from '@testing-library/react'
import type { ToolExperience } from '@/data/tools'
import { renderWithProviders } from '@/test/utils'
import { ToolExperienceCard } from './ToolExperienceCard'

const tool: ToolExperience = {
  name: 'React',
  image: { src: '/react.png', width: 1, height: 1 },
  years: '3+',
  level: 'high',
}

describe('ToolExperienceCard', () => {
  it('mostra logo com alt igual ao nome da ferramenta', () => {
    renderWithProviders(<ToolExperienceCard tool={tool} />)
    expect(screen.getByAltText('React')).toBeInTheDocument()
  })

  it('traduz anos e nível em português', () => {
    renderWithProviders(<ToolExperienceCard tool={tool} />, { language: 'pt' })
    expect(screen.getByText('3+ anos')).toBeInTheDocument()
    expect(screen.getByText('Domínio: avançado')).toBeInTheDocument()
  })

  it('traduz anos e nível em inglês', () => {
    renderWithProviders(<ToolExperienceCard tool={tool} />, { language: 'en' })
    expect(screen.getByText('3+ years')).toBeInTheDocument()
    expect(screen.getByText('Expertise: high')).toBeInTheDocument()
  })

  it('aplica imageClassName na logo', () => {
    renderWithProviders(<ToolExperienceCard tool={tool} imageClassName='rounded-full' />)
    expect(screen.getByAltText('React')).toHaveClass('rounded-full', 'w-20')
  })
})
