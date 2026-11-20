import { useMemo } from 'react'
import { Badge, type BadgeTone } from '@/components/atoms/Badge'
import { ProficiencyRating } from '@/components/molecules/ProficiencyRating'
import { StatCard } from '@/components/molecules/StatCard'
import type { Person } from '@/features/location-overview/lib/peopleStorage'
import type { PersonAllocation } from '@/features/location-overview/lib/personAllocationsStorage'
import {
  computeSquadCoverage,
  summarizeCoverage,
  type CoverageStatus,
} from '@/features/location-overview/lib/skillCoverage'
import type { Squad } from '@/features/location-overview/lib/squadsStorage'
import { SKILL_TYPES, type PersonSkill, type Skill } from '@/features/skills/lib/skillsStorage'
import { format, useTranslation } from '@/i18n'

const STATUS_TONE: Record<CoverageStatus, BadgeTone> = {
  covered: 'success',
  partial: 'warning',
  gap: 'danger',
}

export interface SkillCoveragePanelProps {
  squad: Pick<Squad, 'id' | 'requiredSkills'>
  sprintId: string
  allocations: PersonAllocation[]
  people: Person[]
  skills: Skill[]
  personSkills: PersonSkill[]
}

/**
 * Cobertura das skills requeridas pela squad na sprint, separada em hard e soft:
 * coberta (alguém atinge o mínimo), parcial (alguém tem, abaixo do mínimo) ou gap (ninguém).
 */
export function SkillCoveragePanel({
  squad,
  sprintId,
  allocations,
  people,
  skills,
  personSkills,
}: SkillCoveragePanelProps) {
  const t = useTranslation('apps')
  const coverage = useMemo(
    () => computeSquadCoverage(squad, sprintId, allocations, personSkills, skills),
    [squad, sprintId, allocations, personSkills, skills],
  )
  const nameOf = useMemo(() => new Map(people.map((p) => [p.id, p.nome])), [people])
  const statusLabel: Record<CoverageStatus, string> = {
    covered: t.coverage.covered,
    partial: t.coverage.partial,
    gap: t.coverage.gap,
  }

  if (coverage.length === 0) {
    return (
      <section aria-label={t.coverage.title} className='rounded-md border border-line p-4'>
        <h3 className='text-base font-semibold text-fg-strong'>{t.coverage.title}</h3>
        <p className='mt-1 text-sm text-fg'>{t.coverage.noRequirements}</p>
      </section>
    )
  }

  const total = summarizeCoverage(coverage)

  return (
    <section aria-label={t.coverage.title} className='flex flex-col gap-4'>
      <div>
        <h3 className='text-base font-semibold text-fg-strong'>{t.coverage.title}</h3>
        <p className='text-sm text-fg'>{t.coverage.description}</p>
      </div>

      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        <StatCard
          label={t.coverage.title}
          value={format(t.coverage.summary, { covered: total.covered, total: total.total })}
        />
        <StatCard label={t.coverage.covered} value={total.covered} />
        <StatCard label={t.coverage.partial} value={total.partial} />
        <StatCard
          label={t.coverage.gap}
          value={total.gap}
          alert={total.gap > 0 ? t.coverage.nobody : undefined}
        />
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        {SKILL_TYPES.map((type) => {
          const items = coverage.filter((c) => c.skill.type === type)
          if (items.length === 0) return null
          const heading = type === 'hard' ? t.skills.hardPlural : t.skills.softPlural
          const summary = summarizeCoverage(coverage, type)
          return (
            <div key={type} className='rounded-md border border-line p-4'>
              <h4 className='mb-3 flex items-center justify-between text-sm font-semibold text-fg-strong'>
                <Badge tone={type}>{heading}</Badge>
                <span className='text-xs font-normal text-fg'>
                  {format(t.coverage.summary, { covered: summary.covered, total: summary.total })}
                </span>
              </h4>
              <ul className='flex flex-col gap-3'>
                {items.map((item) => (
                  <li key={item.skill.id} className='flex flex-col gap-1'>
                    <div className='flex items-center justify-between gap-2'>
                      <span className='text-sm text-fg-strong'>{item.skill.name}</span>
                      <Badge tone={STATUS_TONE[item.status]}>{statusLabel[item.status]}</Badge>
                    </div>
                    <div className='flex items-center gap-2 text-xs text-fg'>
                      <ProficiencyRating
                        size='sm'
                        label={`${t.coverage.best} ${item.skill.name}`}
                        value={item.bestLevel}
                        minLevel={item.minLevel}
                      />
                      <span>
                        {t.coverage.required}: {item.minLevel}
                      </span>
                    </div>
                    <p className='text-xs text-fg'>
                      {item.holders.length === 0
                        ? t.coverage.nobody
                        : `${t.coverage.holders}: ${item.holders
                            .map((h) => `${nameOf.get(h.personId) ?? '—'} (${h.level})`)
                            .join(', ')}`}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default SkillCoveragePanel
