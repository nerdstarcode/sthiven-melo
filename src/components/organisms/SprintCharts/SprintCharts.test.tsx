import { screen, within } from '@testing-library/react'
import { demoSprintMetrics } from '@/features/seed/demoPlanning'
import { renderWithProviders } from '@/test/utils'
import { SprintCharts } from './SprintCharts'

describe('SprintCharts', () => {
  it('mostra os três gráficos com as séries traduzidas', async () => {
    renderWithProviders(<SprintCharts metrics={demoSprintMetrics('sp-11')} />)
    const burnup = screen.getByRole('region', { name: 'Story points entregues por dia' })
    expect(await within(burnup).findByTestId('echart')).toHaveAttribute(
      'data-series',
      'Entregues no dia|Acumulado|Ideal|Escopo',
    )
    expect(screen.getByRole('img', { name: 'Story points por tipo' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Story points por estado' })).toBeInTheDocument()
  })

  it('sem dados mostra a mensagem de vazio', () => {
    renderWithProviders(<SprintCharts metrics={{ burnup: [], byType: [], byState: [] }} />)
    expect(screen.getAllByText('Sem dados para o gráfico.')).toHaveLength(3)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('traduz as séries em inglês', async () => {
    renderWithProviders(<SprintCharts metrics={demoSprintMetrics('sp-10')} />, { language: 'en' })
    expect(screen.getByRole('region', { name: 'Story points by type' })).toBeInTheDocument()
    const [burnup] = await screen.findAllByTestId('echart')
    expect(burnup.getAttribute('data-series')).toContain('Cumulative')
  })
})
