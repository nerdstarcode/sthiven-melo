import { useCurrentLanguage, type SupportedLanguage } from '@/contexts/LanguageContext'
import { dictionaries, type Namespace } from './dictionaries'
import type { Localized } from './types'

export type { Localized } from './types'
export type { Namespace } from './dictionaries'

export type Translation<N extends Namespace> = (typeof dictionaries)[N]['pt']

/** Textos do namespace no idioma atual. Funciona sem provider (usa o idioma padrão). */
export function useTranslation<N extends Namespace>(namespace: N): Translation<N> {
  const language = useCurrentLanguage()
  return dictionaries[namespace][language] as Translation<N>
}

/** Resolve um valor `Localized` para o idioma informado. */
export function localize<T>(value: Localized<T>, language: SupportedLanguage): T {
  return value[language]
}

/** Resolve valores `Localized` (vindos de `src/data`) para o idioma atual. */
export function useLocalize() {
  const language = useCurrentLanguage()
  return <T>(value: Localized<T>): T => localize(value, language)
}
