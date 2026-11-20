import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { isActivePath, NavLink } from '@/components/atoms/NavLink'
import { HamburgerButton } from '@/components/molecules/HamburgerButton'
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher'
import { SocialLinks } from '@/components/molecules/SocialLinks'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import { Logo } from '@/components/organisms/Logo'
import { MobileMenu } from '@/components/organisms/MobileMenu'
import { NAV_ITEMS } from '@/constants/navigation'
import { useTranslation } from '@/i18n'
import autismSymbol from '@p/autsm.svg'

/** Cabeçalho fixo: navegação, idioma, tema e redes no desktop; menu hambúrguer no mobile. */
export function NavBar() {
  const { pathname } = useRouter()
  const t = useTranslation('nav')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className='sticky top-0 z-30 flex w-full items-center justify-between bg-zinc-900/80 px-4 py-4 font-medium backdrop-blur-md sm:px-6 md:px-32 md:py-8'>
      <div className='flex items-center gap-3'>
        <Image
          className='h-12 w-12 sm:h-16 sm:w-16'
          src={autismSymbol}
          alt='Símbolo da neurodiversidade (autismo/TDAH)'
        />
        <nav className='hidden h-fit gap-6 md:flex'>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.key} href={item.href} isActive={isActivePath(pathname, item.href)}>
              {t[item.key]}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className='hidden flex-wrap items-center justify-center gap-4 md:flex'>
        <LanguageSwitcher />
        <ThemeToggle />
        <SocialLinks />
      </div>

      <div className='flex items-center gap-3 md:hidden'>
        <SocialLinks networks={['github']} />
        <HamburgerButton
          isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          label={t.openMenu}
        />
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} pathname={pathname} />
    </header>
  )
}

export default NavBar
