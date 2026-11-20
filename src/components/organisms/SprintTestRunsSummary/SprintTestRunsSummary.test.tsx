import { screen, within } from '@testing-library/react'
import { demoTestRuns } from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { SprintTestRunsSummary } from './SprintTestRunsSummary'

const summary = demoTestRuns[0].summary

describe('SprintTestRunsSummary', () => {
  it('mostra os totais e a taxa de aprovação', () => {
    renderWithProviders(<SprintTestRunsSummary summary={summary} />)
    expect(screen.getByText('Automatizados: 4 · Manuais: 5')).toBeInTheDocument()
    // 74 passaram de 81 executados
    expect(screen.getByText('91%')).toBeInTheDocument()
  })

  it('lista os resultados e o gráfico por dia', () => {
    renderWithProviders(<SprintTestRunsSummary summary={summary} />)
    const results = screen.getByLabelText('Resultados dos testes')
    expect(within(results).getByText('Não executados')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Runs por dia' })).toBeInTheDocument()
  })

  it('sem resumo explica de onde vêm os test runs', () => {
    renderWithProviders(<SprintTestRunsSummary summary={null} />)
    expect(screen.getByText(/vêm da sincronização com o Azure DevOps/)).toBeInTheDocument()
  })
})
