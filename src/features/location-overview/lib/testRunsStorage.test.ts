import type { TestRunsSummary } from './azure/mappers'
import { findTestRuns, loadTestRuns, upsertTestRuns } from './testRunsStorage'

const summary = (runCount: number): TestRunsSummary => ({
  runCount,
  automatedRuns: 0,
  manualRuns: runCount,
  totalTests: runCount * 2,
  passed: runCount,
  failed: runCount,
  notRun: 0,
  notApplicable: 0,
  runsByDay: {},
})

describe('testRunsStorage', () => {
  it('começa vazio', () => {
    expect(loadTestRuns()).toEqual([])
  })

  it('grava e substitui o resumo da mesma squad/sprint', () => {
    upsertTestRuns({ squadId: 'a', sprintId: 's1', summary: summary(1) })
    upsertTestRuns({ squadId: 'b', sprintId: 's1', summary: summary(2) })
    upsertTestRuns({ squadId: 'a', sprintId: 's1', summary: summary(3) })
    const list = loadTestRuns()
    expect(list).toHaveLength(2)
    expect(findTestRuns(list, 'a', 's1')?.runCount).toBe(3)
    expect(findTestRuns(list, 'b', 's1')?.runCount).toBe(2)
  })

  it('devolve null quando não há resumo', () => {
    expect(findTestRuns([], 'a', 's1')).toBeNull()
  })
})
