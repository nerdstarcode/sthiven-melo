import { screen, within } from '@testing-library/react'
import { DEFAULT_AZURE_CONFIG } from '@/features/location-overview/lib/azure/azureConfigStorage'
import { squadDeliveryBySprint } from '@/features/location-overview/lib/squadDelivery'
import { demoSprints, demoSquads, demoWorkItems } from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { SquadsDeliveryChart } from './SquadsDeliveryChart'

const deliveries = squadDeliveryBySprint(
  demoSprints,
  demoSquads,
  demoWorkItems,
  DEFAULT_AZURE_CONFIG.pointTypes,
)

describe('SquadsDeliveryChart', () => {
  it('tem uma série por squad mais o planejado', async () => {
    renderWithProviders(<SquadsDeliveryChart deliveries={deliveries} />)
    expect(await screen.findByTestId('echart')).toHaveAttribute(
      'data-series',
      'Frontend Web|Plataforma|Dados|Planejado',
    )
  })

  it('a tabela mostra entregue / planejado por sprint', () => {
    renderWithProviders(<SquadsDeliveryChart deliveries={deliveries} />)
    const table = screen.getByRole('table', { name: 'Entregues / Planejado' })
    expect(within(table).getAllByRole('row')).toHaveLength(deliveries.length + 1)
    expect(within(table).getAllByText('21 / 21').length).toBeGreaterThan(0)
  })

  it('sem sprints mostra a mensagem de vazio', () => {
    renderWithProviders(<SquadsDeliveryChart deliveries={[]} />)
    expect(screen.getByText('Nenhuma sprint cadastrada.')).toBeInTheDocument()
  })
})
