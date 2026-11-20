import { motion } from 'motion/react'
import { twMerge } from 'tailwind-merge'

export interface HamburgerButtonProps {
  isOpen: boolean
  onClick: () => void
  label: string
}

const BAR = 'block h-0.5 rounded-full bg-light'

/** Botão de menu mobile que vira um "X" quando aberto. */
export function HamburgerButton({ isOpen, onClick, label }: HamburgerButtonProps) {
  return (
    <motion.button
      type='button'
      onClick={onClick}
      aria-label={label}
      aria-expanded={isOpen}
      whileTap={{ scale: 0.9 }}
      className='relative z-40 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-light shadow-lg'
    >
      <span aria-hidden className='relative flex h-5 w-6 flex-col items-center justify-between'>
        <span
          className={twMerge(
            BAR,
            'w-full origin-center transition-transform duration-200',
            isOpen && 'translate-y-2 rotate-45',
          )}
        />
        <span
          className={twMerge(
            BAR,
            'w-4 transition-opacity duration-150',
            isOpen ? 'opacity-0' : 'opacity-100',
          )}
        />
        <span
          className={twMerge(
            BAR,
            'w-full origin-center transition-transform duration-200',
            isOpen && '-translate-y-2 -rotate-45',
          )}
        />
      </span>
    </motion.button>
  )
}

export default HamburgerButton
