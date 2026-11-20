import { screen } from '@testing-library/react'
import { apps } from '@/i18n/apps'
import { renderWithProviders } from '@/test/utils'
import { EMPTY_SPRINT, SprintFormModal, validateSprint } from './SprintFormModal'

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
    expect(validateSprint({ ...base, startDate: '2026-02-01' }, t)).toEqual({ dates: t.datesOrder })
  })
})

describe('SprintFormModal', () => {
  it('mostra os erros e não salva sprint inválida', async () => {
    const onSave = vi.fn()
    const { user } = renderWithProviders(
      <SprintFormModal sprint={EMPTY_SPRINT} onClose={vi.fn()} onSave={onSave} />,
    )
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByLabelText('Ano fiscal')).toHaveAccessibleDescription(t.fiscalYearInvalid)
    expect(onSave).not.toHaveBeenCalled()
  })

  it('salva com id gerado e ano fiscal em maiúsculas', async () => {
    const onSave = vi.fn()
    const { user } = renderWithProviders(
      <SprintFormModal sprint={{ ...base, fiscalYear: 'fy26-27' }} onClose={vi.fn()} onSave={onSave} />,
    )
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ fiscalYear: 'FY26-27', id: expect.any(String) }),
    )
  })

  it('editar mostra o título de edição', () => {
    renderWithProviders(
      <SprintFormModal sprint={{ ...base, id: 'sp-1' }} onClose={vi.fn()} onSave={vi.fn()} />,
    )
    expect(screen.getByRole('dialog', { name: 'Editar sprint' })).toBeInTheDocument()
  })
})
