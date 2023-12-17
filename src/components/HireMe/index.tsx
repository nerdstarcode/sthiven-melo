import Link from 'next/link';
import { CircularText } from '../Icons';

export default function HireMe() {
  return (
    <article className='fixed left-4 bottom-4 flex items-center justify-center overflow-hidden'>
     <div className='w-48 h-auto flex items-center justify-center relative'>
      <CircularText className='fill-dark animate-spin-slow' />
      <Link href='mailto:sthivendevelop@gmail.com' className='flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark text-light dark:text-dark shadow-md border border-solid border-dark dark:bg-zinc-800 w-20 h-20 rounded-full font-semibold hover:bg-light dark:hover:bg-black hover:text-dark '>Contact</Link>
     </div>
    </article>
  )
}
