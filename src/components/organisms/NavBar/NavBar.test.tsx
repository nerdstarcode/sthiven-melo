import { screen, within } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { NavBar } from './NavBar'

describe('NavBar', () => {
  it('lista os links de navegação traduzidos', () => {
    renderWithProviders(<NavBar />, { language: 'en' })
    const nav = screen.getByRole('navigation')
    for (const label of ['Home', 'About', 'Projects', 'Examples', 'Skills', 'Experience']) {
      expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('marca a rota atual como ativa (mock do router em "/")', () => {
    renderWithProviders(<NavBar />)
    const nav = screen.getByRole('navigation')
    expect(within(nav).getByRole('link', { name: 'Início' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Sobre' })).not.toHaveAttribute('aria-current')
  })

  it('abre e fecha o menu mobile pelo botão hambúrguer', async () => {
    const { user } = renderWithProviders(<NavBar />)
    const toggle = screen.getByRole('button', { name: 'Abrir menu' })
    expect(screen.queryByTestId('mobile-menu-overlay')).not.toBeInTheDocument()

    await user.click(toggle)
    expect(screen.getByTestId('mobile-menu-overlay')).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('trocar o idioma atualiza os rótulos', async () => {
    const { user } = renderWithProviders(<NavBar />)
    await user.click(screen.getAllByRole('button', { name: 'es' })[0])
    expect(
      within(screen.getByRole('navigation')).getByRole('link', { name: 'Proyectos' }),
    ).toBeInTheDocument()
  })
})
