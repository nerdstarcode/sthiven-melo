import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  DEFAULT_LANGUAGE,
  LanguageContext,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@/contexts/LanguageContext'

export interface LanguageSwitcherProps {
  /** Idioma selecionado. Sem a prop, usa o `LanguageContext`. */
  language?: SupportedLanguage
  /** Chamado ao escolher um idioma. Sem a prop, atualiza o `LanguageContext`. */
  onChange?: (language: SupportedLanguage) => void
  className?: string
}

export function LanguageSwitcher({ language, onChange, className }: LanguageSwitcherProps) {
  const ctx = useContext(LanguageContext)
  const current = language ?? ctx?.language ?? DEFAULT_LANGUAGE
  const select = onChange ?? ctx?.setLanguage

  return (
    <div
      role='group'
      aria-label='Idioma / Language'
      className={twMerge(
        'flex items-center gap-1 rounded-full border border-zinc-700/70 bg-zinc-900/80 px-2 py-1 text-xs',
        className,
      )}
    >
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isSelected = current === lang
        return (
          <button
            key={lang}
            type='button'
            aria-pressed={isSelected}
            onClick={() => select?.(lang)}
            className={twMerge(
              'rounded-full px-2 py-0.5 tracking-wide uppercase transition-colors',
              isSelected ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-yellow-300',
            )}
          >
            {lang}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
