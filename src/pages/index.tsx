'use client'
import Layout from '@/components/Layout'
import Head from 'next/head'
import Image from 'next/image'

import AnimatedText from '@/components/AnimatedText'

import profilePic from '@p/developer-pic-1.png'
import { motion } from 'framer-motion'

import frontend from '@p/frontend.svg'
import backend from '@p/backend.svg'
import design from '@p/design.svg'

// degisn experience
import figma from '@p/figma.svg'
import photoshop from '@p/photoshop.png'
import illustrator from '@p/illustrator.png'
import autodesk from '@p/autodesk.png'
import aftereffect from '@p/aftereffect.png'

// front experience
import react from '@p/front/react.png'
import vue from '@p/front/vue.png'
import angular from '@p/front/angular.png'
import sass from '@p/front/sass.png'
import storybook from '@p/front/storybook.png'
import zod from '@p/front/zod.png'

// back experience
import azure from '@p/back/azure.png'
import nest from '@p/back/nest.svg'
import postgreesql from '@p/back/postgreesql.png'
import postman from '@p/back/postman.svg'
import prisma from '@p/back/prisma.png'
import typescript from '@p/back/typescript.png'
import puppeteer from '@p/back/puppeteer.png'
import python from '@p/back/python.png'
import typeorm from '@p/back/typeorm.png'


const MotionImage = motion(Image)
const quote = {
  initial: {
    opacity: 0,
    x: -50
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.08,
    }
  }
}

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LinkArrow } from '@/components/Icons'
import HireMe from '@/components/HireMe'
import { useDataContext } from '@/contexts/WorkContext'
const text = {
  pt: {
    title: 'Transformando ideias em realidade com código e design.',
    describe: 'Como desenvolvedor full-stack iniciante, dedico-me a transformar ideias em projetos web bem organizados.\nNavegue pelos meus projetos e artigos mais recentes, mostrando minha experiência em React.js e desenvolvimento web.'
  },
  en: {
    title: 'Turning Vision Into Reality With Code And Design.',
    describe: "As a beginner full-stack developer, I'm dedicated to turning ideas into well-organized web projects. \nBrowse my latest projects and articles, showcasing my expertise in React.js and web development."
  },
  es: {
    title: 'Convirtiendo la visión en realidad con código y diseño.',
    describe: 'Como desarrollador full-stack principiante, me dedico a convertir ideas en proyectos web bien organizados.\nExplore mis últimos proyectos y artículos, mostrando mi experiencia en React.js y desarrollo web.'
  },
}

export default function Home() {
  const [language, setLanguage] = useState<'pt' | 'es' | 'en'>('pt');
  const [work, setWork] = useState<string | null>()
  const { dataContext, setDataContextData } = useDataContext();

  useEffect(() => {
    if (window) {
      setWork(dataContext.Work)
    }
  }, [dataContext.Work])

  switch (true) {
    case (work === 'UI/UX'): {
      return (
        <span key="design" className="min-h-screen flex w-full items-center justify-center flex-col relative">
          <div className='animate-slide-left absolute'>
            <div className='hidden md:block animate-jump-in animate-ease-in'>
              <Image className='animate-wiggle animate-infinite' alt='irineu' src={design} priority />
            </div>
          </div>
          <aside className='md:pl-[40vw] gap-8 p-12 animate-fade-right animate-delay-1000 flex flex-col h-full min-h-[50vh] justify-between items-center w-full'>
            <h3 className='text-4xl'>
              Experience
            </h3>
            <div className='animate-delay-1000 animate-jump-in grid grid-cols-1 md:grid-cols-3 gap-12 place-items-center'>
              <div className='flex w-full items-center gap-4'>
                <Image className='rounded-full w-20' alt='irineu' src={figma} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    1+ year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: medium
                  </h6>
                </div>
              </div>

              <div className='flex w-full items-center gap-2'>
                <Image className='rounded-full w-20' alt='irineu' src={photoshop} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    2+ year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: small
                  </h6>
                </div>
              </div>
              <div className='flex w-full items-center gap-2'>
                <Image className='rounded-full w-20' alt='irineu' src={illustrator} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    2+ year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: medium
                  </h6>
                </div>
              </div>

              <div className='flex w-full items-center gap-2'>
                <Image className='rounded-full w-20' alt='irineu' src={autodesk} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    2+ year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: small
                  </h6>
                </div>
              </div>
              <div className='flex w-full items-center gap-2'>
                <Image className='rounded-full w-20' alt='irineu' src={aftereffect} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    1+ year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: small
                  </h6>
                </div>
              </div>
            </div>

          </aside>
        </span>
      )
    }
    case (work === 'Front'): {
      return (
        <span key="front" className="min-h-screen flex w-full items-center justify-center">
          <div className='animate-slide-right absolute'>
            <div className='hidden md:block animate-jump-in animate-ease-in'>
              <Image alt='irineu' src={frontend} priority />
            </div>
          </div>
          <aside className='md:pr-[40vw] p-12 animate-fade-right animate-delay-1000 flex flex-col h-full min-h-[50vh] justify-between items-center w-full gap-8'>
            <h3 className='text-4xl'>
              Experience
            </h3>
            <div className='animate-delay-1000 animate-jump-in grid grid-cols-1 md:grid-cols-3 gap-12 place-items-center'>
              <div className='flex w-full items-center gap-4'>
                <Image className='w-20' alt='irineu' src={react} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    1+ year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: high
                  </h6>
                </div>
              </div>

              <div className='flex w-full items-center gap-2'>
                <Image className='w-20' alt='irineu' src={vue} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    1- year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: small
                  </h6>
                </div>
              </div>
              <div className='flex w-full items-center gap-2'>
                <Image className='w-20' alt='irineu' src={angular} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    1- year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: small
                  </h6>
                </div>
              </div>

              <div className='flex w-full items-center gap-2'>
                <Image className='w-20' alt='irineu' src={sass} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    1+ year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: high
                  </h6>
                </div>
              </div>
              <div className='flex w-full items-center gap-2'>
                <Image className='w-20' alt='irineu' src={storybook} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    1+ year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: high
                  </h6>
                </div>
              </div>
              <div className='flex w-full items-center gap-2'>
                <Image className='w-20' alt='irineu' src={zod} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    1- year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: high
                  </h6>
                </div>
              </div>
            </div>

          </aside>
        </span>
      )
    }
    case (work === 'Backend'): {
      return (
        <section className="min-h-screen grid md:grid-cols-3 items-center justify-center flex-col place-items-center text-center">
          <article className='grid grid-cols-1 gap-4 animate-fade-up animate-delay-500'>
            <header>
              <h2 className='text-4xl'>Stack</h2>
            </header>
            <section id='stack-images' className='grid grid-cols-3 sm:grid-cols-5 gap-4 place-items-center'>
              <Image className='w-20' alt='irineu' src={azure} />
              <Image className='w-20' alt='irineu' src={nest} />
              <Image className='w-20' alt='irineu' src={postgreesql} />
              <Image className='w-20' alt='irineu' src={postman} />
              <Image className='w-20' alt='irineu' src={prisma} />
              <Image className='w-20' alt='irineu' src={typescript} />
              <Image className='w-20' alt='irineu' src={puppeteer} />
              <Image className='w-20' alt='irineu' src={python} />
              <Image className='w-20' alt='irineu' src={typeorm} />
              <p className='col-span-3 sm:col-span-1'>And more...</p>
            </section>
          </article>
          <article className='animate-fade'>
            <Image alt='irineu' src={backend} priority />
          </article>
          <article>
            <header>
              <h2 className='text-4xl'>Projects</h2>
            </header>
          </article>
        </section>
      )
    }
    default:
      return (
        <>
          <Head>
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <link rel='icon' href='/favicon.ico' />
            <title>Nerd Star Code</title>
            <meta name='description' content='Generated by create next app' />
          </Head>
          <main className='flex items-center text-zinc-400 w-full min-h-screen'>
            <Layout classname='pt-0'>
              <div className='grid grid-cols-2 items-center justify-between w-full place-items-center'>
                <aside className='md:row-span-2'>
                  <MotionImage variants={quote} initial='initial' animate='animate' priority src={profilePic} alt='CodeBucks' className='w-full h-auto' />
                </aside>
                {/* <article id='article-about' className='w-1/2 flex flex-col items-center self-center'> */}
                <header className='flex'>
                  <AnimatedText Tag='h1' text={text[language]?.title} className='md:!text-6xl sm:!text-2xl text-lg text-left' />
                </header>
                <main className='col-span-2 md:col-span-1'>
                  <p className='my-4 text-basefont-medium text-justify'>
                    {text[language]?.describe}
                  </p>
                </main>
                <footer className='col-span-2 md:col-span-1 flex items-center self-start mt-2 gap-10'>
                  <Link href='/Sthiven_CV.pdf' target={'_blank'} className='flex items-center bg-dark text-light p-2.5 px-6 rounded-lg text-lg font-semibold hover:bg-light hover:text-black border border-solid border-transparent hover:border-dark'>Resume <LinkArrow className='w-6 ml-1' /></Link>
                  <Link href='mailto:sthivendevelop@gmail.com' className='text-lg font-medium capitalize text-light underline' >Contact</Link>
                </footer>
                {/* </article> */}
              </div>
            </Layout>

          </main>
        </>
      )
  }


}
