import { readList, writeJson } from './localStore'

export interface Squad {
  id: string
  name: string
  /** Outros nomes da mesma squad (ex.: "Renewals Team" para "Renewals"), reconhecidos em todo o app. */
  aliases?: string[]
  /** Skills que a squad precisa, com o nível mínimo (1–5). Usadas no overview de cobertura. */
  requiredSkills?: RequiredSkill[]
}

export interface RequiredSkill {
  skillId: string
  minLevel: number
}

const STORAGE_KEY = 'location-overview:squads'

export function loadSquads(): Squad[] {
  return readList<Squad>(STORAGE_KEY)
}

export function saveSquads(squads: Squad[]): void {
  writeJson(STORAGE_KEY, squads)
}

/** Cria (sem id) ou atualiza (com id existente) uma squad, mantendo a lista ordenada por nome. */
export function upsertSquad(squad: Squad): Squad[] {
  const squads = loadSquads()
  const index = squads.findIndex((s) => s.id === squad.id)
  const next = index >= 0 ? squads.map((s, i) => (i === index ? squad : s)) : [...squads, squad]
  next.sort((a, b) => a.name.localeCompare(b.name))
  saveSquads(next)
  return next
}

export function deleteSquad(id: string): Squad[] {
  const next = loadSquads().filter((s) => s.id !== id)
  saveSquads(next)
  return next
}
