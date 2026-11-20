import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'

export interface BreadcrumbItem {
  label: string
  /** Sem `href` (ou o último item) aparece como texto. */
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  'aria-label': string
}

/** Trilha de navegação: cada nível é um link e o último é a página atual. */
export function Breadcrumb({ items, 'aria-label': ariaLabel }: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel}>
      <ol className='flex flex-wrap items-center gap-1 text-xs text-fg'>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {item.href && !last ? (
                  <Link href={item.href} className='hover:text-accent'>
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? 'page' : undefined}
                    className={last ? 'font-medium text-fg-strong' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!last && (
                <li aria-hidden className='text-fg/60'>
                  <ChevronRight size={12} />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
