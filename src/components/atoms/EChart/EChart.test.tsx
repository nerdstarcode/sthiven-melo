import { render, screen } from '@testing-library/react'
import { EChart } from './EChart'

describe('EChart', () => {
  it('expõe o gráfico como imagem com a descrição', () => {
    render(<EChart label='Burnup da sprint' option={{ series: [] }} />)
    expect(screen.getByRole('img', { name: 'Burnup da sprint' })).toBeInTheDocument()
  })

  it('carrega o ECharts depois de montar, com as séries da opção', async () => {
    render(<EChart label='Gráfico' option={{ series: [{ type: 'bar', name: 'SP' }] }} />)
    expect(await screen.findByTestId('echart')).toHaveAttribute('data-series', 'SP')
  })

  it('usa a altura informada', () => {
    render(<EChart label='Gráfico' height={200} option={{}} />)
    expect(screen.getByRole('img')).toHaveStyle({ height: '200px' })
  })
})
