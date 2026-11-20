import { screen, within } from '@testing-library/react'
import { loadPersonAllocations } from '@/features/location-overview/lib/personAllocationsStorage'
import { renderWithProviders } from '@/test/utils'
import { AllocationsOverview } from './AllocationsOverview'

describe('AllocationsOverview', () => {
  it('lista os grupos squad × sprint com pontos', async () => {
    renderWithProviders(<AllocationsOverview onOpenGroup={vi.fn()} />)
    const row = await screen.findByRole('row', {
      name: 'Abrir Frontend Web em Sprint 10 - FY26-27',
    })
    // Sthiven PL 50% (5d × 1/1.5) + Ana SR 100% (10d × 1.5/2) → 20 / 27.5; 21 SP de exemplo
    expect(within(row).getByRole('cell', { name: '20.0' })).toBeInTheDocument()
    expect(within(row).getByRole('cell', { name: '27.5' })).toBeInTheDocument()
    expect(within(row).getByRole('cell', { name: '21' })).toBeInTheDocument()
  })

  it('clicar num grupo pede para abrir squad + sprint', async () => {
    const onOpenGroup = vi.fn()
    const { user } = renderWithProviders(<AllocationsOverview onOpenGroup={onOpenGroup} />)
    await user.click(
      await screen.findByRole('row', { name: 'Abrir Plataforma em Sprint 11 - FY26-27' }),
    )
    expect(onOpenGroup).toHaveBeenCalledWith('sq-platform', 'sp-11')
  })

  it('nova alocação de sprint traz os membros da squad com o que sobra e abre o grupo', async () => {
    const onOpenGroup = vi.fn()
    const { user } = renderWithProviders(<AllocationsOverview onOpenGroup={onOpenGroup} />)
    await user.click(await screen.findByRole('button', { name: 'Nova alocação de sprint' }))
    const dialog = screen.getByRole('dialog', { name: 'Nova alocação de sprint' })
    await user.selectOptions(within(dialog).getByLabelText('Squad'), 'sq-data')
    await user.selectOptions(within(dialog).getByLabelText('Sprint'), 'sp-11')
    // Carla já está em Dados na sp-11; Diego (membro por causa da sp-12) tem 0% usado → 100%
    expect(within(dialog).getByText(/Dados já tem 1 pessoa/)).toBeInTheDocument()
    expect(within(dialog).getByLabelText('% de Diego (exemplo)')).toHaveValue(0)
    expect(within(dialog).getByLabelText('Alocar Diego (exemplo)')).not.toBeChecked()

    await user.selectOptions(within(dialog).getByLabelText('Incluir outra pessoa'), 'demo-bruno')
    const bruno = within(dialog).getByLabelText('% de Bruno (exemplo)')
    expect(bruno).toHaveValue(0)
    await user.clear(bruno)
    await user.type(bruno, '20')
    expect(within(dialog).getByText(/já tem 100% em outras squads/)).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Alocar 1 pessoa(s)' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Ajuste as % marcadas em vermelho.')
    expect(onOpenGroup).not.toHaveBeenCalled()
    expect(loadPersonAllocations().some((a) => a.personId === 'demo-bruno' && a.squadId === 'sq-data')).toBe(false)
  })
})
