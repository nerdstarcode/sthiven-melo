import { twMerge } from 'tailwind-merge'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  'aria-label': string
}

/** Grupo de botões exclusivos (um filtro com poucas opções). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role='group'
      aria-label={ariaLabel}
      className='inline-flex rounded-md border border-line bg-surface-muted p-0.5'
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type='button'
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={twMerge(
              'rounded px-3 py-1 text-xs font-medium text-fg transition-colors hover:text-fg-strong',
              active && 'bg-surface-elevated text-accent shadow-sm',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
