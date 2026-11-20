import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'md' | 'sm'

const BASE =
  'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-black hover:bg-accent-strong',
  secondary: 'border border-line text-fg-strong hover:bg-surface-elevated',
  danger: 'bg-danger text-white hover:bg-danger/85',
  ghost: 'text-fg hover:bg-surface-elevated hover:text-fg-strong',
}

const SIZES: Record<ButtonSize, string> = {
  md: 'px-4 py-2 text-sm',
  sm: 'px-2 py-1 text-xs',
}

/** Classes do botão, também usadas em links que precisam parecer botão. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return twMerge(BASE, VARIANTS[variant], SIZES[size], className)
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...props} />
  )
})

export default Button
