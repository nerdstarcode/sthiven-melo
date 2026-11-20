import { screen } from '@testing-library/react'
import { DEMO_TODAY } from '@/features/seed/demoPlanning'
import { renderWithProviders } from '@/test/utils'
import { LocationDashboard } from './LocationDashboard'

describe('LocationDashboard', () => {
  it('a visão de squads mostra o gráfico por sprint', async () => {
    renderWithProviders(<LocationDashboard view='squads' onNavigate={vi.fn()} today={DEMO_TODAY} />)
    expect(await screen.findByRole('region', { name: 'Story points por sprint' })).toBeInTheDocument()
  })

  it('a visão de pessoas lista o resumo e abre uma pessoa', async () => {
    const onNavigate = vi.fn()
    const { user } = renderWithProviders(
      <LocationDashboard view='people' onNavigate={onNavigate} today={DEMO_TODAY} />,
    )
    await user.click(await screen.findByRole('row', { name: 'Ver métricas de Ana (exemplo)' }))
    expect(onNavigate).toHaveBeenCalledWith({ view: 'people', personId: 'demo-ana', squadId: undefined })
  })

  it('com a pessoa na seleção mostra as métricas dela', async () => {
    renderWithProviders(
      <LocationDashboard view='people' personId='demo-bruno' onNavigate={vi.fn()} today={DEMO_TODAY} />,
    )
    expect(await screen.findByRole('heading', { name: 'Bruno (exemplo)' })).toBeInTheDocument()
  })

  it('trocar a visão e o filtro de squad avisa a página', async () => {
    const onNavigate = vi.fn()
    const { user } = renderWithProviders(
      <LocationDashboard view='squads' onNavigate={onNavigate} today={DEMO_TODAY} />,
    )
    await user.selectOptions(await screen.findByLabelText('Squad'), 'sq-web')
    expect(onNavigate).toHaveBeenLastCalledWith({ view: 'squads', personId: undefined, squadId: 'sq-web' })
    await user.click(screen.getByRole('button', { name: 'Pessoas' }))
    expect(onNavigate).toHaveBeenLastCalledWith({ view: 'people', squadId: undefined })
  })
})
