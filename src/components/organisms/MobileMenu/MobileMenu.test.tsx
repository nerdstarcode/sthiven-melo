import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { MobileMenu } from './MobileMenu'

describe('MobileMenu', () => {
  it('não renderiza nada quando fechado', () => {
    renderWithProviders(<MobileMenu isOpen={false} onClose={vi.fn()} pathname='/' />)
    expect(screen.queryByTestId('mobile-menu-overlay')).not.toBeInTheDocument()
  })

  it('mostra links, idioma, tema e redes quando aberto', () => {
    renderWithProviders(<MobileMenu isOpen onClose={vi.fn()} pathname='/' />)
    expect(screen.getByRole('link', { name: 'Projetos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'pt' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Alternar tema claro/escuro' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
  })

  it('destaca a rota atual', () => {
    renderWithProviders(<MobileMenu isOpen onClose={vi.fn()} pathname='/projects' />)
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('aria-current', 'page')
  })

  it('fecha ao clicar em um link', async () => {
    const onClose = vi.fn()
    const { user } = renderWithProviders(<MobileMenu isOpen onClose={onClose} pathname='/' />)
    await user.click(screen.getByRole('link', { name: 'Sobre' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('fecha ao clicar fora do painel, mas não dentro dele', async () => {
    const onClose = vi.fn()
    const { user } = renderWithProviders(<MobileMenu isOpen onClose={onClose} pathname='/' />)
    await user.click(screen.getByRole('button', { name: 'en' }))
    expect(onClose).not.toHaveBeenCalled()
    await user.click(screen.getByTestId('mobile-menu-overlay'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
