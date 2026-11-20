import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { SprintAnalysis } from './SprintAnalysis'

describe('SprintAnalysis', () => {
  it('sem seleção pede para escolher sprint e squad', async () => {
    renderWithProviders(<SprintAnalysis onSelect={vi.fn()} />)
    expect(await screen.findByText('Escolha uma sprint e uma squad para ver a análise.')).toBeInTheDocument()
  })

  it('com sprint e squad mostra KPIs, gráficos, pessoas e test runs da demonstração', async () => {
    renderWithProviders(<SprintAnalysis sprintId='sp-10' squadId='sq-web' onSelect={vi.fn()} />)
    expect(await screen.findByText('100% do total')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Story points entregues por dia' })).toBeInTheDocument()
    expect(screen.getByRole('table', { name: 'Pessoas × alocação' })).toBeInTheDocument()
    expect(screen.getByText('91%')).toBeInTheDocument()
  })

  it('avisa quando a squad não tem work items na sprint', async () => {
    renderWithProviders(<SprintAnalysis sprintId='sp-12' squadId='sq-data' onSelect={vi.fn()} />)
    expect(
      await screen.findByText(/Nenhum work item desta squad nesta sprint/),
    ).toBeInTheDocument()
  })

  it('trocar a squad avisa a página mantendo a sprint', async () => {
    const onSelect = vi.fn()
    const { user } = renderWithProviders(<SprintAnalysis sprintId='sp-11' onSelect={onSelect} />)
    await user.selectOptions(await screen.findByLabelText('Squad'), 'sq-platform')
    expect(onSelect).toHaveBeenCalledWith({ sprintId: 'sp-11', squadId: 'sq-platform' })
  })
})
