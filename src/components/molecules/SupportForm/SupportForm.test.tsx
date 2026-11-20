import { screen, within } from '@testing-library/react'
import { demoCargos, demoPeople } from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { SupportForm } from './SupportForm'

const props = { people: demoPeople, cargos: demoCargos }

describe('SupportForm', () => {
  it('envia o par com a % do atalho escolhido', async () => {
    const onSubmit = vi.fn(() => null)
    const { user } = renderWithProviders(<SupportForm {...props} onSubmit={onSubmit} />)
    await user.selectOptions(screen.getByLabelText('Quem apoia'), 'demo-ana')
    await user.selectOptions(screen.getByLabelText('Apoiado'), 'demo-bruno')
    await user.click(screen.getByRole('button', { name: 'Intenso 50%' }))
    await user.click(screen.getByRole('button', { name: 'Adicionar apoio' }))
    expect(onSubmit).toHaveBeenCalledWith({
      supporterId: 'demo-ana',
      supportedId: 'demo-bruno',
      percentage: 50,
    })
    expect(screen.getByLabelText('Apoiado')).toHaveValue('')
  })

  it('não oferece QA como apoiado de quem não é QA', async () => {
    const { user } = renderWithProviders(<SupportForm {...props} onSubmit={() => null} />)
    await user.selectOptions(screen.getByLabelText('Quem apoia'), 'demo-ana')
    const supported = screen.getByLabelText('Apoiado')
    expect(within(supported).queryByRole('option', { name: 'Diego (exemplo)' })).not.toBeInTheDocument()
    expect(within(supported).getByRole('option', { name: 'Bruno (exemplo)' })).toBeInTheDocument()
  })

  it('mostra o erro traduzido devolvido pelo onSubmit', async () => {
    const { user } = renderWithProviders(
      <SupportForm
        {...props}
        initialSupporterId='demo-ana'
        onSubmit={() => ({ code: 'notAllocated', name: 'Bruno' })}
      />,
    )
    await user.selectOptions(screen.getByLabelText('Apoiado'), 'demo-bruno')
    await user.click(screen.getByRole('button', { name: 'Adicionar apoio' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Bruno não está alocado(a) nesta sprint.')
  })

  it('inverte quem apoia e quem é apoiado', async () => {
    const { user } = renderWithProviders(
      <SupportForm {...props} initialSupporterId='demo-ana' onSubmit={() => null} />,
    )
    await user.selectOptions(screen.getByLabelText('Apoiado'), 'demo-bruno')
    await user.click(screen.getByRole('button', { name: 'Inverter quem apoia e quem é apoiado' }))
    expect(screen.getByLabelText('Quem apoia')).toHaveValue('demo-bruno')
  })
})
