import { screen, within } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { AppsShowcase } from './AppsShowcase'

describe('AppsShowcase', () => {
  it('Location Overview abre o fluxo de sprints e tem atalhos para cada área', () => {
    renderWithProviders(<AppsShowcase />)
    const card = screen.getByRole('listitem', { name: 'Location Overview' })
    expect(within(card).getByRole('link', { name: 'Abrir Location Overview' })).toHaveAttribute(
      'href',
      '/projects/location-overview/sprints',
    )
    const flow = within(card).getByRole('navigation', { name: 'Fluxo Location Overview' })
    expect(within(flow).getByRole('link', { name: 'Alocações' })).toHaveAttribute(
      'href',
      '/projects/location-overview/alocacoes',
    )
    expect(within(card).getByText('TanStack Table')).toBeInTheDocument()
  })

  it('o projeto fictício aparece sem link', () => {
    renderWithProviders(<AppsShowcase />)
    const rpg = screen.getByRole('listitem', { name: 'Fichas de RPG' })
    expect(within(rpg).getByText('Projeto fictício')).toBeInTheDocument()
    expect(within(rpg).queryByRole('link')).not.toBeInTheDocument()
  })

  it('Skills Template abre o app', () => {
    renderWithProviders(<AppsShowcase />)
    const card = screen.getByRole('listitem', { name: 'Skills Template' })
    expect(within(card).getByRole('link', { name: 'Abrir Skills Template' })).toHaveAttribute(
      'href',
      '/projects/skills-template',
    )
    expect(within(card).queryByText('Em breve')).not.toBeInTheDocument()
  })
})
