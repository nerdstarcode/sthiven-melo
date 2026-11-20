import { screen, within } from '@testing-library/react'
import { loadPersonAllocations } from '@/features/location-overview/lib/personAllocationsStorage'
import { renderWithProviders } from '@/test/utils'
import { AllocationsOverview } from './AllocationsOverview'

describe('AllocationsOverview', () => {
  it('lista os grupos squad × sprint com pontos', async () => {
    renderWithProviders(<AllocationsOverview />)
    const row = await screen.findByRole('row', {
      name: 'Abrir Frontend Web em Sprint 10 - FY26-27',
    })
    // Sthiven PL 50% (5d × 1/1.5) + Ana SR 100% (10d × 1.5/2) → 20 / 27.5
    expect(within(row).getByRole('cell', { name: '20.0' })).toBeInTheDocument()
    expect(within(row).getByRole('cell', { name: '27.5' })).toBeInTheDocument()
  })

  it('abre o grupo com pessoas e cobertura de skills, e volta', async () => {
    const { user } = renderWithProviders(<AllocationsOverview />)
    await user.click(
      await screen.findByRole('row', { name: 'Abrir Frontend Web em Sprint 10 - FY26-27' }),
    )
    expect(
      screen.getByRole('heading', { name: 'Frontend Web · Sprint 10 - FY26-27' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Ana (exemplo)' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Cobertura de skills' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Voltar para alocações' }))
    expect(screen.getByRole('button', { name: 'Adicionar alocação' })).toBeInTheDocument()
  })

  it('adicionar pessoa no grupo já vem com squad e sprint e atualiza a cobertura', async () => {
    const { user } = renderWithProviders(<AllocationsOverview initialGroupKey='sq-web::sp-10' />)
    await user.click(await screen.findByRole('button', { name: 'Adicionar pessoa' }))
    const dialog = screen.getByRole('dialog')
    await user.selectOptions(within(dialog).getByLabelText('Pessoa'), 'demo-diego')
    expect(within(dialog).getByLabelText('Sprint')).toHaveValue('sp-10')
    await user.selectOptions(within(dialog).getByLabelText('Squad'), 'sq-web')
    await user.click(within(dialog).getByRole('button', { name: 'Salvar' }))

    expect(
      loadPersonAllocations().some(
        (a) => a.personId === 'demo-diego' && a.squadId === 'sq-web' && a.sprintId === 'sp-10',
      ),
    ).toBe(true)
    const tests = screen.getByText('Testes automatizados', { selector: 'span' }).closest('li')!
    expect(within(tests).getByText('Coberta')).toBeInTheDocument()
  })

  it('exclui uma alocação do grupo', async () => {
    const { user } = renderWithProviders(<AllocationsOverview initialGroupKey='sq-web::sp-10' />)
    await user.click(await screen.findByRole('button', { name: 'Excluir Ana (exemplo)' }))
    expect(screen.queryByRole('cell', { name: 'Ana (exemplo)' })).not.toBeInTheDocument()
  })

  it('mover todos leva o grupo para a nova squad e abre o grupo de destino', async () => {
    const { user } = renderWithProviders(<AllocationsOverview initialGroupKey='sq-data::sp-10' />)
    await user.click(await screen.findByRole('button', { name: 'Alterar squad de todos' }))
    const dialog = screen.getByRole('dialog')
    await user.selectOptions(within(dialog).getByLabelText('Nova squad'), 'sq-web')
    await user.click(within(dialog).getByRole('button', { name: 'Mover 1 pessoa(s)' }))

    expect(
      screen.getByRole('heading', { name: 'Frontend Web · Sprint 10 - FY26-27' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Carla (exemplo)' })).toBeInTheDocument()
  })
})
