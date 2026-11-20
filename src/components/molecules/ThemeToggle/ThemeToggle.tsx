import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { ThemeContext } from '@/contexts/ThemeContext'
import { useTranslation } from '@/i18n'

export interface ThemeToggleProps {
  /** Tema atual. Sem a prop, usa o `ThemeContext` (padrão: escuro). */
  isDark?: boolean
  /** Chamado ao clicar. Sem a prop, alterna o `ThemeContext`. */
  onToggle?: () => void
  className?: string
}

export function ThemeToggle({ isDark, onToggle, className }: ThemeToggleProps) {
  const ctx = useContext(ThemeContext)
  const t = useTranslation('nav')
  const dark = isDark ?? ctx?.darkMode ?? true

  const handleClick = () => {
    if (onToggle) onToggle()
    else ctx?.setDarkMode(!dark)
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      aria-label={t.toggleTheme}
      aria-pressed={dark}
      className={twMerge(
        'flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-xs shadow-xs transition-colors hover:border-yellow-400',
        className,
      )}
    >
      {dark ? '☾' : '☼'}
    </button>
  )
}

export default ThemeToggle
