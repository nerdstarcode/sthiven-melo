export const WORK_AREAS = ['UI/UX', 'Front', 'Backend'] as const

export type WorkArea = (typeof WORK_AREAS)[number]

/** Sem área selecionada: a home mostra o Hero. */
export const NO_WORK_AREA = ''

export type WorkSelection = WorkArea | typeof NO_WORK_AREA
