import React from 'react';
import { motion } from 'framer-motion'

const quote = {
  initial:{
    opacity:1,
  },
  animate:{ 
    opacity:1,
    transition:{
      delay:0.5,
      staggerChildren: 0.08,
    }
  }
}

const singleWord = {
  initial:{
    opacity:0,
    y:50,
  },
  animate:{ 
    opacity:1,
    y:0,
    transition:{
      duration:1
    }
  }
}

export interface AnimatedTextProps {
  text?: string;
  className?: string;
  Tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
}

export default function AnimatedText({ text, className = '', Tag = 'h2' }: AnimatedTextProps) {
  const MotionText:any = motion(Tag)
  
  return (
    <div className={`w-full mx-auto py-2 flex items-center justify-center text-center overflow-hidden`}>
      <MotionText variants={quote} initial='initial' animate='animate' className={`inline-block w-full text-dark dark:text-zinc-200 font-bold capitalize text-4xl md:text-4xl xl:text-8xl ${className}`}>
        {
          text?.split(' ').map((word: string, index: number): any => {
            return (
              <motion.span variants={singleWord} key={`${word}-${index}`} className='inline-block '>
                {word}&nbsp;
              </motion.span>
            )
          })
        }
      </MotionText>
    </div>
  )
}
