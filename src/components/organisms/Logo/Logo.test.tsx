import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useDataContext } from '@/contexts/WorkContext'
import { renderWithProviders } from '@/test/utils'
import { Logo } from './Logo'

function CurrentWork() {
  return <output>{useDataContext().dataContext.Work || 'nenhuma'}</output>
}

describe('Logo', () => {
  it('mostra o "SM" e uma aba para cada área', () => {
    render(<Logo />)
    expect(screen.getByRole('link', { name: /início/ })).toHaveTextContent('SM')
    for (const area of ['UI/UX', 'Front', 'Backend']) {
      expect(screen.getByRole('link', { name: area })).toBeInTheDocument()
    }
  })

  it('chama onSelect com a área e com vazio ao clicar no SM', async () => {
    const onSelect = vi.fn()
    render(<Logo onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('link', { name: 'Front' }))
    await userEvent.click(screen.getByRole('link', { name: /início/ }))
    expect(onSelect.mock.calls).toEqual([['Front'], ['']])
  })

  it('sem onSelect, atualiza o WorkContext', async () => {
    const { user } = renderWithProviders(
      <>
        <Logo />
        <CurrentWork />
      </>,
      { work: 'Front' },
    )
    await user.click(screen.getByRole('link', { name: 'UI/UX' }))
    expect(screen.getByRole('status')).toHaveTextContent('UI/UX')
    await user.click(screen.getByRole('link', { name: /início/ }))
    expect(screen.getByRole('status')).toHaveTextContent('nenhuma')
  })
})
