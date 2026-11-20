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

  describe('ações em lote', () => {
    const anaEntry = plan.entries.find((e) => e.personId === 'demo-ana')!

    it('sem seleção não mostra a barra; com seleção, aplica a % só nas marcadas', async () => {
      const { props, user } = setup()
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
      await user.click(screen.getByRole('checkbox', { name: 'Selecionar Ana (exemplo)' }))
      const toolbar = screen.getByRole('toolbar', { name: '1 selecionada(s)' })
      const input = within(toolbar).getByLabelText('% das selecionadas')
      await user.clear(input)
      await user.type(input, '40')
      await user.click(within(toolbar).getByRole('button', { name: 'Aplicar %' }))
      expect(props.onSetPercentage).toHaveBeenCalledWith([anaEntry.id], 40)
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
    })

    it('move só as selecionadas para outra squad', async () => {
      const { props, user } = setup()
      await user.click(screen.getByRole('checkbox', { name: 'Selecionar Ana (exemplo)' }))
      await user.click(screen.getByRole('button', { name: 'Mover selecionadas' }))
      const dialog = screen.getByRole('dialog')
      await user.selectOptions(within(dialog).getByLabelText('Nova squad'), 'sq-platform')
      await user.click(within(dialog).getByRole('button', { name: 'Mover 1 pessoa(s)' }))
      expect(props.onMove).toHaveBeenCalledWith([anaEntry.id], 'sq-platform')
    })

    it('remove as selecionadas com Desfazer', async () => {
      const { props, user } = setup()
      await user.click(screen.getByRole('checkbox', { name: 'Selecionar todas' }))
      expect(screen.getByRole('toolbar', { name: `${plan.entries.length} selecionada(s)` })).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Remover selecionadas' }))
      expect(props.onRemove).toHaveBeenCalledWith(plan.entries.map((e) => e.id))
      expect(screen.getByText('1 alocação(ões) removida(s)')).toBeInTheDocument()
    })

    it('mostra o erro devolvido ao aplicar a % e mantém a seleção', async () => {
      const { user } = setup({ onSetPercentage: vi.fn(() => 'Passaria de 100%.') })
      await user.click(screen.getByRole('checkbox', { name: 'Selecionar Ana (exemplo)' }))
      await user.click(screen.getByRole('button', { name: 'Aplicar %' }))
      expect(screen.getByRole('alert')).toHaveTextContent('Passaria de 100%.')
      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })
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
