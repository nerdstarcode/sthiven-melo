import { screen } from '@testing-library/react'
import { demoAllocations, demoPeople, demoSprints, demoSquads } from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { AllocationFormModal, EMPTY_ALLOCATION } from './AllocationFormModal'

const setup = (allocation = EMPTY_ALLOCATION) => {
  const onSave = vi.fn()
  const utils = renderWithProviders(
    <AllocationFormModal
      allocation={allocation}
      onClose={vi.fn()}
      onSave={onSave}
      allocations={demoAllocations}
      people={demoPeople}
      squads={demoSquads}
      sprints={demoSprints}
    />,
  )
  return { ...utils, onSave }
}

describe('AllocationFormModal', () => {
  it('a squad só oferece as squads da pessoa', async () => {
    const { user } = setup()
    expect(screen.getByLabelText('Squad')).toBeDisabled()
    await user.selectOptions(screen.getByLabelText('Pessoa'), 'demo-carla')
    const options = screen.getAllByRole('option').map((o) => o.textContent)
    expect(options).toContain('Dados')
    expect(options).not.toContain('Frontend Web')
  })

  it('mostra os dias calculados pela sprint', async () => {
    const { user } = setup()
    await user.selectOptions(screen.getByLabelText('Sprint'), 'sp-10')
    const percentage = screen.getByLabelText('Porcentagem')
    await user.clear(percentage)
    await user.type(percentage, '50')
    expect(percentage).toHaveAccessibleDescription('Dias calculados: 5 de 10')
  })

  it('exige os campos', async () => {
    const { user, onSave } = setup()
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Pessoa, squad e sprint são obrigatórias.')
    expect(onSave).not.toHaveBeenCalled()
  })

  it('bloqueia passar de 100% na sprint', async () => {
    const { user, onSave } = setup()
    await user.selectOptions(screen.getByLabelText('Pessoa'), 'demo-sthiven')
    await user.selectOptions(screen.getByLabelText('Squad'), 'sq-web')
    await user.selectOptions(screen.getByLabelText('Sprint'), 'sp-10')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    // já tem 50% em Web e 50% em Plataforma na sprint 10
    expect(screen.getByRole('alert')).toHaveTextContent('já tem 100% em outras squads')
    expect(onSave).not.toHaveBeenCalled()
  })

  it('salva com id gerado', async () => {
    const { user, onSave } = setup()
    await user.selectOptions(screen.getByLabelText('Pessoa'), 'demo-diego')
    await user.selectOptions(screen.getByLabelText('Squad'), 'sq-web')
    await user.selectOptions(screen.getByLabelText('Sprint'), 'sp-10')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        personId: 'demo-diego',
        squadId: 'sq-web',
        sprintId: 'sp-10',
        percentage: 100,
        id: expect.any(String),
      }),
    )
  })
})
