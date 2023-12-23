import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import Logo from '../Logo';
import { useRouter, NextRouter } from 'next/router';
import { DribbbleIcon, GithubIcon, LinkedInIcon, PinterestIcon } from '../Icons';
import { motion } from 'framer-motion'
export interface CustomLinkProps {
  href: {
    pathname: string
    query?: { [key: string]: any }
    state?: { [key: string]: any }
  } | any
  classname?: string;
  target?: '_blank' | '_self';
  router?: NextRouter | undefined;
  children?: React.ReactNode;
  as?: string;
}
const CustomLink = ({ href, as, classname = '', target, router, children }: CustomLinkProps) => {
  return (
    <Link href={href} as={as} className={`${classname} relative group dark:text-zinc-400`} target={target}  >
      {children}
      <span className={`h-[1px] inline-block bg-dark dark:bg-yellow-400 absolute left-0 bottom-0.5 group-hover:w-full transition-[width] ease duration-300
      ${router?.pathname === href.pathname || router?.pathname === href ? 'w-full' : 'w-0'}
      `}>&nbsp;</span>
    </Link>
  )
}
import instagram from '@p/insta.svg'

export default function NavBar() {
  const router = useRouter()
  return (
    <header className='w-full px-8 md:px-32 py-8 font-medium flex items-center justify-between'>
      <nav className='flex gap-4'>
        <CustomLink href={{ pathname: '/', query: { nome: 'Home', object: '', como: '', valor: '' } }} as="/" children='Home' router={router} />
        <CustomLink href={{ pathname: '/about', query: { nome: 'about' } }} as="/about" children='About' router={router} />
        <CustomLink href='/projects' children='Projects' router={router} />
        {/* <CustomLink href='/articles' children='Articles' router={router} /> */}
      </nav>
      <nav className='flex items-center justify-center flex-wrap gap-4 '>
        <motion.a href='https://www.instagram.com/nerd_star_code/' children={<Image src={instagram} alt='insta'/>} target='_blank' whileHover={{ y: -2 }} className='w-6' whileTap={{ scale: 0.9 }} />
        {/* <motion.a href='/' children={<DribbbleIcon />} target='_blank' whileHover={{ y: -2 }} className='w-6' whileTap={{ scale: 0.9 }} /> */}
        <motion.a href='https://github.com/nerdstarcode' children={<GithubIcon />} target='_blank' whileHover={{ y: -2 }} className='w-6' whileTap={{ scale: 0.9 }} />
        <motion.a href='https://www.linkedin.com/in/sthiven-melo-a67a1722b/' children={<LinkedInIcon />} target='_blank' whileHover={{ y: -2 }} className='w-6' whileTap={{ scale: 0.9 }} />
        {/* <motion.a href='/' children={<PinterestIcon />} target='_blank' whileHover={{ y: -2 }} className='w-6' whileTap={{ scale: 0.9 }} /> */}
      </nav>
      <div className='hidden md:block absolute left-1/2 top-2 -translate-x-1/2'>
        <Logo />
      </div>
    </header>
  )
}
