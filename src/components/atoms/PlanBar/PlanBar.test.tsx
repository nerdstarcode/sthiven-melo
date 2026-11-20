import { render, screen } from '@testing-library/react'
import { PlanBar } from './PlanBar'

const part = (name: string) =>
  screen.getByRole('img').querySelector<HTMLElement>(`[data-part='${name}']`)!

describe('PlanBar', () => {
  it('expõe a descrição acessível', () => {
    render(<PlanBar planned={10} capacity={20} max={30} maxExtended={40} label='Planejado 10' />)
    expect(screen.getByRole('img', { name: 'Planejado 10' })).toBeInTheDocument()
  })

  it('posiciona os marcadores na escala do maior valor', () => {
    render(<PlanBar planned={42} capacity={20} max={30} maxExtended={40} label='x' />)
    // escala = 42 × 1,05 = 44,1
    expect(part('planned').style.width).toBe(`${(42 / 44.1) * 100}%`)
    expect(part('capacity').style.left).toBe(`${(20 / 44.1) * 100}%`)
  })

  it('não estoura com tudo zerado', () => {
    render(<PlanBar planned={0} capacity={0} max={0} maxExtended={0} label='vazio' />)
    expect(part('planned').style.width).toBe('0%')
  })
})
