'use client'
import Layout from '@/components/Layout'
import Head from 'next/head'
import Image from 'next/image'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Recipe } from '@/components/GlowingRecipe'
import { GlowingCube } from '@/components/GlowingCube'


export default function Home() {
  const [language, setLanguage] = useState<'pt' | 'es' | 'en'>('pt');
  const [work, setWork] = useState<string | null>()
  return (
    <>
      <main className='flex justify-center items-center text-dark dark:text-zinc-400 w-full min-h-screen'>
        <Layout classname='pt-0 flex flex-col gap-32 max-w-7xl'>
          <SectionComponents
          key="cubo-content"
            id='recipe_component'
          >
            <AsideComponent
              title='Cube 3D Rotation'
              description='Componente criado com ThreeJS'
              className='group-hover:text-blue-500'
            />
            <ThreeScene/>
          </SectionComponents>
          <SectionComponents
            id='glowing_cube'

          >
            <GlowingCube />
            <AsideComponent
              title='Glowing Cube component'
              description='Componente criado com Tailwind CSS'
              className='group-hover:text-fuchsia-500'
            />
          </SectionComponents>
        </Layout>

      </main>
    </>
  )

}

function SectionComponents({ id, children }: any) {
  return (
    <section id={id} className='group flex w-full justify-between items-center'>
      {children}
    </section>
  )
}
import { twMerge } from 'tailwind-merge'
import ThreeScene from '@/components/ThreeJS/ThreeScene'
function AsideComponent({ title, description, className }: any) {
  return (
    <aside>
      <h3 className={
        twMerge(`
            text-xl
            lg:text-3xl
            font-bold
            opacity-60
            transition-all
            duration-700
            group-hover:opacity-100
          `,
          className
        )
      }>{title}</h3>
      <p>
        {description}
      </p>
    </aside>
  )
}