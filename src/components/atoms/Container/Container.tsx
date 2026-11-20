import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ContainerProps {
  children?: ReactNode
  className?: string
}

/** Área de conteúdo com o padding horizontal/vertical padrão das páginas. */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={twMerge('z-0 flex h-full w-full flex-col bg-zinc-900 p-8 md:p-32', className)}>
      {children}
    </div>
  )
}

export default Container
