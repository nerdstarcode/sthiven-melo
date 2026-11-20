import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  document.documentElement.classList.remove('dark')
})

vi.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    asPath: '/',
    query: {},
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn().mockResolvedValue(undefined),
  }),
}))

class IntersectionObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

vi.stubGlobal(
  'matchMedia',
  vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
)

// O ECharts precisa de canvas, que o jsdom não tem: nos testes o gráfico vira um div com as séries.
vi.mock('echarts-for-react', async () => {
  const { createElement } = await import('react')
  return {
    default: ({ option }: { option: { series?: { name?: string }[] } }) =>
      createElement('div', {
        'data-testid': 'echart',
        'data-series': (option.series ?? []).map((s) => s.name ?? '').join('|'),
      }),
  }
})

// next/image exige width/height para `src` string (o que o Vite entrega nos imports estáticos).
vi.mock('next/image', async () => {
  const { createElement } = await import('react')
  return {
    default: ({ src, alt, priority: _priority, fill: _fill, ...props }: Record<string, unknown>) =>
      createElement('img', {
        ...props,
        alt,
        src: typeof src === 'string' ? src : (src as { src?: string })?.src,
      }),
  }
})
