import { screen } from '@testing-library/react'
import { skillsOfPerson } from '@/features/skills/lib/skillsStorage'
import { demoPersonSkills, demoSkills, OWNER_PERSON_ID } from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { SkillsRadar } from './SkillsRadar'

const ownerProfile = skillsOfPerson(OWNER_PERSON_ID, demoPersonSkills, demoSkills)

describe('SkillsRadar', () => {
  it('mostra um radar por tipo com o resumo', async () => {
    renderWithProviders(<SkillsRadar profile={ownerProfile} />)
    expect(screen.getByRole('img', { name: 'Hard skills' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Soft skills' })).toBeInTheDocument()
    expect(await screen.findAllByTestId('echart')).toHaveLength(2)
    expect(screen.getByText(/Hard skills · \d+ skill\(s\) · média/)).toBeInTheDocument()
  })

  it('com menos de 3 skills de um tipo explica em vez de desenhar', () => {
    renderWithProviders(<SkillsRadar profile={ownerProfile.slice(0, 1)} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getAllByText('Adicione ao menos 3 skills de um tipo para ver o radar.')).toHaveLength(2)
  })
})
