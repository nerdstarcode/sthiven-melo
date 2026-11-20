import { render, screen } from '@testing-library/react'
import { ThreeScene } from './ThreeScene'

const rendererMock = vi.hoisted(() => {
  const canvas = () => document.createElement('canvas')
  return {
    instances: [] as { domElement: HTMLCanvasElement; dispose: ReturnType<typeof vi.fn> }[],
    canvas,
  }
})

vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three')>()
  class WebGLRenderer {
    domElement = rendererMock.canvas()
    dispose = vi.fn()
    setSize = vi.fn()
    render = vi.fn()
    constructor() {
      rendererMock.instances.push(this)
    }
  }
  return { ...actual, WebGLRenderer }
})

describe('ThreeScene', () => {
  beforeEach(() => {
    rendererMock.instances.length = 0
  })

  it('anexa um único canvas ao container', () => {
    render(<ThreeScene />)
    expect(screen.getByTestId('three-scene').querySelectorAll('canvas')).toHaveLength(1)
  })

  it('ao desmontar, cancela o loop, libera o renderer e remove o canvas', () => {
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    const { unmount, container } = render(<ThreeScene />)
    unmount()
    expect(cancel).toHaveBeenCalled()
    expect(rendererMock.instances[0].dispose).toHaveBeenCalledTimes(1)
    expect(container.querySelector('canvas')).toBeNull()
  })
})
