import { screen, within } from '@testing-library/react'
import { Users } from 'lucide-react'
import { renderWithProviders } from '@/test/utils'
import { AppLayout } from './AppLayout'

vi.mock('next/router', () => ({ useRouter: () => ({ pathname: '/app/pessoas' }) }))

const nav = [
  { href: '/app/pessoas', label: 'Pessoas', icon: Users },
  { href: '/app/skills', label: 'Skills', icon: Users },
]

describe('AppLayout', () => {
  it('mostra app, título, descrição, ações e conteúdo', () => {
    renderWithProviders(
      <AppLayout
        appName='Meu App'
        title='Pessoas'
        description='desc'
        navItems={nav}
        actions={<button>Ação</button>}
      >
        <p>conteúdo</p>
      </AppLayout>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Pessoas' })).toBeInTheDocument()
    expect(screen.getByText('Meu App')).toBeInTheDocument()
    expect(screen.getByText('desc')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ação' })).toBeInTheDocument()
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('marca o item da rota atual e tem link de volta para projetos', () => {
    renderWithProviders(
      <AppLayout appName='App' title='Pessoas' navItems={nav}>
        x
      </AppLayout>,
    )
    const menu = within(screen.getByRole('navigation', { name: 'Menu do app' }))
    expect(menu.getByRole('link', { name: 'Pessoas' })).toHaveAttribute('aria-current', 'page')
    expect(menu.getByRole('link', { name: 'Skills' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: /Voltar para projetos/ })).toHaveAttribute(
      'href',
      '/projects',
    )
  })
})
