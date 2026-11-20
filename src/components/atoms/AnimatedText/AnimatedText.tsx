import { motion, type Variants } from 'motion/react'
import { twMerge } from 'tailwind-merge'

const container: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1, transition: { delay: 0.5, staggerChildren: 0.08 } },
}

const word: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 1 } },
}

/** Componentes `motion` criados uma única vez (antes eram recriados a cada render). */
const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
}

export type AnimatedTextTag = keyof typeof MOTION_TAGS

export interface AnimatedTextProps {
  text?: string
  className?: string
  Tag?: AnimatedTextTag
}

export function AnimatedText({ text = '', className, Tag = 'h2' }: AnimatedTextProps) {
  const MotionTag = MOTION_TAGS[Tag]

  return (
    <div className='mx-auto flex w-full items-center justify-center overflow-hidden py-2 text-center'>
      <MotionTag
        variants={container}
        initial='initial'
        animate='animate'
        className={twMerge(
          'inline-block w-full text-4xl font-bold text-zinc-200 capitalize md:text-4xl xl:text-8xl',
          className,
        )}
      >
        {text
          .split(' ')
          .filter(Boolean)
          .map((value, index) => (
            <motion.span variants={word} key={`${value}-${index}`} className='inline-block'>
              {value}&nbsp;
            </motion.span>
          ))}
      </MotionTag>
    </div>
  )
}

export default AnimatedText
