import { screen } from '@testing-library/react'
import { loadSquads } from '@/features/location-overview/lib/squadsStorage'
import { renderWithProviders } from '@/test/utils'
import { DataBackup } from './DataBackup'

const fileOf = (content: string) => new File([content], 'backup.json', { type: 'application/json' })

describe('DataBackup', () => {
  it('importa um JSON válido e avisa', async () => {
    const onImported = vi.fn()
    const { user } = renderWithProviders(<DataBackup onImported={onImported} />)
    const backup = { squads: [{ id: 'sq-x', name: 'Importada' }] }
    await user.upload(screen.getByLabelText('Importar backup'), fileOf(JSON.stringify(backup)))
    expect(await screen.findByRole('status')).toHaveTextContent('Backup importado')
    expect(loadSquads()).toEqual([{ id: 'sq-x', name: 'Importada' }])
    expect(onImported).toHaveBeenCalled()
  })

  it('arquivo inválido mostra erro e não importa', async () => {
    const onImported = vi.fn()
    const { user } = renderWithProviders(<DataBackup onImported={onImported} />)
    await user.upload(screen.getByLabelText('Importar backup'), fileOf('{quebrado'))
    expect(await screen.findByRole('alert')).toHaveTextContent('Arquivo inválido')
    expect(onImported).not.toHaveBeenCalled()
  })

  it('exportar gera o download', async () => {
    const createObjectURL = vi.fn(() => 'blob:x')
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL: vi.fn() })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const { user } = renderWithProviders(<DataBackup />)
    await user.click(screen.getByRole('button', { name: 'Exportar backup' }))
    expect(createObjectURL).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    click.mockRestore()
    vi.unstubAllGlobals()
  })
})
