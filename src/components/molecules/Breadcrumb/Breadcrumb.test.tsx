import { render, screen, within } from '@testing-library/react'
import { Breadcrumb } from './Breadcrumb'

describe('Breadcrumb', () => {
  it('renderiza links e marca o último item como página atual', () => {
    render(
      <Breadcrumb
        aria-label='Você está em'
        items={[
          { label: 'Projetos', href: '/projects' },
          { label: 'Sprints', href: '/projects/x/sprints' },
          { label: 'Sprint 11', href: '/ignorado' },
        ]}
      />,
    )
    const nav = screen.getByRole('navigation', { name: 'Você está em' })
    expect(within(nav).getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '/projects')
    expect(within(nav).queryByRole('link', { name: 'Sprint 11' })).not.toBeInTheDocument()
    expect(within(nav).getByText('Sprint 11')).toHaveAttribute('aria-current', 'page')
  })
})
