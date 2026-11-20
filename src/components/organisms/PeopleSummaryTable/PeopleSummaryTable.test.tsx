import { screen, within } from '@testing-library/react'
import { demoPeopleSummary } from '@/features/seed/demoDashboard'
import { renderWithProviders } from '@/test/utils'
import { PeopleSummaryTable } from './PeopleSummaryTable'

describe('PeopleSummaryTable', () => {
  it('uma linha por pessoa', () => {
    renderWithProviders(<PeopleSummaryTable rows={demoPeopleSummary} onOpenPerson={vi.fn()} />)
    const table = screen.getByRole('table', { name: 'Resumo das pessoas' })
    expect(within(table).getAllByRole('row')).toHaveLength(demoPeopleSummary.length + 1)
  })

  it('clicar numa pessoa abre as métricas dela', async () => {
    const onOpenPerson = vi.fn()
    const { user } = renderWithProviders(
      <PeopleSummaryTable rows={demoPeopleSummary} onOpenPerson={onOpenPerson} />,
    )
    await user.click(screen.getByRole('row', { name: 'Ver métricas de Ana (exemplo)' }))
    expect(onOpenPerson).toHaveBeenCalledWith('demo-ana')
  })

  it('vazio mostra a mensagem', () => {
    renderWithProviders(<PeopleSummaryTable rows={[]} onOpenPerson={vi.fn()} />)
    expect(screen.getByText('Ninguém com entregas ou alocação no filtro.')).toBeInTheDocument()
  })
})
