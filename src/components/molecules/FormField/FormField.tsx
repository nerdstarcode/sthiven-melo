import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { Input } from '@/components/atoms/Input'
import { Select, type SelectProps } from '@/components/atoms/Select'

interface FieldShellProps {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}

function FieldShell({ id, label, hint, error, children }: FieldShellProps) {
  const message = error ?? hint
  return (
    <div className='flex w-full flex-col gap-1'>
      <label htmlFor={id} className='text-xs font-medium text-fg'>
        {label}
      </label>
      {children}
      {message && (
        <p id={`${id}-message`} className={error ? 'text-xs text-danger' : 'text-xs text-fg'}>
          {message}
        </p>
      )}
    </div>
  )
}

interface FieldProps {
  label: string
  /** Texto de ajuda abaixo do campo. */
  hint?: string
  /** Mensagem de erro; substitui o `hint` e marca o campo como inválido. */
  error?: string
}

export type TextFieldProps = FieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & { id?: string }

/** Input com rótulo e mensagem de ajuda/erro ligados por aria. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, id, ...props },
  ref,
) {
  const generated = useId()
  const fieldId = id ?? generated
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error}>
      <Input
        ref={ref}
        id={fieldId}
        invalid={!!error}
        aria-describedby={error || hint ? `${fieldId}-message` : undefined}
        {...props}
      />
    </FieldShell>
  )
})

export type SelectFieldProps = FieldProps & Omit<SelectProps, 'id'> & { id?: string }

/** Select com rótulo e mensagem de ajuda/erro. */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, hint, error, id, ...props },
  ref,
) {
  const generated = useId()
  const fieldId = id ?? generated
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error}>
      <Select
        ref={ref}
        id={fieldId}
        invalid={!!error}
        aria-describedby={error || hint ? `${fieldId}-message` : undefined}
        {...props}
      />
    </FieldShell>
  )
})
