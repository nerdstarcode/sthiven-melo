import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { LoadStatusChip, SprintPhaseChip } from './StatusChips'

describe('LoadStatusChip', () => {
  it('mostra o rótulo traduzido do status', () => {
    renderWithProviders(<LoadStatusChip status='overload' />)
    expect(screen.getByText('Sobrecarga').closest('.text-danger')).not.toBeNull()
  })

  it('sem status mostra "Sem alocação"', () => {
    renderWithProviders(<LoadStatusChip status={null} />)
    expect(screen.getByText('Sem alocação')).toBeInTheDocument()
  })

  it('segue o idioma', () => {
    renderWithProviders(<LoadStatusChip status='within' />, { language: 'en' })
    expect(screen.getByText('On target')).toBeInTheDocument()
  })
})

describe('SprintPhaseChip', () => {
  it('mostra a fase', () => {
    renderWithProviders(<SprintPhaseChip phase='current' />)
    expect(screen.getByText('Atual')).toBeInTheDocument()
  })
})
