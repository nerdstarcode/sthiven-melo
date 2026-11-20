import { AnimatePresence, motion } from 'motion/react'
import { isActivePath, NavLink } from '@/components/atoms/NavLink'
import { LanguageSwitcher } from '@/components/molecules/LanguageSwitcher'
import { SocialLinks } from '@/components/molecules/SocialLinks'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import { NAV_ITEMS } from '@/constants/navigation'
import { useTranslation } from '@/i18n'

export interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  /** Rota atual, para destacar o link ativo. */
  pathname: string
}

/** Overlay de navegação do mobile: idioma, tema, links e redes sociais. Fecha ao clicar fora. */
export function MobileMenu({ isOpen, onClose, pathname }: MobileMenuProps) {
  const t = useTranslation('nav')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid='mobile-menu-overlay'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex h-screen items-center justify-center bg-black/70 backdrop-blur-lg md:hidden'
          onClick={onClose}
        >
          <motion.nav
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='flex w-full justify-center px-6'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='flex w-full max-w-sm flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/5 px-6 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl'>
              <div className='flex items-center gap-4'>
                <LanguageSwitcher className='border-zinc-600/70 bg-zinc-900/70' />
                <ThemeToggle className='border-zinc-600' />
              </div>

              <div className='flex w-full flex-col gap-4 text-center text-2xl font-semibold text-light'>
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.key}
                    href={item.href}
                    isActive={isActivePath(pathname, item.href)}
                    className='text-base tracking-wide'
                    onClick={onClose}
                  >
                    {t[item.key]}
                  </NavLink>
                ))}
              </div>

              <SocialLinks className='gap-6 pt-2' />
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
