import Link from 'next/link'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import type { WorkArea } from '@/constants/work'
import { DataContext } from '@/contexts/WorkContext'

export interface WorkTabProps {
  area: WorkArea
  /** Chamado ao clicar. Sem a prop, seleciona a área no `WorkContext`. */
  onSelect?: (area: WorkArea) => void
  className?: string
}

/**
 * Aba que aparece ao passar o mouse na `Logo` (precisa de um ancestral com a classe `group`)
 * e troca a seção exibida na home.
 */
export function WorkTab({ area, onSelect, className }: WorkTabProps) {
  const { setDataContextData } = useContext(DataContext)
  const select = onSelect ?? setDataContextData

  return (
    <Link
      href='/'
      onClick={() => select(area)}
      className={twMerge(
        'pointer-events-none flex translate-y-1 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[0.7rem] font-medium text-gray-100 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white/10 hover:text-gray-100 md:px-4 md:py-1.5 md:text-xs',
        className,
      )}
    >
      {area}
    </Link>
  )
}

export default WorkTab
