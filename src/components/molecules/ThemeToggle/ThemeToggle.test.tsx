import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('mostra a lua no tema escuro e o sol no claro', () => {
    const { rerender } = render(<ThemeToggle isDark />)
    expect(screen.getByRole('button')).toHaveTextContent('☾')
    rerender(<ThemeToggle isDark={false} />)
    expect(screen.getByRole('button')).toHaveTextContent('☼')
  })

  it('tem rótulo acessível traduzido', () => {
    renderWithProviders(<ThemeToggle />, { language: 'en' })
    expect(screen.getByRole('button', { name: 'Toggle light/dark theme' })).toBeInTheDocument()
  })

  it('chama onToggle uma vez', async () => {
    const onToggle = vi.fn()
    render(<ThemeToggle isDark onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('com provider, alterna a classe dark do <html>', async () => {
    const { user } = renderWithProviders(<ThemeToggle />)
    expect(document.documentElement).toHaveClass('dark')
    await user.click(screen.getByRole('button'))
    expect(document.documentElement).not.toHaveClass('dark')
    expect(screen.getByRole('button')).toHaveTextContent('☼')
  })
})
