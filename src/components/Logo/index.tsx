'use client'
import Link from 'next/link';
import React from 'react';
import { motion } from "framer-motion"
import router from 'next/router';
import { useDataContext } from '@/contexts/WorkContext';
const MotionLink = motion(Link)
export default function Logo() {
  const { dataContext, setDataContextData } = useDataContext();
  return (
    <div className='grid-cols-5 center items-center justify-center mt-2 gap-4 group text-center grid'>
      <div className='h-full'>
      </div>
      <div className='h-full '>
        <SpanModify key={1} translation='130%' text='UI/UX' />
      </div>
      <MotionLink href="/" className='w-16 h-16 bg-dark text-light flex items-center justify-center rounded-full text-2xl font-bold group cursor-pointer'
        onClick={() => { setDataContextData('') }}
        animate={{
          backgroundColor: ["#121212", "rgba(131,58,180,1)", "rgba(253,29,29,1)", "rgba(252,176,69,1)", "rgba(131,58,180,1)", "#121212"],
          transition: { duration: 20, repeat: Infinity },

        }}
      >SM</MotionLink>
      <div className='h-full'>
        <SpanModify key={2} text='Front' />
      </div>
      <div className='h-full'>
        <SpanModify key={3} text='Backend' />
      </div>
    </div>
  )
}

function SpanModify({ translation, text }: { translation?: string, text?: string }) {
  const { dataContext, setDataContextData } = useDataContext();

  return (
    <Link href={'/'} className={`
      opacity-0 group-hover:opacity-100 
      group-hover:animate-fade-down
      duration-200
      transition-all
      pointer-events-none group-hover:pointer-events-auto
      absolute 
      translate-y-10
      group-hover:h-14
      group-hover:translate-y-0
      flex items-center
      cursor-pointer
      hover:text-gray-300
      `}
      onClick={() => {
        setDataContextData(text || '')
      }}
    >
      {text}
    </Link>
  )
}
