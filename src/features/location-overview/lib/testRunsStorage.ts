import type { TestRunsSummary } from './azure/mappers'
import { readList, writeJson } from './localStore'

/** Resumo dos test runs de uma squad numa sprint, gravado pela sincronização com o Azure. */
export interface StoredTestRuns {
  squadId: string
  sprintId: string
  summary: TestRunsSummary
}

const STORAGE_KEY = 'location-overview:test-runs'

export function loadTestRuns(): StoredTestRuns[] {
  return readList<StoredTestRuns>(STORAGE_KEY)
}

export function saveTestRuns(list: StoredTestRuns[]): void {
  writeJson(STORAGE_KEY, list)
}

export function findTestRuns(
  list: StoredTestRuns[],
  squadId: string,
  sprintId: string,
): TestRunsSummary | null {
  return list.find((e) => e.squadId === squadId && e.sprintId === sprintId)?.summary ?? null
}

/** Grava (ou substitui) o resumo da squad/sprint. */
export function upsertTestRuns(entry: StoredTestRuns): StoredTestRuns[] {
  const others = loadTestRuns().filter(
    (e) => !(e.squadId === entry.squadId && e.sprintId === entry.sprintId),
  )
  const next = [...others, entry]
  saveTestRuns(next)
  return next
}
