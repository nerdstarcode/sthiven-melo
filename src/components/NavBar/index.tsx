import Link from 'next/link';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import Logo from '../Logo';
import { useRouter, NextRouter } from 'next/router';
import { DribbbleIcon, GithubIcon, LinkedInIcon, PinterestIcon } from '../Icons';
import { AnimatePresence, motion } from 'framer-motion'
import { useThemeContext } from '@/contexts/ThemeContext';
import { SupportedLanguage, useLanguageContext } from '@/contexts/LanguageContext';
export interface CustomLinkProps {
  href: {
    pathname: string
    query?: { [key: string]: any }
    state?: { [key: string]: any }
  } | any
  classname?: string;
  target?: '_blank' | '_self';
  router?: NextRouter | undefined;
  children?: React.ReactNode;
  as?: string;
  onClick?: () => void;
}
const CustomLink = ({ href, as, classname = '', target, router, children, onClick }: CustomLinkProps) => {
  return (
    <Link
      href={href}
      as={as}
      className={`${classname} relative group text-zinc-400`}
      target={target}
      onClick={onClick}
    >
      {children}
      <span
        className={`h-[1px] inline-block bg-yellow-400 absolute left-0 bottom-0.5 group-hover:w-full transition-[width] ease duration-300
      ${router?.pathname === href.pathname || router?.pathname === href ? 'w-full' : 'w-0'}
      `}
      >
        &nbsp;
      </span>
    </Link>
  )
}
import instagram from '@p/insta.svg'
import autsm from '@p/autsm.svg'

type NavItem = {
  key: 'home' | 'about' | 'projects' | 'examples' | 'skills' | 'experience'
  href: string | { pathname: string; query?: Record<string, any> }
  as?: string
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'home',
    href: { pathname: '/', query: { nome: 'Home', object: '', como: '', valor: '' } },
    as: '/',
  },
  {
    key: 'about',
    href: { pathname: '/about', query: { nome: 'about' } },
    as: '/about',
  },
  {
    key: 'projects',
    href: '/projects',
  },
  {
    key: 'examples',
    href: '/examples',
  },
  {
    key: 'skills',
    href: '/about#skills',
  },
  {
    key: 'experience',
    href: '/about#experience',
  },
]

const navLabels: Record<SupportedLanguage, Record<NavItem['key'], string>> = {
  pt: {
    home: 'Início',
    about: 'Sobre',
    projects: 'Projetos',
    examples: 'Exemplos',
    skills: 'Skills',
    experience: 'Experiências',
  },
  en: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    examples: 'Examples',
    skills: 'Skills',
    experience: 'Experience',
  },
  es: {
    home: 'Inicio',
    about: 'Sobre mí',
    projects: 'Proyectos',
    examples: 'Ejemplos',
    skills: 'Skills',
    experience: 'Experiencias',
  },
}

export default function NavBar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { darkMode, setDarkMode } = useThemeContext()
  const { language, setLanguage } = useLanguageContext()

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang)
  }

  const isDark = darkMode ?? true

  const activePath = useMemo(() => router.pathname, [router.pathname])

  return (
    <header className='w-full px-4 sm:px-6 md:px-32 py-4 md:py-8 font-medium flex items-center justify-between sticky top-0 z-30 bg-zinc-900/80 backdrop-blur-md'>
      <div className='flex items-center gap-3'>
        <Image className='h-12 w-12 sm:h-16 sm:w-16' src={autsm} alt='autism-tdah' />

        {/* Desktop nav */}
        <nav className='hidden md:flex gap-6 h-fit'>
          {NAV_ITEMS.map((item) => (
            <CustomLink
              key={item.key}
              href={item.href}
              as={item.as}
              router={router}
            >
              {navLabels[language][item.key]}
            </CustomLink>
          ))}
        </nav>
      </div>

      {/* Desktop right actions */}
      <div className='hidden md:flex items-center justify-center flex-wrap gap-4'>
        {/* language switcher */}
        <div className='flex items-center gap-1 rounded-full border border-zinc-700/70 bg-zinc-900/80 px-2 py-1 text-xs'>
          {(['pt', 'en', 'es'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              type='button'
              onClick={() => handleLanguageChange(lang)}
              className={`px-2 py-0.5 rounded-full uppercase tracking-wide transition-colors ${
                language === lang ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-yellow-300'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* theme toggle */}
        <button
          type='button'
          onClick={() => setDarkMode && setDarkMode(!isDark)}
          className='flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-xs shadow-sm hover:border-yellow-400 transition-colors'
          aria-label='Alternar tema claro/escuro'
        >
          {isDark ? '☾' : '☼'}
        </button>

        {/* social links */}
        <motion.a
          href='https://www.instagram.com/nerd_star_code/'
          target='_blank'
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className='w-6'
        >
          <Image src={instagram} alt='insta' />
        </motion.a>
        <motion.a href='https://github.com/nerdstarcode' target='_blank' whileHover={{ y: -2 }} className='w-6' whileTap={{ scale: 0.9 }}>
          <GithubIcon />
        </motion.a>
        <motion.a href='https://www.linkedin.com/in/sthiven-melo-a67a1722b/' target='_blank' whileHover={{ y: -2 }} className='w-6' whileTap={{ scale: 0.9 }}>
          <LinkedInIcon />
        </motion.a>
      </div>

      {/* Mobile actions */}
      <div className='flex items-center gap-3 md:hidden'>
        <motion.a
          href='https://github.com/nerdstarcode'
          target='_blank'
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
          className='w-6'
        >
          <GithubIcon />
        </motion.a>

        <motion.button
          onClick={toggleMenu}
          aria-label='Toggle menu'
          aria-expanded={isOpen}
          whileTap={{ scale: 0.9 }}
          className='relative z-40 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-light shadow-lg'
        >
          <span className='sr-only'>Abrir menu</span>
          <div className='relative flex h-5 w-6 flex-col items-center justify-between'>
            <span
              className={`block h-0.5 w-full rounded-full bg-light transition-transform duration-200 origin-center ${
                isOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-4 rounded-full bg-light transition-opacity duration-150 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 w-full rounded-full bg-light transition-transform duration-200 origin-center ${
                isOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </div>
        </motion.button>
      </div>

      {/* Center logo */}
      <div className='hidden md:block absolute left-1/2 top-4 -translate-x-1/2'>
        <Logo />
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-black/70 backdrop-blur-lg md:hidden h-screen flex items-center justify-center'
            onClick={closeMenu}
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='w-full px-6 flex justify-center'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.7)] px-6 py-8 flex flex-col items-center gap-8'>
                {/* mobile language + theme */}
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-1 rounded-full border border-zinc-600/70 bg-zinc-900/70 px-2 py-1 text-xs'>
                    {(['pt', 'en', 'es'] as SupportedLanguage[]).map((lang) => (
                      <button
                        key={lang}
                        type='button'
                        onClick={() => handleLanguageChange(lang)}
                        className={`px-2 py-0.5 rounded-full uppercase tracking-wide ${
                          language === lang ? 'bg-yellow-400 text-black' : 'text-zinc-300 hover:text-yellow-300'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>

                  <button
                    type='button'
                    onClick={() => setDarkMode && setDarkMode(!isDark)}
                    className='flex h-9 w-9 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900/80 text-xs shadow-sm hover:border-yellow-400 transition-colors'
                    aria-label='Alternar tema claro/escuro'
                  >
                    {isDark ? '☾' : '☼'}
                  </button>
                </div>

                <div className='flex flex-col gap-4 text-2xl font-semibold text-light text-center w-full'>
                  {NAV_ITEMS.map((item) => (
                    <CustomLink
                    key={item.key}
                      href={item.href}
                      as={item.as}
                      router={router}
                      classname='text-base tracking-wide'
                      onClick={closeMenu}
                    >
                    {navLabels[language][item.key]}
                    </CustomLink>
                  ))}
                </div>

                <div className='flex items-center gap-6 pt-2'>
                  <motion.a href='https://www.instagram.com/nerd_star_code/' target='_blank' whileHover={{ y: -2 }} className='w-6' whileTap={{ scale: 0.9 }}>
                    <Image src={instagram} alt='insta' />
                  </motion.a>
                  <motion.a href='https://github.com/nerdstarcode' target='_blank' whileHover={{ y: -2 }} className='w-6' whileTap={{ scale: 0.9 }}>
                    <GithubIcon />
                  </motion.a>
                  <motion.a href='https://www.linkedin.com/in/sthiven-melo-a67a1722b/' target='_blank' whileHover={{ y: -2 }} className='w-6' whileTap={{ scale: 0.9 }}>
                    <LinkedInIcon />
                  </motion.a>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
