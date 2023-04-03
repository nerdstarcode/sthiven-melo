import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
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
    <main className={`${montserrat.variable} font-mont bg-light w-full min-h-screen`}>
      <NavBar/>
      <Component {...pageProps} />
      <Footer/>
    </main>
  )
}
