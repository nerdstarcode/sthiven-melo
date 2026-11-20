import { screen, within } from '@testing-library/react'
import {
  demoAllocations,
  demoPeople,
  demoSprints,
  demoSquads,
} from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { NewSprintAllocationModal } from './NewSprintAllocationModal'

const allocations = demoAllocations.filter((a) => a.squadId !== 'sq-data')
const base = {
  open: true,
  onClose: vi.fn(),
  people: demoPeople,
  squads: demoSquads,
  sprints: demoSprints,
  allocations,
  onOpenGroup: vi.fn(),
}

describe('NewSprintAllocationModal', () => {
  it('traz os membros com o que sobra e salva os marcados', async () => {
    const onSave = vi.fn(() => null)
    const { user } = renderWithProviders(
      <NewSprintAllocationModal {...base} onSave={onSave} initialSquadId='sq-data' initialSprintId='sp-12' />,
    )
    const dialog = screen.getByRole('dialog', { name: 'Nova alocação de sprint' })
    // Diego tem 60% em Frontend Web na sp-12 → sobram 40%
    expect(within(dialog).getByLabelText('% de Diego (exemplo)')).toHaveValue(40)
    expect(within(dialog).getByRole('cell', { name: '60%' })).toBeInTheDocument()
    await user.click(within(dialog).getByLabelText('Alocar Carla (exemplo)'))
    await user.click(within(dialog).getByRole('button', { name: 'Alocar 1 pessoa(s)' }))
    expect(onSave).toHaveBeenCalledWith([
      { personId: 'demo-diego', squadId: 'sq-data', sprintId: 'sp-12', percentage: 40 },
    ])
  })

  it('pede squad e sprint antes de listar', () => {
    renderWithProviders(<NewSprintAllocationModal {...base} onSave={vi.fn()} />)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('mostra o erro devolvido pelo onSave', async () => {
    const { user } = renderWithProviders(
      <NewSprintAllocationModal
        {...base}
        onSave={() => 'Essa pessoa já está nesta squad na sprint.'}
        initialSquadId='sq-data'
        initialSprintId='sp-12'
      />,
    )
    await user.click(screen.getByRole('button', { name: /^Alocar 2 pessoa/ }))
    expect(screen.getByRole('alert')).toHaveTextContent('Essa pessoa já está nesta squad na sprint.')
  })
})
