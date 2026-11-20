import { screen } from '@testing-library/react'
import type { Skill } from '@/features/skills/lib/skillsStorage'
import { renderWithProviders } from '@/test/utils'
import { RequiredSkillsEditor } from './RequiredSkillsEditor'

const skills: Skill[] = [
  { id: 'react', name: 'React', type: 'hard' },
  { id: 'com', name: 'Comunicação', type: 'soft' },
]

describe('RequiredSkillsEditor', () => {
  it('sem requisitos mostra a mensagem e oferece todas as skills', () => {
    renderWithProviders(<RequiredSkillsEditor value={[]} onChange={vi.fn()} skills={skills} />)
    expect(screen.getByText('Nenhuma skill requerida.')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3) // placeholder + 2
  })

  it('adiciona com nível mínimo 3', async () => {
    const onChange = vi.fn()
    const { user } = renderWithProviders(
      <RequiredSkillsEditor value={[]} onChange={onChange} skills={skills} />,
    )
    await user.selectOptions(screen.getByLabelText('Adicionar requisito'), 'com')
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))
    expect(onChange).toHaveBeenCalledWith([{ skillId: 'com', minLevel: 3 }])
  })

  it('altera o nível mínimo e remove', async () => {
    const onChange = vi.fn()
    const value = [{ skillId: 'react', minLevel: 3 }]
    const { user } = renderWithProviders(
      <RequiredSkillsEditor value={value} onChange={onChange} skills={skills} />,
    )
    await user.click(screen.getByRole('radio', { name: 'Nível mínimo React: 5' }))
    expect(onChange).toHaveBeenLastCalledWith([{ skillId: 'react', minLevel: 5 }])
    await user.click(screen.getByRole('button', { name: 'Excluir React' }))
    expect(onChange).toHaveBeenLastCalledWith([])
  })

  it('não oferece skills já requeridas', () => {
    renderWithProviders(
      <RequiredSkillsEditor
        value={[{ skillId: 'react', minLevel: 3 }]}
        onChange={vi.fn()}
        skills={skills}
      />,
    )
    expect(screen.queryByRole('option', { name: 'React' })).not.toBeInTheDocument()
  })
})
