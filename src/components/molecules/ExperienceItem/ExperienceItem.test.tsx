import { screen } from '@testing-library/react'
import type { Experience } from '@/data/experiences'
import { renderWithProviders } from '@/test/utils'
import { ExperienceItem } from './ExperienceItem'

const same = (value: string) => ({ pt: value, en: value, es: value })

const job: Experience = {
  id: 'job',
  position: { pt: 'Engenheiro', en: 'Engineer', es: 'Ingeniero' },
  company: 'ACME',
  companyLink: 'https://acme.dev',
  start: '2022/11',
  address: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' },
  summary: same('resumo'),
  description: same('descrição completa'),
  image: { src: { src: '/x.svg', width: 1, height: 1 }, alt: same('ilustração') },
}

describe('ExperienceItem', () => {
  it('mostra cargo traduzido e link da empresa', () => {
    renderWithProviders(<ExperienceItem experience={job} />, { language: 'en' })
    expect(screen.getByRole('heading')).toHaveTextContent('Engineer')
    expect(screen.getByRole('link', { name: 'ACME' })).toHaveAttribute('href', 'https://acme.dev')
  })

  it('emprego sem data final mostra "Atual"', () => {
    renderWithProviders(<ExperienceItem experience={job} />, { language: 'pt' })
    expect(screen.getByText('2022/11 - Atual | Brasil')).toBeInTheDocument()
  })

  it('sem período mostra só o local (sem " | " solto)', () => {
    renderWithProviders(<ExperienceItem experience={{ ...job, start: undefined }} />)
    expect(screen.getByText('Brasil')).toBeInTheDocument()
  })

  it('sem empresa não renderiza link', () => {
    renderWithProviders(
      <ExperienceItem experience={{ ...job, company: undefined, companyLink: undefined }} />,
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renderiza resumo (mobile) e descrição completa (desktop)', () => {
    renderWithProviders(<ExperienceItem experience={job} />)
    expect(screen.getByText('resumo')).toHaveClass('md:hidden')
    expect(screen.getByText('descrição completa')).toHaveClass('hidden', 'md:block')
  })

  it('inverte a ordem visual quando a imagem fica à direita', () => {
    renderWithProviders(<ExperienceItem experience={job} imageSide='right' />)
    expect(screen.getByRole('listitem')).toHaveClass('flex-row-reverse')
  })
})
