import { screen, within } from '@testing-library/react'
import {
  sprintPlanSummary,
  sprintSquadPlans,
} from '@/features/location-overview/lib/sprintPlanning'
import { demoPlanBase } from '@/features/seed/demoPlanning'
import { demoSprints, demoSquads } from '@/features/seed/demoSeed'
import { renderWithProviders } from '@/test/utils'
import { SprintSquadsPlan } from './SprintSquadsPlan'

const sprint = demoSprints[0]
const plans = sprintSquadPlans(sprint, demoSquads, demoPlanBase)

describe('SprintSquadsPlan', () => {
  it('mostra os números do card e o resumo da sprint', () => {
    renderWithProviders(
      <SprintSquadsPlan
        sprint={sprint}
        phase='closed'
        plans={plans}
        summary={sprintPlanSummary(plans)}
        coverage={new Map([['sq-web', { total: 4, covered: 3, partial: 1, gap: 0 }]])}
        onOpenSquad={vi.fn()}
        onCreateDefault={vi.fn()}
      />,
    )
    const web = screen.getByRole('button', { name: 'Abrir Frontend Web' })
    expect(within(web).getByText('2 pessoa(s) · 150% somados')).toBeInTheDocument()
    expect(within(web).getByText('No esperado')).toBeInTheDocument()
    expect(within(web).getByText('Skills: 3 cobertas · 0 gaps')).toBeInTheDocument()
    expect(within(web).getByRole('img')).toHaveAccessibleName(
      'Planejado 21 SP; previsto 20; máximo 27.5; máximo com extensão 35.8',
    )
    expect(screen.getByText('3 de 3')).toBeInTheDocument()
    expect(screen.getByText('Fechada')).toBeInTheDocument()
  })

  it('sem squads oferece cadastrar', async () => {
    const onCreateSquad = vi.fn()
    const { user } = renderWithProviders(
      <SprintSquadsPlan
        sprint={sprint}
        phase='open'
        plans={[]}
        summary={sprintPlanSummary([])}
        onOpenSquad={vi.fn()}
        onCreateDefault={vi.fn()}
        onCreateSquad={onCreateSquad}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Cadastrar squad' }))
    expect(onCreateSquad).toHaveBeenCalled()
  })
})
