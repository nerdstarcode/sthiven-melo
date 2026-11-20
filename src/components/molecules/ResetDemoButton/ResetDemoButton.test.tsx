import { screen } from '@testing-library/react'
import { loadPeople, savePeople } from '@/features/location-overview/lib/peopleStorage'
import { demoPeople } from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { ResetDemoButton } from './ResetDemoButton'

describe('ResetDemoButton', () => {
  it('cancelado na confirmação não apaga nada', async () => {
    savePeople([])
    const onReset = vi.fn()
    const { user } = renderWithProviders(
      <ResetDemoButton confirm={() => false} onReset={onReset} />,
    )
    await user.click(screen.getByRole('button', { name: /Restaurar demonstração/ }))
    expect(loadPeople()).toEqual([])
    expect(onReset).not.toHaveBeenCalled()
  })

  it('confirmado restaura a demonstração e chama onReset', async () => {
    savePeople([])
    const onReset = vi.fn()
    const { user } = renderWithProviders(<ResetDemoButton confirm={() => true} onReset={onReset} />)
    await user.click(screen.getByRole('button', { name: /Restaurar demonstração/ }))
    expect(loadPeople()).toHaveLength(demoPeople.length)
    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
