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
    <div className='mt-2 flex items-center justify-center gap-4 group'>
      {/* logo central */}
      <MotionLink
        href="/"
        className='relative w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold cursor-pointer
        bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900
        shadow-[0_0_25px_rgba(88,230,217,0.35)]
        border border-white/10
        group-hover:shadow-[0_0_40px_rgba(88,230,217,0.6)]
        transition-transform duration-300 group-hover:scale-105'
        onClick={() => { setDataContextData('') }}
        animate={{
          backgroundColor: ["#121212", "rgba(131,58,180,1)", "rgba(253,29,29,1)", "rgba(252,176,69,1)", "rgba(131,58,180,1)", "#121212"],
          transition: { duration: 20, repeat: Infinity },
        }}
      >
        SM
      </MotionLink>

      {/* abas à direita, uma abaixo da outra */}
      <div className='flex flex-col items-start gap-2'>
        <SpanModify key={1} text='UI/UX' />
        <SpanModify key={2} text='Front' />
        <SpanModify key={3} text='Backend' />
      </div>
    </div>
  )
}

function SpanModify({ translation, text }: { translation?: string, text?: string }) {
  const { dataContext, setDataContextData } = useDataContext();

  return (
    <Link
      href={'/'}
      className={`
        opacity-0 group-hover:opacity-100
        translate-y-1 group-hover:translate-y-0
        pointer-events-none group-hover:pointer-events-auto
        px-3 py-1 md:px-4 md:py-1.5
        rounded-full
        text-[0.7rem] md:text-xs font-medium
        bg-black/70 text-gray-100
        border border-white/10
        backdrop-blur-md
        flex items-center justify-center
        cursor-pointer
        hover:bg-white/10 hover:text-gray-100
        transition-all duration-300
      `}
      onClick={() => {
        setDataContextData(text || '')
      }}
    >
      {text}
    </Link>
  )
}
