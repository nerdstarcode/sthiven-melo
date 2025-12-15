'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type SupportedLanguage = 'pt' | 'en' | 'es'

interface LanguageContextData {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
}

const LanguageContext = createContext<LanguageContextData | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('pt')

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('@nerdstarcode:language')
      if (stored === 'pt' || stored === 'en' || stored === 'es') {
        setLanguageState(stored)
      }
    } catch {
      // ignore
    }
  }, [])

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang)
    try {
      window.localStorage.setItem('@nerdstarcode:language', lang)
    } catch {
      // ignore
    }
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


