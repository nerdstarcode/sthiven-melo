import type { PersonSkill, Skill, SkillType } from '@/features/skills/lib/skillsStorage'
import type { PersonAllocation } from './personAllocationsStorage'
import type { Squad } from './squadsStorage'

/**
 * - `covered`: alguém alocado tem nível ≥ mínimo
 * - `partial`: alguém alocado tem a skill, mas abaixo do mínimo
 * - `gap`: ninguém alocado tem a skill
 */
export type CoverageStatus = 'covered' | 'partial' | 'gap'

export interface SkillCoverage {
  skill: Skill
  minLevel: number
  /** Maior nível entre as pessoas alocadas (0 se ninguém tem). */
  bestLevel: number
  /** Pessoas alocadas que têm a skill, do maior para o menor nível. */
  holders: { personId: string; level: number }[]
  status: CoverageStatus
}

export function coverageStatus(bestLevel: number, minLevel: number): CoverageStatus {
  if (bestLevel <= 0) return 'gap'
  return bestLevel >= minLevel ? 'covered' : 'partial'
}

/** Pessoas com alocação > 0% na squad e sprint informadas. */
export function allocatedPersonIds(
  allocations: PersonAllocation[],
  squadId: string,
  sprintId: string,
): Set<string> {
  return new Set(
    allocations
      .filter((a) => a.squadId === squadId && a.sprintId === sprintId && a.percentage > 0)
      .map((a) => a.personId),
  )
}

/**
 * Cobertura das skills requeridas pela squad, considerando só quem está alocado
 * nela na sprint. Usa o maior nível entre os alocados; a % de alocação não pondera.
 * Requisitos de skills removidas do catálogo são ignorados.
 */
export function computeSquadCoverage(
  squad: Pick<Squad, 'id' | 'requiredSkills'>,
  sprintId: string,
  allocations: PersonAllocation[],
  personSkills: PersonSkill[],
  skills: Skill[],
): SkillCoverage[] {
  const skillById = new Map(skills.map((s) => [s.id, s]))
  const allocated = allocatedPersonIds(allocations, squad.id, sprintId)

  return (squad.requiredSkills ?? [])
    .filter((req) => skillById.has(req.skillId))
    .map((req) => {
      const holders = personSkills
        .filter((ps) => ps.skillId === req.skillId && allocated.has(ps.personId))
        .map(({ personId, level }) => ({ personId, level }))
        .sort((a, b) => b.level - a.level)
      const bestLevel = holders[0]?.level ?? 0
      return {
        skill: skillById.get(req.skillId)!,
        minLevel: req.minLevel,
        bestLevel,
        holders,
        status: coverageStatus(bestLevel, req.minLevel),
      }
    })
}

export interface CoverageSummary {
  total: number
  covered: number
  partial: number
  gap: number
}

export function summarizeCoverage(coverage: SkillCoverage[], type?: SkillType): CoverageSummary {
  const items = type ? coverage.filter((c) => c.skill.type === type) : coverage
  return {
    total: items.length,
    covered: items.filter((c) => c.status === 'covered').length,
    partial: items.filter((c) => c.status === 'partial').length,
    gap: items.filter((c) => c.status === 'gap').length,
  }
}
