import { screen } from '@testing-library/react'
import type { CodeOnlyProject, FeaturedProject } from '@/data/projects'
import { renderWithProviders } from '@/test/utils'
import { ProjectCard } from './ProjectCard'

const image = { src: '/p.png', width: 1, height: 1 }

const featured: FeaturedProject = {
  id: 'f',
  variant: 'featured',
  title: 'Site',
  link: 'https://site.dev',
  image,
  type: 'Frontend',
  summary: { pt: 'resumo pt', en: 'summary en', es: 'resumen es' },
}

const codeOnly: CodeOnlyProject = {
  id: 'c',
  variant: 'codeOnly',
  title: 'Lib',
  github: 'https://github.com/x/lib',
  image,
  type: 'Others',
}

describe('ProjectCard', () => {
  it('featured: mostra resumo traduzido e aponta para o link do projeto', () => {
    renderWithProviders(<ProjectCard project={featured} />, { language: 'en' })
    expect(screen.getByText('summary en')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Project' })).toHaveAttribute(
      'href',
      'https://site.dev',
    )
    expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument()
  })

  it('codeOnly: sem resumo, links apontam para o GitHub', () => {
    renderWithProviders(<ProjectCard project={codeOnly} />)
    expect(screen.getByRole('link', { name: 'Ver projeto' })).toHaveAttribute(
      'href',
      codeOnly.github,
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', codeOnly.github)
    expect(screen.queryByText(/resumo/)).not.toBeInTheDocument()
  })

  it('traduz o tipo do projeto', () => {
    renderWithProviders(<ProjectCard project={codeOnly} />, { language: 'es' })
    expect(screen.getByText('Otros')).toBeInTheDocument()
  })

  it('título é um heading com link externo seguro', () => {
    renderWithProviders(<ProjectCard project={featured} />)
    const titleLink = screen.getByRole('heading', { name: 'Site' }).closest('a')
    expect(titleLink).toHaveAttribute('target', '_blank')
    expect(titleLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
