import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ShowcaseSectionProps {
  id?: string
  title: string
  description: string
  /** Demonstração exibida ao lado do texto. */
  children: ReactNode
  /** Lado da demonstração. */
  demoSide?: 'left' | 'right'
  /** Classes aplicadas ao título no hover da seção (ex.: `group-hover:text-blue-500`). */
  accentClassName?: string
}

/** Seção da página de exemplos: título + descrição ao lado de uma demonstração. */
export function ShowcaseSection({
  id,
  title,
  description,
  children,
  demoSide = 'right',
  accentClassName,
}: ShowcaseSectionProps) {
  return (
    <section
      id={id}
      className={twMerge(
        'group flex w-full items-center justify-between',
        demoSide === 'left' && 'flex-row-reverse',
      )}
    >
      <aside>
        <h3
          className={twMerge(
            'text-xl font-bold opacity-60 transition-all duration-700 group-hover:opacity-100 lg:text-3xl',
            accentClassName,
          )}
        >
          {title}
        </h3>
        <p>{description}</p>
      </aside>
      {children}
    </section>
  )
}

export default ShowcaseSection
