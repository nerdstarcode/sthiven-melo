import { screen } from '@testing-library/react'
import { demoPersonDashboard } from '@/features/seed/demoDashboard'
import { renderWithProviders } from '@/test/utils'
import { PersonMetricsView } from './PersonMetricsView'

describe('PersonMetricsView', () => {
  it('mostra o nome, os KPIs e o gráfico por sprint', async () => {
    const { row, support } = demoPersonDashboard('demo-ana')
    renderWithProviders(<PersonMetricsView row={row} support={support} />)
    expect(screen.getByRole('heading', { name: 'Ana (exemplo)' })).toBeInTheDocument()
    expect(screen.getByText('SP entregues')).toBeInTheDocument()
    expect(await screen.findByTestId('echart')).toHaveAttribute(
      'data-series',
      'No prazo|Atrasados|Em andamento|Capacity|Max',
    )
  })

  it('mostra o apoio dado', () => {
    const { row, support } = demoPersonDashboard('demo-ana')
    renderWithProviders(<PersonMetricsView row={row} support={support} />)
    expect(screen.getByText(/Apoiou: Bruno \(exemplo\)/)).toBeInTheDocument()
  })

  it('mostra quem apoiou', () => {
    const { row, support } = demoPersonDashboard('demo-bruno')
    renderWithProviders(<PersonMetricsView row={row} support={support} />)
    expect(screen.getByText('Apoiado por: Ana (exemplo)')).toBeInTheDocument()
  })

  it('o botão volta para o resumo', async () => {
    const onBack = vi.fn()
    const { row } = demoPersonDashboard('demo-carla')
    const { user } = renderWithProviders(
      <PersonMetricsView row={row} support={null} onBack={onBack} />,
    )
    expect(screen.queryByRole('region', { name: 'Apoio' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Voltar para o resumo/ }))
    expect(onBack).toHaveBeenCalled()
  })
})
