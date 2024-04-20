import React from 'react';
import { motion } from 'framer-motion'

export interface AnimatedTextProps {
  text?: string;
  x?: string;
  y?: string;
}

export default function Skills({ text = 'Web', x = '0vw', y = '0vh' }: AnimatedTextProps) {

  return (
    <motion.div
      className={`
        flex
        items-center
        justify-center
        rounded-full
        dont-semibold
        bg-dark
        text-light
        shadow-[0px_0px_28px_0px_rgba(126,_34,_206,_.5)] 
        cursor-pointer
        absolute
        text-[.5rem]
        p-3
        sm:text-sm
        sm:p-8
      `}
      initial={{ x: 0, y: 0, scale: 0, }}
      whileInView={{ x, y, scale: 1, }}
      viewport={{ once: true }}
      transition={{ duration: 1.5 }}
      whileHover={{ scale: 1.05 }}
    >
      {text}
    </motion.div>
  )
}
