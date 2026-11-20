import { screen, within } from '@testing-library/react'
import { demoSupportContext } from '@/features/seed/demoPlanning'
import { demoSprints, demoSupports } from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { SprintSupports } from './SprintSupports'

const setup = (overrides: Partial<Parameters<typeof SprintSupports>[0]> = {}) => {
  const props = {
    sprint: demoSprints[1],
    previousSprint: demoSprints[0],
    supports: demoSupports.filter((s) => s.sprintId === 'sp-11'),
    context: demoSupportContext,
    onAdd: vi.fn(() => null),
    onRemove: vi.fn(() => [demoSupports[1]]),
    onRestore: vi.fn(),
    onSetPercentage: vi.fn(() => null),
    onCopyPrevious: vi.fn(() => 0),
    ...overrides,
  }
  return { props, ...renderWithProviders(<SprintSupports {...props} />) }
}

describe('SprintSupports', () => {
  it('lista o apoio como valendo', () => {
    setup()
    const row = screen.getByRole('cell', { name: 'Ana (exemplo)' }).closest('tr')!
    expect(within(row).getByText('Valendo')).toBeInTheDocument()
  })

  it('apoio QA × não-QA aparece com aviso e fora do cálculo', () => {
    setup({ supports: [{ ...demoSupports[1], supportedId: 'demo-diego' }] })
    expect(
      screen.getByText(/Apoio entre QA e não-QA não é permitido\. Fora do cálculo\./),
    ).toBeInTheDocument()
  })

  it('adiciona com a sprint atual', async () => {
    const { props, user } = setup({ supports: [] })
    await user.selectOptions(screen.getByLabelText('Quem apoia'), 'demo-sthiven')
    await user.selectOptions(screen.getByLabelText('Apoiado'), 'demo-ana')
    await user.click(screen.getByRole('button', { name: 'Adicionar apoio' }))
    expect(props.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ supporterId: 'demo-sthiven', supportedId: 'demo-ana', sprintId: 'sp-11' }),
    )
  })

  it('remover oferece desfazer', async () => {
    const { props, user } = setup()
    await user.click(
      screen.getByRole('button', { name: 'Remover apoio de Ana (exemplo) a Bruno (exemplo)' }),
    )
    await user.click(screen.getByRole('button', { name: 'Desfazer' }))
    expect(props.onRestore).toHaveBeenCalledWith([demoSupports[1]])
  })

  it('copiar sem novidades avisa', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('button', { name: 'Copiar de Sprint 10 - FY26-27' }))
    expect(screen.getByText('Nenhum apoio novo para copiar.')).toBeInTheDocument()
  })
})
