import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Badge } from './Badge'

describe('Badge', () => {
  it('aplica o tom', () => {
    render(<Badge tone='danger'>Gap</Badge>)
    expect(screen.getByText('Gap').parentElement).toHaveClass('text-danger')
  })

  it('sem onRemove não mostra botão', () => {
    render(<Badge>React</Badge>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('onRemove é chamado uma vez e não propaga o clique', async () => {
    const onRemove = vi.fn()
    const onParentClick = vi.fn()
    render(
      <div onClick={onParentClick}>
        <Badge onRemove={onRemove}>React</Badge>
      </div>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Remover React' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onParentClick).not.toHaveBeenCalled()
  })
})
