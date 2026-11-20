import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LANGUAGE_STORAGE_KEY } from '@/constants/storage'
import { renderWithProviders } from '@/test/utils'
import { LanguageSwitcher } from './LanguageSwitcher'

describe('LanguageSwitcher', () => {
  it('mostra os três idiomas', () => {
    render(<LanguageSwitcher language='pt' />)
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['pt', 'en', 'es'])
  })

  it('marca o idioma atual com aria-pressed', () => {
    render(<LanguageSwitcher language='en' />)
    expect(screen.getByRole('button', { name: 'en' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'pt' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('chama onChange uma vez com o idioma clicado', async () => {
    const onChange = vi.fn()
    render(<LanguageSwitcher language='pt' onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'es' }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('es')
  })

  it('sem provider nem props, usa pt e não quebra ao clicar', async () => {
    render(<LanguageSwitcher />)
    expect(screen.getByRole('button', { name: 'pt' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'en' }))
  })

  it('com provider, troca o idioma e persiste no localStorage', async () => {
    const { user } = renderWithProviders(<LanguageSwitcher />)
    await user.click(screen.getByRole('button', { name: 'en' }))
    expect(screen.getByRole('button', { name: 'en' })).toHaveAttribute('aria-pressed', 'true')
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
  })
})
