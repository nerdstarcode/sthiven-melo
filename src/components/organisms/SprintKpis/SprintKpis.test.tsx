import { screen } from '@testing-library/react'
import { demoSprintMetrics } from '@/features/seed/demoPlanning'
import { renderWithProviders } from '@/test/utils'
import { SprintKpis } from './SprintKpis'

describe('SprintKpis', () => {
  it('mostra os story points, as entregas e os test runs', () => {
    const metrics = demoSprintMetrics('sp-10')
    renderWithProviders(<SprintKpis metrics={metrics} workItemsCount={4} />)
    expect(screen.getByText('4 work item(s)')).toBeInTheDocument()
    expect(screen.getByText('100% do total')).toBeInTheDocument()
    expect(screen.getByText('86 testes executados')).toBeInTheDocument()
  })

  it('sem alocação nem testes mostra traço', () => {
    const metrics = {
      ...demoSprintMetrics('sp-11'),
      testRuns: null,
      sprintAllocation: { entries: [], capacity: 0, max: 0, missingLevel: 0 },
    }
    renderWithProviders(<SprintKpis metrics={metrics} workItemsCount={0} />)
    expect(screen.getAllByText('—')).toHaveLength(3)
    expect(screen.getAllByText('Sem alocação cadastrada')).toHaveLength(2)
  })

  it('avisa quando os pontos passam do Max', () => {
    const base = demoSprintMetrics('sp-11')
    const metrics = { ...base, sprintAllocation: { ...base.sprintAllocation, max: 1 } }
    renderWithProviders(<SprintKpis metrics={metrics} workItemsCount={6} />)
    expect(screen.getByRole('status')).toHaveTextContent('Acima do Max')
  })
})
