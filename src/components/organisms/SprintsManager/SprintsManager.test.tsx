import { screen } from '@testing-library/react'
import { loadSprints } from '@/features/location-overview/lib/sprintsStorage'
import { demoSprints } from '@/features/seed/demoSeed'
import { apps } from '@/i18n/apps'
import { renderWithProviders } from '@/test/utils'
import { SprintsManager, validateSprint } from './SprintsManager'

const t = apps.pt.sprints
const base = {
  id: '',
  number: 1,
  fiscalYear: 'FY26-27',
  startDate: '2026-01-05',
  endDate: '2026-01-16',
  totalValidDays: 10,
}

describe('validateSprint', () => {
  it('sprint válida não tem erros', () => {
    expect(validateSprint(base, t)).toEqual({})
  })

  it('valida número, ano fiscal e datas', () => {
    expect(validateSprint({ ...base, number: 0, fiscalYear: '2026', startDate: '' }, t)).toEqual({
      number: t.numberInvalid,
      fiscalYear: t.fiscalYearInvalid,
      dates: t.datesRequired,
    })
  })

  it('início depois do fim é erro', () => {
    expect(validateSprint({ ...base, startDate: '2026-02-01' }, t)).toEqual({
      dates: t.datesOrder,
    })
  })
})

describe('SprintsManager', () => {
  it('lista as sprints com datas no formato brasileiro', async () => {
    renderWithProviders(<SprintsManager />)
    expect(await screen.findByRole('cell', { name: 'Sprint 10 - FY26-27' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '02/11/2026' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(demoSprints.length + 1)
  })

  it('cria uma sprint e normaliza o ano fiscal', async () => {
    const { user } = renderWithProviders(<SprintsManager />)
    await user.click(await screen.findByRole('button', { name: 'Adicionar sprint' }))
    const number = screen.getByLabelText('Número da sprint')
    await user.clear(number)
    await user.type(number, '13')
    await user.type(screen.getByLabelText('Ano fiscal'), 'fy26-27')
    await user.type(screen.getByLabelText('Início'), '2026-12-14')
    await user.type(screen.getByLabelText('Fim'), '2026-12-25')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(loadSprints().find((s) => s.number === 13)).toMatchObject({
      fiscalYear: 'FY26-27',
      startDate: '2026-12-14',
    })
  })

  it('mostra os erros de validação no formulário', async () => {
    const { user } = renderWithProviders(<SprintsManager />)
    await user.click(await screen.findByRole('button', { name: 'Adicionar sprint' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByLabelText('Ano fiscal')).toHaveAccessibleDescription(t.fiscalYearInvalid)
    expect(screen.getByLabelText('Início')).toHaveAccessibleDescription(t.datesRequired)
  })

  it('exclui uma sprint', async () => {
    const { user } = renderWithProviders(<SprintsManager />)
    await user.click(await screen.findByRole('button', { name: 'Excluir Sprint 12 - FY26-27' }))
    expect(loadSprints().some((s) => s.id === 'sp-12')).toBe(false)
  })
})
