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
import { useLanguageContext } from '@/contexts/LanguageContext'

const uiText = {
  pt: {
    experience: 'Experiência',
    stack: 'Stack',
    projects: 'Projetos',
    andMore: 'E mais...',
    contact: 'Contato',
    resume: 'Currículo',
  },
  en: {
    experience: 'Experience',
    stack: 'Stack',
    projects: 'Projects',
    andMore: 'And more...',
    contact: 'Contact',
    resume: 'Resume',
  },
  es: {
    experience: 'Experiencia',
    stack: 'Stack',
    projects: 'Proyectos',
    andMore: 'Y más...',
    contact: 'Contacto',
    resume: 'Currículum',
  },
}
const text = {
  pt: {
    title: 'Transformando ideias em realidade com código e design.',
    describe:
      'Desenvolvedor full-stack com 3 anos de experiência no mercado, atuando em frontend e backend, bancos relacionais e não relacionais, além de cloud (Azure e AWS).\nNavegue pelos meus projetos e artigos mais recentes, que unem código, arquitetura e design para criar experiências web bem organizadas.'
  },
  en: {
    title: 'Turning Vision Into Reality With Code And Design.',
    describe:
      "I'm a full-stack developer with 3 years of professional experience, working across frontend, backend, relational and non-relational databases, and cloud (Azure & AWS).\nBrowse my latest projects and articles, where I combine code, architecture and design to build well-structured web experiences."
  },
  es: {
    title: 'Convirtiendo la visión en realidad con código y diseño.',
    describe:
      'Desarrollador full-stack con 3 años de experiencia en el mercado, trabajando tanto en frontend como en backend, con bases de datos relacionales y no relacionales y cloud (Azure y AWS).\nExplore mis últimos proyectos y artículos, donde uno código, arquitectura y diseño para crear experiencias web bien organizadas.'
  },
}

export default function Home() {
  const [work, setWork] = useState<string | null>()
  const { dataContext, setDataContextData } = useDataContext();
  const { language } = useLanguageContext();

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
              {uiText[language].experience}
            </h3>
            <div className='animate-delay-1000 animate-jump-in grid grid-cols-1 md:grid-cols-3 gap-12 place-items-center'>
              <div className='flex w-full items-center gap-4'>
                <Image className='rounded-full w-20' alt='irineu' src={figma} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    3+ year
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
                    3+ year
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
              {uiText[language].experience}
            </h3>
            <div className='animate-delay-1000 animate-jump-in grid grid-cols-1 md:grid-cols-3 gap-12 place-items-center'>
              <div className='flex w-full items-center gap-4'>
                <Image className='w-20' alt='irineu' src={react} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    3+ year
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
                    2+ year
                  </h4>
                  <h6 className='text-xs'>
                    Expertise: high
                  </h6>
                </div>
              </div>

              <div className='flex w-full items-center gap-2'>
                <Image className='w-20' alt='irineu' src={sass} priority />
                <div className='flex flex-col gap-2'>
                  <h4 className='text-2xl'>
                    3+ year
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
                    3+ year
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
                    3+ year
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
              <h2 className='text-4xl'>{uiText[language].stack}</h2>
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
              <p className='col-span-3 sm:col-span-1'>{uiText[language].andMore}</p>
            </section>
          </article>
          <article className='animate-fade'>
            <Image alt='irineu' src={backend} priority />
          </article>
          <article>
            <header>
              <h2 className='text-4xl'>{uiText[language].projects}</h2>
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
            <Layout classname='pt-4 md:pt-0'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-between w-full place-items-center'>
                <aside className='order-1 lg:order-none flex justify-center w-full'>
                  <MotionImage
                    variants={quote}
                    initial='initial'
                    animate='animate'
                    whileHover={{ scale: 1.03, rotate: -1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                    priority
                    src={profilePic}
                    alt='CodeBucks'
                    className='w-2/3 max-w-xs md:max-w-md lg:max-w-full h-auto rounded-3xl shadow-[0_0_40px_rgba(88,230,217,0.35)]'
                  />
                </aside>
                {/* <article id='article-about' className='w-1/2 flex flex-col items-center self-center'> */}
                <section className='flex flex-col gap-6 w-full max-w-2xl'>
                  <header className='flex'>
                    <AnimatedText
                      Tag='h1'
                      text={text[language]?.title}
                      className='!text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl text-left'
                    />
                  </header>
                  <main>
                    <p className='my-4 text-base md:text-lg font-medium text-justify leading-relaxed'>
                      {text[language]?.describe}
                    </p>
                  </main>
                  <footer className='flex flex-wrap items-center gap-4 sm:gap-6 mt-2'>
                    <Link
                      href='/Sthiven_CV.pdf'
                      target={'_blank'}
                      className='flex items-center bg-dark text-light px-6 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-light hover:text-black border border-solid border-transparent hover:border-dark transition-all duration-200'
                    >
                      {uiText[language].resume}
                      <LinkArrow className='w-5 sm:w-6 ml-2' />
                    </Link>
                    <Link
                      href='mailto:sthivendevelop@gmail.com'
                      className='text-base sm:text-lg font-medium capitalize text-light underline underline-offset-4 hover:text-primary transition-colors'
                    >
                      {uiText[language].contact}
                    </Link>
                  </footer>
                </section>
                {/* </article> */}
              </div>
            </Layout>
          </main>
        </>
      )
  }


}
