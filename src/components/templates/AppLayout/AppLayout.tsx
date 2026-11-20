import { ArrowLeft, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useTranslation } from '@/i18n'

export interface AppNavItem {
  href: string
  label: string
  icon: LucideIcon
}

export interface AppLayoutProps {
  /** Nome do app (ex.: "Location Overview"). */
  appName: string
  /** Título da tela atual. */
  title: string
  description?: string
  navItems: AppNavItem[]
  /** Ações no topo da tela (ex.: backup, restaurar demonstração). */
  actions?: ReactNode
  children: ReactNode
}

/**
 * Casca dos apps internos de /projects: sidebar de navegação (vira faixa horizontal no mobile),
 * cabeçalho da tela e conteúdo. Fica dentro do `PageLayout` do portfólio.
 */
export function AppLayout({
  appName,
  title,
  description,
  navItems,
  actions,
  children,
}: AppLayoutProps) {
  const { pathname } = useRouter()
  const t = useTranslation('apps')

  return (
    <div className='mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 md:flex-row md:px-8'>
      <aside className='shrink-0 md:w-56'>
        <Link
          href='/projects'
          className='mb-4 inline-flex items-center gap-1 text-xs text-fg hover:text-accent'
        >
          <ArrowLeft size={14} aria-hidden /> {t.nav.backToProjects}
        </Link>
        <p className='mb-2 text-sm font-semibold text-fg-strong'>{appName}</p>
        <nav aria-label={t.nav.appMenu}>
          <ul className='flex gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0'>
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <li key={href} className='shrink-0'>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={twMerge(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap text-fg transition-colors hover:bg-surface-elevated hover:text-fg-strong',
                      active && 'bg-surface-elevated text-accent',
                    )}
                  >
                    <Icon size={16} aria-hidden />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <section className='min-w-0 flex-1'>
        <header className='mb-6 flex flex-wrap items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-fg-strong'>{title}</h1>
            {description && <p className='mt-1 text-sm text-fg'>{description}</p>}
          </div>
          {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
        </header>
        {children}
      </section>
    </div>
  )
}

export default AppLayout
