import { screen, within } from '@testing-library/react'
import { demoSprintMetrics } from '@/features/seed/demoPlanning'
import { renderWithProviders } from '@/test/utils'
import { SprintPeopleTable } from './SprintPeopleTable'

describe('SprintPeopleTable', () => {
  it('lista as pessoas com a alocação e a situação', () => {
    const { allocation } = demoSprintMetrics('sp-11')
    renderWithProviders(<SprintPeopleTable rows={allocation} />)
    const table = screen.getByRole('table', { name: 'Pessoas × alocação' })
    expect(within(table).getAllByRole('row')).toHaveLength(allocation.length + 1)
    expect(within(table).getByText('Ana (exemplo)')).toBeInTheDocument()
  })

  it('mostra traço para quem não tem alocação', () => {
    renderWithProviders(
      <SprintPeopleTable
        rows={[
          {
            name: 'Fulano',
            email: 'f@x.dev',
            isMember: false,
            isQa: false,
            percentage: null,
            capacity: 0,
            max: 0,
            assigned: 3,
            delivered: 0,
            expectedMin: null,
            expectedMax: null,
            status: 'sem-cadastro',
          },
        ]}
      />,
    )
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByText('Sem cadastro')).toBeInTheDocument()
  })

  it('vazio mostra a mensagem', () => {
    renderWithProviders(<SprintPeopleTable rows={[]} />)
    expect(screen.getByText('Ninguém com story points ou alocação nesta sprint.')).toBeInTheDocument()
  })
})
