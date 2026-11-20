import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HamburgerButton } from './HamburgerButton'

describe('HamburgerButton', () => {
  it('reflete o estado em aria-expanded', () => {
    const { rerender } = render(<HamburgerButton isOpen={false} onClick={vi.fn()} label='Menu' />)
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
    rerender(<HamburgerButton isOpen onClick={vi.fn()} label='Menu' />)
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('chama onClick uma vez', async () => {
    const onClick = vi.fn()
    render(<HamburgerButton isOpen={false} onClick={onClick} label='Menu' />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
