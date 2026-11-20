import { screen, within } from '@testing-library/react'
import { loadPeople } from '@/features/location-overview/lib/peopleStorage'
import { loadPersonAllocations } from '@/features/location-overview/lib/personAllocationsStorage'
import { loadSquads } from '@/features/location-overview/lib/squadsStorage'
import { renderWithProviders } from '@/test/utils'
import { SquadsManager } from './SquadsManager'

const rowOf = (name: string) => screen.getByRole('cell', { name }).closest('tr')!

describe('SquadsManager', () => {
  it('lista squads com nº de membros e skills requeridas', async () => {
    renderWithProviders(<SquadsManager />)
    expect(await screen.findByRole('cell', { name: 'Frontend Web' })).toBeInTheDocument()
    const row = within(rowOf('Frontend Web'))
    expect(row.getByRole('cell', { name: '3' })).toBeInTheDocument() // Sthiven, Ana, Diego
    expect(row.getByText('React ≥4')).toBeInTheDocument()
  })

  it('cria squad com alias, membros e skill requerida', async () => {
    const { user } = renderWithProviders(<SquadsManager />)
    await user.click(await screen.findByRole('button', { name: 'Adicionar squad' }))
    await user.type(screen.getByLabelText('Nome'), 'Mobile')
    await user.type(screen.getByLabelText('Nomes alternativos'), 'App, mobile, App')
    await user.click(screen.getByLabelText('Ana (exemplo)'))
    await user.selectOptions(screen.getByLabelText('Adicionar requisito'), 'sk-react')
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    const squad = loadSquads().find((s) => s.name === 'Mobile')!
    expect(squad.aliases).toEqual(['App'])
    expect(squad.requiredSkills).toEqual([{ skillId: 'sk-react', minLevel: 3 }])
    expect(loadPeople().find((p) => p.id === 'demo-ana')!.squadIds).toContain(squad.id)
  })

  it('não aceita nome que já é de outra squad (inclusive alias)', async () => {
    const { user } = renderWithProviders(<SquadsManager />)
    await user.click(await screen.findByRole('button', { name: 'Adicionar squad' }))
    await user.type(screen.getByLabelText('Nome'), 'Novo')
    await user.type(screen.getByLabelText('Nomes alternativos'), 'dados')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription(
      '"dados" já é nome da squad Dados. Use "Mesclar" para juntar as duas.',
    )
  })

  it('excluir desvincula os membros', async () => {
    const { user } = renderWithProviders(<SquadsManager confirm={() => true} />)
    await user.click(await screen.findByRole('button', { name: 'Excluir Dados' }))
    expect(loadSquads().some((s) => s.id === 'sq-data')).toBe(false)
    expect(loadPeople().some((p) => p.squadIds.includes('sq-data'))).toBe(false)
  })

  it('mescla Dados em Plataforma e mostra o resumo', async () => {
    const { user } = renderWithProviders(<SquadsManager />)
    await user.click(await screen.findByRole('button', { name: 'Mesclar Dados em outra squad' }))
    const dialog = screen.getByRole('dialog', { name: 'Mesclar Dados' })
    await user.click(within(dialog).getByRole('button', { name: 'Mesclar' }))
    expect(within(dialog).getByLabelText('Squad principal')).toHaveAccessibleDescription(
      'Escolha a squad principal.',
    )
    await user.selectOptions(within(dialog).getByLabelText('Squad principal'), 'sq-platform')
    await user.click(within(dialog).getByRole('button', { name: 'Mesclar' }))

    expect(screen.getByRole('status')).toHaveTextContent('Dados mesclada em Plataforma')
    expect(loadSquads().find((s) => s.id === 'sq-platform')!.aliases).toEqual(['Dados'])
    expect(loadPersonAllocations().some((a) => a.squadId === 'sq-data')).toBe(false)
  })
})
