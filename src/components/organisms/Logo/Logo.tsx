import { motion } from 'motion/react'
import Link from 'next/link'
import { useContext } from 'react'
import { WorkTab } from '@/components/molecules/WorkTab'
import { NO_WORK_AREA, WORK_AREAS, type WorkSelection } from '@/constants/work'
import { DataContext } from '@/contexts/WorkContext'

const MotionLink = motion.create(Link)

const GRADIENT_CYCLE = [
  '#121212',
  'rgba(131,58,180,1)',
  'rgba(253,29,29,1)',
  'rgba(252,176,69,1)',
  'rgba(131,58,180,1)',
  '#121212',
]

export interface LogoProps {
  /** Chamado ao escolher uma área (ou ao clicar no "SM", com `''`). Sem a prop, usa o `WorkContext`. */
  onSelect?: (work: WorkSelection) => void
}

/** Logo "SM" animada. No hover mostra as abas de área, que trocam a seção da home. */
export function Logo({ onSelect }: LogoProps) {
  const { setDataContextData } = useContext(DataContext)
  const select = onSelect ?? setDataContextData

  return (
    <div className='group mt-2 flex items-center justify-center gap-4'>
      <MotionLink
        href='/'
        aria-label='Sthiven Melo - início'
        className='relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-linear-to-tr from-zinc-900 via-zinc-800 to-zinc-900 text-2xl font-bold shadow-[0_0_25px_rgba(88,230,217,0.35)] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(88,230,217,0.6)]'
        onClick={() => select(NO_WORK_AREA)}
        animate={{
          backgroundColor: GRADIENT_CYCLE,
          transition: { duration: 20, repeat: Infinity },
        }}
      >
        SM
      </MotionLink>

      <div className='flex flex-col items-start gap-2'>
        {WORK_AREAS.map((area) => (
          <WorkTab key={area} area={area} onSelect={select} />
        ))}
      </div>
    </div>
  )
}

export default Logo
