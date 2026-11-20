import { screen, within } from '@testing-library/react'
import { loadPeople } from '@/features/location-overview/lib/peopleStorage'
import { loadPersonAllocations } from '@/features/location-overview/lib/personAllocationsStorage'
import { demoPeople } from '@/features/seed/demoSeed'
import { loadPersonSkills } from '@/features/skills/lib/skillsStorage'
import { renderWithProviders } from '@/test/utils'
import { PeopleManager } from './PeopleManager'

const rowOf = (name: string) => screen.getByRole('cell', { name }).closest('tr')!

describe('PeopleManager', () => {
  it('lista as pessoas com squads e as 3 principais skills', async () => {
    renderWithProviders(<PeopleManager />)
    expect(await screen.findByRole('cell', { name: 'Sthiven Melo' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(demoPeople.length + 1)
    const row = within(rowOf('Sthiven Melo'))
    expect(row.getByText('Frontend Web')).toBeInTheDocument()
    expect(row.getByText('Plataforma')).toBeInTheDocument()
    expect(row.getByText('+11')).toBeInTheDocument()
  })

  it('cria pessoa: o cargo define o nível', async () => {
    const { user } = renderWithProviders(<PeopleManager />)
    await user.click(await screen.findByRole('button', { name: 'Adicionar pessoa' }))
    await user.type(screen.getByLabelText('Nome'), 'Eva (exemplo)')
    await user.selectOptions(screen.getByLabelText('Cargo'), 'Sr Software Developer')
    expect(screen.getByLabelText('Cargo')).toHaveAccessibleDescription(/SR/)
    await user.click(screen.getByLabelText('Dados'))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(loadPeople().find((p) => p.nome === 'Eva (exemplo)')).toMatchObject({
      cargo: 'Sr Software Developer',
      nivel: 'SR',
      squadIds: ['sq-data'],
    })
  })

  it('exige o nome', async () => {
    const { user } = renderWithProviders(<PeopleManager />)
    await user.click(await screen.findByRole('button', { name: 'Adicionar pessoa' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription('Informe o nome.')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('edita uma pessoa existente', async () => {
    const { user } = renderWithProviders(<PeopleManager />)
    await user.click(await screen.findByRole('button', { name: 'Editar Ana (exemplo)' }))
    const name = screen.getByLabelText('Nome')
    await user.clear(name)
    await user.type(name, 'Ana Paula (exemplo)')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(await screen.findByRole('cell', { name: 'Ana Paula (exemplo)' })).toBeInTheDocument()
    expect(loadPeople()).toHaveLength(demoPeople.length)
  })

  it('excluir remove a pessoa, as skills e as alocações dela', async () => {
    const { user } = renderWithProviders(<PeopleManager confirm={() => true} />)
    await user.click(await screen.findByRole('button', { name: 'Excluir Ana (exemplo)' }))
    expect(loadPeople().some((p) => p.id === 'demo-ana')).toBe(false)
    expect(loadPersonSkills().some((ps) => ps.personId === 'demo-ana')).toBe(false)
    expect(loadPersonAllocations().some((a) => a.personId === 'demo-ana')).toBe(false)
  })

  it('o botão de skills abre o editor do perfil e reflete na tabela', async () => {
    const { user } = renderWithProviders(<PeopleManager />)
    await user.click(await screen.findByRole('button', { name: 'Editar skills: Ana (exemplo)' }))
    const dialog = screen.getByRole('dialog', { name: 'Skills de Ana (exemplo)' })
    await user.click(within(dialog).getByRole('button', { name: 'Remover React' }))
    await user.click(within(dialog).getByRole('button', { name: 'Fechar' }))
    expect(within(rowOf('Ana (exemplo)')).queryByText(/React/)).not.toBeInTheDocument()
  })
})
