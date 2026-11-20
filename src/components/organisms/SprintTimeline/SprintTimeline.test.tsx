import { screen } from '@testing-library/react'
import { demoTimelineRows } from '@/features/seed/demoPlanning'
import { renderWithProviders } from '@/test/utils'
import { SprintTimeline, visibleTimelineRows } from './SprintTimeline'

const ids = (filter: 'active' | 'closed' | 'all') =>
  visibleTimelineRows(demoTimelineRows, filter).map((r) => r.sprint.id)

describe('visibleTimelineRows', () => {
  it('filtra pela fase', () => {
    expect(ids('active')).toEqual(['sp-11', 'sp-12'])
    expect(ids('closed')).toEqual(['sp-10'])
    expect(ids('all')).toEqual(['sp-10', 'sp-11', 'sp-12'])
  })
})

describe('SprintTimeline', () => {
  const handlers = () => ({
    onPhaseFilterChange: vi.fn(),
    onOpen: vi.fn(),
    onCreate: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  })

  it('editar não abre a sprint', async () => {
    const h = handlers()
    const { user } = renderWithProviders(
      <SprintTimeline rows={demoTimelineRows} phaseFilter='all' {...h} />,
    )
    await user.click(screen.getByRole('button', { name: 'Editar Sprint 10 - FY26-27' }))
    expect(h.onEdit).toHaveBeenCalledWith(demoTimelineRows[0].sprint)
    expect(h.onOpen).not.toHaveBeenCalled()
  })

  it('mostra a situação planejado × previsto de cada sprint', () => {
    renderWithProviders(<SprintTimeline rows={demoTimelineRows} phaseFilter='all' {...handlers()} />)
    expect(screen.getByRole('row', { name: 'Abrir Sprint 11 - FY26-27' })).toHaveTextContent(
      'Atual',
    )
  })

  it('mensagem do filtro vazio', () => {
    renderWithProviders(
      <SprintTimeline rows={demoTimelineRows.slice(1)} phaseFilter='closed' {...handlers()} />,
    )
    expect(screen.getByText('Nenhuma sprint nesta situação.')).toBeInTheDocument()
  })
})
