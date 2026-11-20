import { screen, within } from '@testing-library/react'
import {
  demoAllocations,
  demoPeople,
  demoPersonSkills,
  demoSkills,
  demoSquads,
} from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { SkillCoveragePanel } from './SkillCoveragePanel'

const web = demoSquads.find((s) => s.id === 'sq-web')!

const renderPanel = (sprintId: string, squad = web) =>
  renderWithProviders(
    <SkillCoveragePanel
      squad={squad}
      sprintId={sprintId}
      allocations={demoAllocations}
      people={demoPeople}
      skills={demoSkills}
      personSkills={demoPersonSkills}
    />,
  )

const itemOf = (skill: string) => screen.getByText(skill, { selector: 'span' }).closest('li')!

describe('SkillCoveragePanel', () => {
  it('sprint 10 (sem o Diego): testes automatizados ficam parciais', () => {
    renderPanel('sp-10')
    // Ana tem React 5 (mín. 4) → coberta
    expect(within(itemOf('React')).getByText('Coberta')).toBeInTheDocument()
    // Ana tem Testes 2 (mín. 3) → parcial
    expect(within(itemOf('Testes automatizados')).getByText('Parcial')).toBeInTheDocument()
    expect(
      within(itemOf('Testes automatizados')).getByText(/Ana \(exemplo\) \(2\)/),
    ).toBeInTheDocument()
  })

  it('sprint 11 (Diego entra com Testes 5): passa a ser coberta', () => {
    renderPanel('sp-11')
    expect(within(itemOf('Testes automatizados')).getByText('Coberta')).toBeInTheDocument()
  })

  it('separa hard e soft e resume o total', () => {
    renderPanel('sp-10')
    expect(screen.getByText('Hard skills')).toBeInTheDocument()
    expect(screen.getByText('Soft skills')).toBeInTheDocument()
    expect(screen.getAllByText('4 de 5 cobertas').length).toBeGreaterThan(0)
  })

  it('gap mostra que ninguém alocado tem a skill e alerta', () => {
    renderWithProviders(
      <SkillCoveragePanel
        squad={{ id: 'sq-web', requiredSkills: [{ skillId: 'sk-k8s', minLevel: 2 }] }}
        sprintId='sp-10'
        allocations={demoAllocations}
        people={demoPeople}
        skills={demoSkills}
        personSkills={demoPersonSkills.filter((ps) => ps.skillId !== 'sk-k8s')}
      />,
    )
    expect(within(itemOf('Kubernetes')).getByText('Gap')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Ninguém alocado tem')
  })

  it('squad sem requisitos explica onde configurar', () => {
    renderPanel('sp-10', { ...web, requiredSkills: [] })
    expect(screen.getByText(/não tem skills requeridas/)).toBeInTheDocument()
  })
})
