import { format } from './format'

describe('format', () => {
  it('substitui as chaves', () => {
    expect(format('{a} de {b}', { a: 1, b: 'dez' })).toBe('1 de dez')
  })

  it('mantém chaves sem valor', () => {
    expect(format('{a} {x}', { a: 'ok' })).toBe('ok {x}')
  })
})
