import { render, screen } from '@testing-library/react'
import { GlowingCube } from './GlowingCube'

describe('GlowingCube', () => {
  it('renderiza o cubo com a animação de rotação', () => {
    render(<GlowingCube />)
    expect(screen.getByTestId('glowing-cube')).toHaveClass('rotate-cube')
  })

  it('tem quatro faces laterais posicionadas a 90° entre si', () => {
    render(<GlowingCube />)
    const faces = screen.getByTestId('glowing-cube').querySelectorAll('span')
    expect(faces).toHaveLength(4)
    expect(faces[0].style.transform).toBe('rotateY(270deg) translateZ(75px)')
  })
})
