import { screen, within } from '@testing-library/react'
import { DEFAULT_LEVELS } from '@/features/location-overview/lib/levelsStorage'
import { squadSprintPlan } from '@/features/location-overview/lib/sprintPlanning'
import { demoPlanBase, demoSupportContext } from '@/features/seed/demoPlanning'
import {
  demoAllocations,
  demoPeople,
  demoSprints,
  demoSquads,
  demoSupports,
  demoWorkItems,
} from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { AllocationGroupDetail } from './AllocationGroupDetail'

const squad = demoSquads[0]
const sprint = demoSprints[0]
const plan = squadSprintPlan(squad, sprint, demoPlanBase)

const setup = (overrides: Partial<Parameters<typeof AllocationGroupDetail>[0]> = {}) => {
  const props = {
    squad,
    sprint,
    entries: plan.entries,
    allocations: demoAllocations,
    people: demoPeople,
    squads: demoSquads,
    levels: DEFAULT_LEVELS,
    workItems: demoWorkItems,
    summary: { capacityPoints: plan.capacity, maxPoints: plan.max, storyPoints: plan.plannedPoints },
    onAdd: vi.fn(() => null),
    onRemove: vi.fn(() => [plan.entries[0]]),
    onRestore: vi.fn(),
    onSetPercentage: vi.fn((): string | null => null),
    onMove: vi.fn(() => null),
    onEdit: vi.fn(),
    support: {
      supports: demoSupports,
      context: demoSupportContext,
      onAdd: vi.fn(() => null),
    },
    ...overrides,
  }
  return { props, ...renderWithProviders(<AllocationGroupDetail {...props} />) }
}

describe('AllocationGroupDetail', () => {
  it('mostra os números das pessoas e quem apoia quem', () => {
    setup()
    const ana = screen.getByRole('cell', { name: 'Ana (exemplo)' }).closest('tr')!
    expect(within(ana).getByRole('cell', { name: '15.0' })).toBeInTheDocument()
    expect(within(ana).getByText('Apoia Bruno (exemplo) (25%)')).toBeInTheDocument()
    expect(screen.getByText('2 pessoa(s) · 150% somados')).toBeInTheDocument()
  })

  it('a linha do topo sugere a % que sobra e oferece membros primeiro', async () => {
    const { props, user } = setup()
    const select = screen.getByLabelText('Pessoa para adicionar')
    const options = within(select).getAllByRole('option').map((o) => o.textContent)
    expect(options.slice(1)).toEqual([
      'Diego (exemplo)',
      'Bruno (exemplo) (fora da squad)',
      'Carla (exemplo) (fora da squad)',
    ])
    await user.selectOptions(select, 'demo-carla')
    expect(screen.getByLabelText('% da nova pessoa')).toHaveValue(20)
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))
    expect(props.onAdd).toHaveBeenCalledWith([
      { personId: 'demo-carla', squadId: 'sq-web', sprintId: 'sp-10', percentage: 20 },
    ])
  })

  it('mostra o erro devolvido ao editar a %', async () => {
    const { user } = setup({ onSetPercentage: vi.fn(() => 'Passaria de 100%.') })
    const cell = screen.getByLabelText('% de Ana (exemplo)')
    await user.clear(cell)
    await user.type(cell, '90{Enter}')
    expect(screen.getByRole('alert')).toHaveTextContent('Passaria de 100%.')
  })

  it('cadastra apoio pela linha', async () => {
    const { props, user } = setup()
    await user.click(screen.getByRole('button', { name: 'Cadastrar apoio de Sthiven Melo' }))
    const dialog = screen.getByRole('dialog')
    await user.selectOptions(within(dialog).getByLabelText('Apoiado'), 'demo-ana')
    await user.click(within(dialog).getByRole('button', { name: 'Adicionar apoio' }))
    expect(props.support.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ supporterId: 'demo-sthiven', supportedId: 'demo-ana', sprintId: 'sp-10' }),
    )
  })
})
