import { render, screen } from '@testing-library/react'
import { ChartCard } from './ChartCard'

describe('ChartCard', () => {
  it('mostra título, descrição e conteúdo', () => {
    render(
      <ChartCard title='Burnup' description='Por dia'>
        <p>gráfico</p>
      </ChartCard>,
    )
    expect(screen.getByRole('region', { name: 'Burnup' })).toBeInTheDocument()
    expect(screen.getByText('Por dia')).toBeInTheDocument()
    expect(screen.getByText('gráfico')).toBeInTheDocument()
  })

  it('vazio mostra a mensagem no lugar do conteúdo', () => {
    render(
      <ChartCard title='Burnup' isEmpty emptyMessage='Sem dados'>
        <p>gráfico</p>
      </ChartCard>,
    )
    expect(screen.getByText('Sem dados')).toBeInTheDocument()
    expect(screen.queryByText('gráfico')).not.toBeInTheDocument()
  })
})
