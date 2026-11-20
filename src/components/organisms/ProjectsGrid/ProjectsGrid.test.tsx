import { screen } from '@testing-library/react'
import { projects } from '@/data/projects'
import { renderWithProviders } from '@/test/utils'
import { ProjectsGrid } from './ProjectsGrid'

describe('ProjectsGrid', () => {
  it('renderiza um card por projeto, na ordem dos dados', () => {
    renderWithProviders(<ProjectsGrid />)
    const titles = screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent)
    expect(titles).toEqual(projects.map((p) => p.title))
  })

  it('aceita lista customizada', () => {
    renderWithProviders(<ProjectsGrid projects={projects.slice(0, 2)} />)
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })
})
