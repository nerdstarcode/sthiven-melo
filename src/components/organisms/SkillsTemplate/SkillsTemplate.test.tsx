import { screen, within } from '@testing-library/react'
import { useState } from 'react'
import { loadPeople } from '@/features/location-overview/lib/peopleStorage'
import { OWNER_PERSON_ID } from '@/features/seed/demoSeed'
import { loadPersonSkills } from '@/features/skills/lib/skillsStorage'
import { renderWithProviders } from '@/test/utils'
import { SkillsTemplate } from './SkillsTemplate'

function Harness() {
  const [personId, setPersonId] = useState<string>()
  return <SkillsTemplate personId={personId} onSelectPerson={setPersonId} />
}

describe('SkillsTemplate', () => {
  it('abre o perfil do Sthiven por padrão, com radar e editor', async () => {
    renderWithProviders(<Harness />)
    expect(await screen.findByRole('heading', { name: 'Sthiven Melo' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Visão do perfil' })).toBeInTheDocument()
    expect(screen.getByLabelText('Perfil')).toHaveValue(OWNER_PERSON_ID)
  })

  it('cria o perfil do visitante copiando as skills do Sthiven', async () => {
    const { user } = renderWithProviders(<Harness />)
    const form = await screen.findByRole('form', { name: 'Criar meu perfil' })
    await user.type(within(form).getByLabelText('Seu nome'), 'Maria')
    await user.click(within(form).getByRole('button', { name: 'Criar perfil' }))
    expect(await screen.findByRole('heading', { name: 'Maria' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Perfil de Maria criado.')
    const maria = loadPeople().find((p) => p.nome === 'Maria')!
    const ownerCount = loadPersonSkills().filter((ps) => ps.personId === OWNER_PERSON_ID).length
    expect(loadPersonSkills().filter((ps) => ps.personId === maria.id)).toHaveLength(ownerCount)
  })

  it('sem copiar, o perfil novo começa vazio', async () => {
    const { user } = renderWithProviders(<Harness />)
    const form = await screen.findByRole('form', { name: 'Criar meu perfil' })
    await user.click(within(form).getByRole('checkbox', { name: /Começar com as skills de/ }))
    await user.type(within(form).getByLabelText('Seu nome'), 'João')
    await user.click(within(form).getByRole('button', { name: 'Criar perfil' }))
    await screen.findByRole('heading', { name: 'João' })
    const joao = loadPeople().find((p) => p.nome === 'João')!
    expect(loadPersonSkills().filter((ps) => ps.personId === joao.id)).toEqual([])
  })

  it('sem nome mostra o erro', async () => {
    const { user } = renderWithProviders(<Harness />)
    await user.click(await screen.findByRole('button', { name: 'Criar perfil' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o seu nome.')
  })
})
