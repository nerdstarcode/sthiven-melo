import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useDataContext } from '@/contexts/WorkContext'
import { renderWithProviders } from '@/test/utils'
import { WorkTab } from './WorkTab'

function CurrentWork() {
  return <output>{useDataContext().dataContext.Work || 'nenhuma'}</output>
}

describe('WorkTab', () => {
  it('mostra o nome da área e aponta para a home', () => {
    render(<WorkTab area='Backend' />)
    expect(screen.getByRole('link', { name: 'Backend' })).toHaveAttribute('href', '/')
  })

  it('chama onSelect uma vez com a área', async () => {
    const onSelect = vi.fn()
    render(<WorkTab area='UI/UX' onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('link'))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('UI/UX')
  })

  it('sem onSelect, atualiza o WorkContext', async () => {
    const { user } = renderWithProviders(
      <>
        <WorkTab area='Front' />
        <CurrentWork />
      </>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('nenhuma')
    await user.click(screen.getByRole('link', { name: 'Front' }))
    expect(screen.getByRole('status')).toHaveTextContent('Front')
  })
})
