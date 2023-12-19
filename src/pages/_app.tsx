import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import { DataContextProvider } from '@/contexts/WorkContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Head } from 'next/document'
import { Montserrat } from "next/font/google"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont"
})

export default function App({ Component, pageProps }: AppProps) {

  return (
    <main className={`${montserrat.variable} font-mont bg-light w-full min-h-screen dark:text-zinc-400 dark:bg-zinc-900`}>
      <DataContextProvider>
        <NavBar />
        <Component />
        <Footer />
      </DataContextProvider>
    </main>
  )
}
