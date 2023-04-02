import Link from 'next/link';
import React from 'react';
import Logo from '../Logo';
import { useRouter, NextRouter } from 'next/router';
import { DribbbleIcon, GithubIcon, LinkedInIcon, PinterestIcon, TwitterIcon } from '../Icons';
import {motion} from 'framer-motion'
export interface CustomLinkProps {
  href: string;
  classname?: string;
  target?: '_blank' | '_self';
  router?: NextRouter | undefined;
  children?: React.ReactNode;
}
const CustomLink = ({ href, classname = '', target, router, children }: CustomLinkProps) => {
  return (
    <Link href={href} className={`${classname} relative group`} target={target}>
      {children}
      <span className={`h-[1px] inline-block bg-dark absolute left-0 bottom-0.5 group-hover:w-full transition-[width] ease duration-300
      ${router?.asPath === href ? 'w-full': 'w-0'}
      `}>&nbsp;</span>
    </Link>
  )
}

export default function NavBar() {
  const router = useRouter()
  return (
    <header className='w-full px-32 py-8 font-medium flex items-center justify-between'>
      <nav className='flex gap-4'>
        <CustomLink href='/' children='Home' router={router}/>
        <CustomLink href='/about' children='About' router={router}/>
        <CustomLink href='/projects' children='Projects' router={router}/>
        <CustomLink href='/articles' children='Articles' router={router}/>
      </nav>
      <nav className='flex items-center justify-center flex-wrap gap-4 '>
        <motion.a href='/' children={<TwitterIcon/>} target='_blank' whileHover={{y:-2}} className='w-6' whileTap={{scale:0.9}}/>
        <motion.a href='/' children={<DribbbleIcon/>} target='_blank' whileHover={{y:-2}} className='w-6' whileTap={{scale:0.9}}/>
        <motion.a href='/' children={<GithubIcon/>} target='_blank' whileHover={{y:-2}} className='w-6' whileTap={{scale:0.9}}/>
        <motion.a href='/' children={<LinkedInIcon/>} target='_blank' whileHover={{y:-2}} className='w-6' whileTap={{scale:0.9}}/>
        <motion.a href='/' children={<PinterestIcon/>} target='_blank' whileHover={{y:-2}} className='w-6' whileTap={{scale:0.9}}/>
      </nav>
      <div className='absolute left-1/2 top-2 -translate-x-1/2'>
        <Logo />
      </div>
    </header>
  )
}
