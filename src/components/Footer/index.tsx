import Link from 'next/link';
import Layout from '../Layout';

export default function Footer() {
  return (
    <footer className='w-ful border-t-2 border-solid border-dark font-medium text-lg'>
      <Layout classname='py-8 flex items-center justify-between bg-amber-50'>
        <span>{new Date().getFullYear()}&copy; All Rights Reserved. A</span>
        <div className='flex items-center'>
          Build With <span className='text-primary text-2xl px-1'>&#9825;</span> by&nbsp;<Link href='/' className='underline underline-offset-2'>NerdStarCode</Link>
        </div>
        <Link href='/' target='_blank'>Say Hello!</Link>
      </Layout>
    </footer>
  )
}
