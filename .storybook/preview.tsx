import type { Decorator, Preview } from '@storybook/nextjs-vite'
import { LanguageProvider, type SupportedLanguage } from '../src/contexts/LanguageContext'
import { ThemeProvider } from '../src/contexts/ThemeContext'
import { DataContextProvider } from '../src/contexts/WorkContext'
import '../src/styles/globals.css'

/** Envolve cada story com os mesmos providers e cores de fundo do `_app`. */
const withAppProviders: Decorator = (Story, context) => {
  const language = context.globals.locale as SupportedLanguage
  const darkMode = context.globals.theme !== 'light'

  return (
    <ThemeProvider key={`theme-${darkMode}`} initialDarkMode={darkMode}>
      <LanguageProvider key={`lang-${language}`} initialLanguage={language}>
        <DataContextProvider>
          <div className='min-h-full bg-zinc-900 p-4 font-mont text-zinc-400'>
            <Story />
          </div>
        </DataContextProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

const preview: Preview = {
  decorators: [withAppProviders],
  globalTypes: {
    locale: {
      description: 'Idioma do site',
      toolbar: {
        title: 'Idioma',
        icon: 'globe',
        items: [
          { value: 'pt', title: 'Português' },
          { value: 'en', title: 'English' },
          { value: 'es', title: 'Español' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Tema (classe dark no <html>)',
      toolbar: {
        title: 'Tema',
        icon: 'mirror',
        items: [
          { value: 'dark', title: 'Escuro' },
          { value: 'light', title: 'Claro' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { locale: 'pt', theme: 'dark' },
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    nextjs: { router: { pathname: '/' } },
  },
}

export default preview
