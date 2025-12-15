import Footer from '@/components/Footer'
import Logo from '@/components/Logo'
import NavBar from '@/components/NavBar'
import { DataContextProvider } from '@/contexts/WorkContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Montserrat } from "next/font/google"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont"
})

export default function App({ Component, pageProps }: AppProps) {

  return (
    <main className={`${montserrat.variable} font-mont w-full min-h-screen text-zinc-400 bg-zinc-900`}>
      <ThemeProvider>
        <LanguageProvider>
          <DataContextProvider>
            <NavBar />
            <Component />
            <Footer />
            <div className='md:hidden sticky flex bottom-0 h-20 rounded-lg bg-black/50 backdrop-blur-md'>
              <div className='m-auto w-8/12 !text-xs'>
                <Logo />
              </div>
            </div>
          </DataContextProvider>
        </LanguageProvider>
      </ThemeProvider>
    </main>
  )
}
