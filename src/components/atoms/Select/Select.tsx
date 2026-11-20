import { forwardRef, type SelectHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import { FIELD_CLASSES } from '@/components/atoms/Input'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  /** Primeira opção desabilitada, mostrada enquanto nada foi escolhido. */
  placeholder?: string
  invalid?: boolean
}

/** Select nativo no mesmo estilo do `Input`. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, invalid = false, className, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={twMerge(
        FIELD_CLASSES,
        'cursor-pointer',
        invalid ? 'border-danger' : 'border-line',
        className,
      )}
      {...props}
    >
      {placeholder && (
        <option value='' disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
})

export default Select
