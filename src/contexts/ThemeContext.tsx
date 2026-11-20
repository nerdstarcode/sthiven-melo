import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface ThemeContextData {
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
}

export const ThemeContext = createContext<ThemeContextData | null>(null)

const FALLBACK_THEME: ThemeContextData = { darkMode: true, setDarkMode: () => {} }

interface ThemeProviderProps {
  children: ReactNode
  initialDarkMode?: boolean
}

export const ThemeProvider = ({ children, initialDarkMode = true }: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState(initialDarkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return <ThemeContext.Provider value={{ darkMode, setDarkMode }}>{children}</ThemeContext.Provider>
}

/** Fora do provider devolve um tema escuro inerte em vez de `null`. */
export const useThemeContext = (): ThemeContextData => useContext(ThemeContext) ?? FALLBACK_THEME
