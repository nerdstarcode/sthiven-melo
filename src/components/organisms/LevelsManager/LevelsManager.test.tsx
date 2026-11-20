import { screen } from '@testing-library/react'
import { DEFAULT_LEVELS, loadLevels } from '@/features/location-overview/lib/levelsStorage'
import { renderWithProviders } from '@/test/utils'
import { LevelsManager } from './LevelsManager'

describe('LevelsManager', () => {
  it('lista os níveis padrão', async () => {
    renderWithProviders(<LevelsManager />)
    expect(await screen.findByRole('cell', { name: 'SR' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(DEFAULT_LEVELS.length + 1)
  })

  it('edita os pontos por dia e salva', async () => {
    const { user } = renderWithProviders(<LevelsManager />)
    const input = await screen.findByLabelText('Max points/dia SR')
    await user.clear(input)
    await user.type(input, '2,5{Enter}')
    expect(loadLevels().find((l) => l.nivel === 'SR')?.maxPointsDay).toBe(2.5)
  })

  it('restaura o padrão', async () => {
    const { user } = renderWithProviders(<LevelsManager />)
    const input = await screen.findByLabelText('Capacity points/dia JR')
    await user.clear(input)
    await user.type(input, '9')
    await user.tab()
    await user.click(screen.getByRole('button', { name: 'Restaurar padrão' }))
    expect(loadLevels()).toEqual(DEFAULT_LEVELS)
    expect(screen.getByLabelText('Capacity points/dia JR')).toHaveValue(
      String(DEFAULT_LEVELS.find((l) => l.nivel === 'JR')!.capacityPointsDay),
    )
  })
})
