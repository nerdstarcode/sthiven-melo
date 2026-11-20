import { screen } from '@testing-library/react'
import { DEFAULT_AZURE_CONFIG } from '@/features/location-overview/lib/azure/azureConfigStorage'
import { renderWithProviders } from '@/test/utils'
import { AzureTokenForm } from './AzureTokenForm'

describe('AzureTokenForm', () => {
  it('explica os escopos mínimos de leitura', () => {
    renderWithProviders(
      <AzureTokenForm initialConfig={DEFAULT_AZURE_CONFIG} onSave={vi.fn()} onTest={vi.fn()} />,
    )
    const aside = screen.getByRole('complementary', {
      name: 'Permissões mínimas do token (somente leitura)',
    })
    expect(aside).toHaveTextContent('Work Items: Read')
    expect(aside).toHaveTextContent('Project and Team: Read')
    expect(aside).toHaveTextContent('Test Management: Read')
  })

  it('só salva com organização e token, normalizando os tipos', async () => {
    const onSave = vi.fn()
    const { user } = renderWithProviders(
      <AzureTokenForm initialConfig={DEFAULT_AZURE_CONFIG} onSave={onSave} onTest={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
    await user.type(screen.getByLabelText('Organização'), ' acme ')
    await user.type(screen.getByLabelText('Personal Access Token (PAT)'), 'segredo')
    const types = screen.getByLabelText('Tipos que somam Story Points')
    await user.clear(types)
    await user.type(types, 'User Story, , Bug')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ organization: 'acme', pat: 'segredo', pointTypes: ['User Story', 'Bug'] }),
    )
  })

  it('o token fica oculto até pedir para mostrar', async () => {
    const { user } = renderWithProviders(
      <AzureTokenForm initialConfig={DEFAULT_AZURE_CONFIG} onSave={vi.fn()} onTest={vi.fn()} />,
    )
    const pat = screen.getByLabelText('Personal Access Token (PAT)')
    expect(pat).toHaveAttribute('type', 'password')
    await user.click(screen.getByRole('button', { name: 'Mostrar token' }))
    expect(pat).toHaveAttribute('type', 'text')
  })

  it('testar conexão mostra quantos projetos o token vê, ou o erro', async () => {
    const config = { ...DEFAULT_AZURE_CONFIG, organization: 'acme', pat: 'x' }
    const onTest = vi.fn().mockResolvedValueOnce(3).mockRejectedValueOnce(new Error('Sem permissão.'))
    const { user } = renderWithProviders(
      <AzureTokenForm initialConfig={config} onSave={vi.fn()} onTest={onTest} />,
    )
    await user.click(screen.getByRole('button', { name: 'Testar conexão' }))
    expect(await screen.findByRole('status')).toHaveTextContent('3 projeto(s)')
    await user.click(screen.getByRole('button', { name: 'Testar conexão' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Sem permissão.')
  })
})
