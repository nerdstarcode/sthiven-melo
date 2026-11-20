import { forwardRef, type InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const FIELD_CLASSES =
  'h-10 w-full rounded-md border bg-surface-muted px-3 text-sm text-fg-strong outline-none transition-colors placeholder:text-fg/60 focus:border-accent disabled:cursor-not-allowed disabled:opacity-50'

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={twMerge(
        FIELD_CLASSES,
        invalid ? 'border-danger focus:border-danger' : 'border-line',
        className,
      )}
      {...props}
    />
  )
})

export default Input
