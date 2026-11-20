import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, buttonClasses } from './Button'

describe('Button', () => {
  it('é type="button" por padrão (não submete formulários sem querer)', () => {
    render(<Button>Ok</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('aceita type="submit"', () => {
    render(<Button type='submit'>Enviar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('chama onClick uma vez', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Ok</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('desabilitado não dispara onClick', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Ok
      </Button>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('buttonClasses aplica variante e tamanho, e className sobrescreve', () => {
    expect(buttonClasses('danger', 'sm')).toContain('bg-danger')
    expect(buttonClasses('primary', 'sm', 'px-6')).toContain('px-6')
    expect(buttonClasses('primary', 'sm', 'px-6')).not.toContain('px-2')
  })
})
