import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement, ReactNode } from 'react'
import type { WorkSelection } from '@/constants/work'
import { LanguageProvider, type SupportedLanguage } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { DataContextProvider } from '@/contexts/WorkContext'

interface ProvidersOptions {
  language?: SupportedLanguage
  darkMode?: boolean
  work?: WorkSelection
}

/** Renderiza com os mesmos providers do `_app` e devolve um `user` do user-event. */
export function renderWithProviders(
  ui: ReactElement,
  { language, darkMode, work, ...options }: ProvidersOptions & RenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider initialDarkMode={darkMode}>
        <LanguageProvider initialLanguage={language}>
          <DataContextProvider initialWork={work}>{children}</DataContextProvider>
        </LanguageProvider>
      </ThemeProvider>
    )
  }
  return { user: userEvent.setup(), ...render(ui, { wrapper: Wrapper, ...options }) }
}
