import { screen, within } from '@testing-library/react'
import { useState } from 'react'
import { fakeAzureReader } from '@/features/location-overview/azure/fakeAzureReader'
import { AzureApiError } from '@/features/location-overview/lib/azure/client'
import { DEFAULT_AZURE_CONFIG } from '@/features/location-overview/lib/azure/azureConfigStorage'
import { FIXTURE_ITERATIONS } from '@/features/location-overview/lib/azure/sprintFixtures'
import { loadSquads } from '@/features/location-overview/lib/squadsStorage'
import { loadWorkItems } from '@/features/location-overview/lib/workItemsStorage'
import { renderWithProviders } from '@/test/utils'
import { AzureExplorer, type AzureReader } from './AzureExplorer'

const config = { ...DEFAULT_AZURE_CONFIG, organization: 'acme', pat: 'x' }

function Harness({ api = fakeAzureReader() }: { api?: AzureReader }) {
  const [selection, setSelection] = useState<{ projectId?: string; teamId?: string }>({})
  return <AzureExplorer config={config} api={api} {...selection} onSelect={setSelection} />
}

const choose = async (user: ReturnType<typeof renderWithProviders>['user']) => {
  await user.selectOptions(await screen.findByLabelText('Projeto'), 'p1')
  const team = await screen.findByLabelText('Squad (Team)')
  await screen.findByRole('option', { name: 'Portal' })
  await user.selectOptions(team, 't1')
}

describe('AzureExplorer', () => {
  it('projeto → team mostra pessoas e sprints', async () => {
    const { user } = renderWithProviders(<Harness />)
    await choose(user)
    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument()
    expect(
      await screen.findByRole('cell', { name: FIXTURE_ITERATIONS[0].name }),
    ).toBeInTheDocument()
  })

  it('sincroniza o team como squad local', async () => {
    const { user } = renderWithProviders(<Harness />)
    await choose(user)
    await screen.findByRole('cell', { name: FIXTURE_ITERATIONS[0].name })
    await user.click(screen.getByRole('button', { name: 'Sincronizar squad, pessoas e sprints' }))
    expect(screen.getByRole('status')).toHaveTextContent('Squad criada')
    expect(loadSquads().some((s) => s.name === 'Portal')).toBe(true)
  })

  it('busca os work items de uma sprint e grava na base', async () => {
    const { user } = renderWithProviders(<Harness />)
    await choose(user)
    const name = FIXTURE_ITERATIONS[0].name
    await user.click(
      await screen.findByRole('button', { name: `Buscar work items de ${name}` }),
    )
    expect(await screen.findByRole('status')).toHaveTextContent(`${name}: 2 work item(s) gravados.`)
    expect(loadWorkItems().map((w) => w.id)).toEqual(expect.arrayContaining([501, 502]))
  })

  it('mostra o erro da API com "tentar de novo"', async () => {
    let calls = 0
    const api = fakeAzureReader({
      listProjects: async () => {
        calls += 1
        if (calls === 1) throw new AzureApiError(401, 'Token inválido ou expirado.')
        return [{ id: 'p1', name: 'Portfolio', state: 'wellFormed' }]
      },
    })
    const { user } = renderWithProviders(<Harness api={api} />)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Token inválido ou expirado.')
    await user.click(within(alert).getByRole('button', { name: 'Tentar de novo' }))
    expect(await screen.findByRole('option', { name: 'Portfolio' })).toBeInTheDocument()
  })
})
