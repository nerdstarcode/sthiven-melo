import { render, screen } from '@testing-library/react'
import { SkillBubble } from './SkillBubble'

describe('SkillBubble', () => {
  it('mostra o nome da skill', () => {
    render(<SkillBubble name='React' />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('usa "Web" quando nenhum nome é informado', () => {
    render(<SkillBubble />)
    expect(screen.getByText('Web')).toBeInTheDocument()
  })

  it('usa peso de fonte semibold (corrige o antigo typo dont-semibold)', () => {
    render(<SkillBubble name='Vue' />)
    expect(screen.getByText('Vue')).toHaveClass('font-semibold')
  })
})
