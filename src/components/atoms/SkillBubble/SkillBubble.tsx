import { motion } from 'motion/react'

export interface SkillBubbleProps {
  name?: string
  /** Deslocamento final a partir do centro (ex.: `-15vw`). */
  x?: string
  y?: string
}

export function SkillBubble({ name = 'Web', x = '0vw', y = '0vh' }: SkillBubbleProps) {
  return (
    <motion.div
      className='absolute flex cursor-pointer items-center justify-center rounded-full bg-dark p-3 text-[.5rem] font-semibold text-light shadow-[0px_0px_28px_0px_rgba(126,34,206,.5)] sm:p-8 sm:text-sm'
      initial={{ x: 0, y: 0, scale: 0 }}
      whileInView={{ x, y, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5 }}
      whileHover={{ scale: 1.05 }}
    >
      {name}
    </motion.div>
  )
}

export default SkillBubble
