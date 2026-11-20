import Link from 'next/link'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface NavLinkProps {
  href: string
  children: ReactNode
  /** Mantém o sublinhado visível (rota atual). */
  isActive?: boolean
  className?: string
  onClick?: () => void
}

/** Link de navegação com sublinhado animado no hover e na rota ativa. */
export function NavLink({ href, children, isActive = false, className, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={twMerge('group relative text-zinc-400', className)}
    >
      {children}
      <span
        aria-hidden
        className={twMerge(
          'ease absolute bottom-0.5 left-0 inline-block h-px w-0 bg-yellow-400 transition-[width] duration-300 group-hover:w-full',
          isActive && 'w-full',
        )}
      >
        &nbsp;
      </span>
    </Link>
  )
}

/** A rota está ativa quando o `pathname` coincide com o `href` (âncoras e query não contam). */
export function isActivePath(pathname: string, href: string) {
  return pathname === href
}

export default NavLink
