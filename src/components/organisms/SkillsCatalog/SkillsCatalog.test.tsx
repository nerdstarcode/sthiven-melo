import { screen, within } from '@testing-library/react'
import { demoSkills } from '@/features/seed/demoSeed'
import { loadPersonSkills, loadSkills } from '@/features/skills/lib/skillsStorage'
import { renderWithProviders } from '@/test/utils'
import { SkillsCatalog } from './SkillsCatalog'

const rowOf = (name: string) => screen.getByRole('cell', { name }).closest('tr')!

describe('SkillsCatalog', () => {
  it('lista o catálogo da demonstração com tipo e nº de pessoas', async () => {
    renderWithProviders(<SkillsCatalog />)
    expect(await screen.findByRole('cell', { name: 'React' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(demoSkills.length + 1)
    const react = within(rowOf('React'))
    expect(react.getByText('Hard skill')).toBeInTheDocument()
    expect(react.getByRole('cell', { name: '2' })).toBeInTheDocument()
  })

  it('cria uma skill soft com categoria', async () => {
    const { user } = renderWithProviders(<SkillsCatalog />)
    await user.click(await screen.findByRole('button', { name: 'Adicionar skill' }))
    await user.type(screen.getByLabelText('Nome'), 'Liderança')
    await user.selectOptions(screen.getByLabelText('Tipo'), 'soft')
    await user.type(screen.getByLabelText('Categoria'), 'Gestão')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(loadSkills().find((s) => s.name === 'Liderança')).toMatchObject({
      type: 'soft',
      category: 'Gestão',
    })
  })

  it('valida nome vazio e duplicado (sem diferenciar maiúsculas)', async () => {
    const { user } = renderWithProviders(<SkillsCatalog />)
    await user.click(await screen.findByRole('button', { name: 'Adicionar skill' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription('Informe o nome.')
    await user.type(screen.getByLabelText('Nome'), 'react')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription(
      'Já existe uma skill com esse nome.',
    )
  })

  it('excluir pede confirmação e remove dos perfis', async () => {
    const confirm = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)
    const { user } = renderWithProviders(<SkillsCatalog confirm={confirm} />)
    const del = await screen.findByRole('button', { name: 'Excluir React' })
    await user.click(del)
    expect(loadSkills().some((s) => s.id === 'sk-react')).toBe(true)
    await user.click(del)
    expect(loadSkills().some((s) => s.id === 'sk-react')).toBe(false)
    expect(loadPersonSkills().some((ps) => ps.skillId === 'sk-react')).toBe(false)
    expect(screen.queryByRole('cell', { name: 'React' })).not.toBeInTheDocument()
  })
})
