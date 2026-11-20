import { screen, within } from '@testing-library/react'
import { OWNER_PERSON_ID } from '@/features/seed/demoSeed'
import { loadPersonSkills } from '@/features/skills/lib/skillsStorage'
import { renderWithProviders } from '@/test/utils'
import { PersonSkillsEditor } from './PersonSkillsEditor'

const levelOf = (personId: string, skillId: string) =>
  loadPersonSkills().find((ps) => ps.personId === personId && ps.skillId === skillId)?.level

describe('PersonSkillsEditor', () => {
  it('separa hard e soft skills do perfil', async () => {
    renderWithProviders(<PersonSkillsEditor personId='demo-ana' />)
    const hard = await screen.findByRole('region', { name: 'Hard skills' })
    const soft = screen.getByRole('region', { name: 'Soft skills' })
    expect(within(hard).getByText('React')).toBeInTheDocument()
    expect(within(soft).getByText('Comunicação')).toBeInTheDocument()
    expect(within(hard).queryByText('Comunicação')).not.toBeInTheDocument()
  })

  it('muda o nível clicando na escala e avisa onChange', async () => {
    const onChange = vi.fn()
    const { user } = renderWithProviders(
      <PersonSkillsEditor personId='demo-ana' onChange={onChange} />,
    )
    await user.click(await screen.findByRole('radio', { name: 'Comunicação: 4' }))
    expect(levelOf('demo-ana', 'sk-comm')).toBe(4)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('adiciona uma skill do catálogo com nível 3 e tira ela das opções', async () => {
    const { user } = renderWithProviders(<PersonSkillsEditor personId='demo-ana' />)
    const select = await screen.findByLabelText('Adicionar skill ao perfil')
    await user.selectOptions(select, 'sk-docker')
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))
    expect(levelOf('demo-ana', 'sk-docker')).toBe(3)
    expect(within(select).queryByRole('option', { name: /Docker/ })).not.toBeInTheDocument()
  })

  it('remove uma skill do perfil', async () => {
    const { user } = renderWithProviders(<PersonSkillsEditor personId='demo-ana' />)
    await user.click(await screen.findByRole('button', { name: 'Remover React' }))
    expect(levelOf('demo-ana', 'sk-react')).toBeUndefined()
  })

  it('readOnly mostra os níveis sem permitir edição', async () => {
    renderWithProviders(<PersonSkillsEditor personId={OWNER_PERSON_ID} readOnly />)
    expect(await screen.findByRole('meter', { name: 'React' })).toHaveAttribute(
      'aria-valuenow',
      '4',
    )
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Adicionar skill ao perfil')).not.toBeInTheDocument()
  })
})
