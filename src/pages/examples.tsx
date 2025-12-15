'use client'
import Layout from '@/components/Layout'
import Head from 'next/head'
import Image from 'next/image'

import { useEffect } from 'react'
import Link from 'next/link'
import { Recipe } from '@/components/GlowingRecipe'
import { GlowingCube } from '@/components/GlowingCube'
import { useLanguageContext } from '@/contexts/LanguageContext'

const examplesText = {
  pt: {
    cubeTitle: 'Cube 3D Rotation',
    cubeDescription: 'Componente criado com ThreeJS',
    glowingTitle: 'Glowing Cube component',
    glowingDescription: 'Componente criado com Tailwind CSS',
  },
  en: {
    cubeTitle: 'Cube 3D Rotation',
    cubeDescription: 'Component built with ThreeJS',
    glowingTitle: 'Glowing Cube component',
    glowingDescription: 'Component built with Tailwind CSS',
  },
  es: {
    cubeTitle: 'Rotación de Cubo 3D',
    cubeDescription: 'Componente creado con ThreeJS',
    glowingTitle: 'Componente Cubo Brillante',
    glowingDescription: 'Componente creado con Tailwind CSS',
  },
}

export default function ExamplesPage() {
  const { language } = useLanguageContext()

  return (
    <>
      <main className='flex justify-center items-center text-dark dark:text-zinc-400 w-full min-h-screen'>
        <Layout classname='pt-0 flex flex-col gap-32 max-w-7xl'>
          <SectionComponents
            key="cubo-content"
            id='recipe_component'
          >
            <AsideComponent
              title={examplesText[language].cubeTitle}
              description={examplesText[language].cubeDescription}
              className='group-hover:text-blue-500'
            />
            <ThreeScene />
          </SectionComponents>
          <SectionComponents
            id='glowing_cube'
          >
            <GlowingCube />
            <AsideComponent
              title={examplesText[language].glowingTitle}
              description={examplesText[language].glowingDescription}
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