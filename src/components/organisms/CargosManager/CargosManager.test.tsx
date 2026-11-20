import { screen } from '@testing-library/react'
import { loadCargos } from '@/features/location-overview/lib/cargosStorage'
import { demoCargos } from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { CargosManager } from './CargosManager'

describe('CargosManager', () => {
  it('lista os cargos', async () => {
    renderWithProviders(<CargosManager />)
    expect(await screen.findByRole('cell', { name: 'Software Developer' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(demoCargos.length + 1)
  })

  it('valida cargo e nível obrigatórios', async () => {
    const { user } = renderWithProviders(<CargosManager />)
    await user.click(await screen.findByRole('button', { name: 'Adicionar cargo' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByLabelText('Cargo')).toHaveAccessibleDescription('Informe o cargo.')
    expect(screen.getByLabelText('Nível')).toHaveAccessibleDescription('Escolha o nível.')
  })

  it('cria um cargo', async () => {
    const { user } = renderWithProviders(<CargosManager />)
    await user.click(await screen.findByRole('button', { name: 'Adicionar cargo' }))
    await user.type(screen.getByLabelText('Cargo'), 'Tech Lead')
    await user.selectOptions(screen.getByLabelText('Tipo'), 'Gestão')
    await user.selectOptions(screen.getByLabelText('Nível'), 'SR')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(loadCargos().find((c) => c.cargo === 'Tech Lead')).toMatchObject({
      tipo: 'Gestão',
      nivel: 'SR',
    })
  })

  it('exclui um cargo', async () => {
    const { user } = renderWithProviders(<CargosManager />)
    await user.click(await screen.findByRole('button', { name: 'Excluir Data Analyst' }))
    expect(loadCargos().some((c) => c.cargo === 'Data Analyst')).toBe(false)
  })
})
