import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Footer } from '@/components/organisms/Footer'
import { Logo } from '@/components/organisms/Logo'
import { NavBar } from '@/components/organisms/NavBar'

export interface PageLayoutProps {
  children: ReactNode
  className?: string
}

/** Casca de todas as páginas: NavBar, conteúdo (`<main>`), Footer e a barra da Logo no mobile. */
export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={twMerge('min-h-screen w-full bg-zinc-900 font-mont text-zinc-400', className)}>
      <NavBar />
      <main>{children}</main>
      <Footer />
      <div className='sticky bottom-0 flex h-20 rounded-lg bg-black/50 backdrop-blur-md md:hidden'>
        <div className='m-auto w-8/12 text-xs!'>
          <Logo />
        </div>
      </div>
    </div>
  )
}

export default PageLayout
