import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { isActivePath, NavLink } from './NavLink'

describe('NavLink', () => {
  it('renderiza um link com o href informado', () => {
    render(<NavLink href='/projects'>Projetos</NavLink>)
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '/projects')
  })

  it('marca aria-current quando ativo', () => {
    render(
      <NavLink href='/' isActive>
        Início
      </NavLink>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page')
  })

  it('não marca aria-current quando inativo', () => {
    render(<NavLink href='/'>Início</NavLink>)
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current')
  })

  it('chama onClick uma vez ao clicar', async () => {
    const onClick = vi.fn()
    render(
      <NavLink href='/about' onClick={onClick}>
        Sobre
      </NavLink>,
    )
    await userEvent.click(screen.getByRole('link'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('isActivePath', () => {
  it('é verdadeiro para o mesmo pathname', () => {
    expect(isActivePath('/about', '/about')).toBe(true)
  })

  it('é falso para âncoras de outra rota', () => {
    expect(isActivePath('/about', '/about#skills')).toBe(false)
  })
})
