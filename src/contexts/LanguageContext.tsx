import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { LANGUAGE_STORAGE_KEY } from '@/constants/storage'

export const SUPPORTED_LANGUAGES = ['pt', 'en', 'es'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]
export const DEFAULT_LANGUAGE: SupportedLanguage = 'pt'

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
}

interface LanguageContextData {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
}

export const LanguageContext = createContext<LanguageContextData | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
  /** Idioma fixo inicial. Quando informado, o valor salvo no localStorage é ignorado (útil no Storybook). */
  initialLanguage?: SupportedLanguage
}

function readStoredLanguage(): SupportedLanguage | null {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isSupportedLanguage(stored) ? stored : null
  } catch {
    return null // localStorage indisponível (modo privado, SSR, etc.)
  }
}

function storeLanguage(lang: SupportedLanguage) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  } catch {
    // localStorage indisponível: a escolha vale só para esta sessão
  }
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(
    initialLanguage ?? DEFAULT_LANGUAGE,
  )

  useEffect(() => {
    if (initialLanguage) return
    const stored = readStoredLanguage()
    if (stored) setLanguageState(stored)
  }, [initialLanguage])

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang)
    storeLanguage(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguageContext() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  return ctx
}

/** Idioma atual sem exigir provider (cai no idioma padrão). Usado pelos componentes de UI. */
export function useCurrentLanguage(): SupportedLanguage {
  return useContext(LanguageContext)?.language ?? DEFAULT_LANGUAGE
}
