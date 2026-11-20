import type { AppProps } from 'next/app'
import { Montserrat } from 'next/font/google'
import { PageLayout } from '@/components/templates/PageLayout'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { DataContextProvider } from '@/contexts/WorkContext'
import '@/styles/globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataContextProvider>
          <PageLayout className={montserrat.variable}>
            <Component {...pageProps} />
          </PageLayout>
        </DataContextProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
