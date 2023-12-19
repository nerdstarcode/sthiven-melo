'use client';

import Image from "next/image";
import notFound from '@/../public/404.svg'
export default function NotFound() {
  return (
    <span className="min-h-full flex w-full items-center justify-center flex-col">
      <Image priority src={notFound} alt='NerdStarCode' className='h-full rounded-2xl object-center bg-center object-cover' />
      <h2 className="flex flex-col text-center cursor-alias select-none group">
        <div className="text-7xl text-purple-600 animate-jump-in animate-delay-300 animate-once"><div className="animate-wiggle animate-infinite" >404</div></div>
        <div className="
        text-purple-800 group-hover:text-purple-500
        animate-jump-in animate-delay-700 animate-once animate-ease-in 
        group-hover:drop-shadow-2xl glowing
        ">NOT FOUND</div>
      </h2>
    </span>
  );
}