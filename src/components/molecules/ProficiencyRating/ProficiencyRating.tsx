import { twMerge } from 'tailwind-merge'
import { MAX_PROFICIENCY } from '@/features/skills/lib/skillsStorage'

export interface ProficiencyRatingProps {
  /** Nível de 0 (sem a skill) a 5. */
  value: number
  /** Sem `onChange`, vira só leitura. */
  onChange?: (level: number) => void
  /** Nome da skill, usado nos rótulos acessíveis. */
  label: string
  /** Marca o nível mínimo exigido (ex.: requisito da squad). */
  minLevel?: number
  size?: 'sm' | 'md'
}

const LEVELS = Array.from({ length: MAX_PROFICIENCY }, (_, i) => i + 1)

/** Escala de 1 a 5 em blocos; editável (radio group) ou só leitura (meter). */
export function ProficiencyRating({
  value,
  onChange,
  label,
  minLevel,
  size = 'md',
}: ProficiencyRatingProps) {
  const block = size === 'sm' ? 'h-2 w-3' : 'h-3 w-5'
  const blockClass = (level: number) =>
    twMerge(
      'rounded-sm transition-colors',
      block,
      level <= value ? 'bg-accent' : 'bg-line',
      minLevel === level && 'ring-1 ring-warning ring-offset-1 ring-offset-surface',
    )

  if (!onChange) {
    return (
      <span
        role='meter'
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={MAX_PROFICIENCY}
        aria-valuenow={value}
        className='inline-flex gap-0.5'
      >
        {LEVELS.map((level) => (
          <span key={level} className={blockClass(level)} />
        ))}
      </span>
    )
  }

  return (
    <span role='radiogroup' aria-label={label} className='inline-flex gap-0.5'>
      {LEVELS.map((level) => (
        <button
          key={level}
          type='button'
          role='radio'
          aria-checked={level === value}
          aria-label={`${label}: ${level}`}
          onClick={() => onChange(level)}
          className={twMerge(blockClass(level), 'cursor-pointer hover:bg-accent/70')}
        />
      ))}
    </span>
  )
}

export default ProficiencyRating
