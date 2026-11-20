import type { SupportedLanguage } from '@/contexts/LanguageContext'

/** Um valor traduzido para cada idioma suportado. */
export type Localized<T = string> = Record<SupportedLanguage, T>
