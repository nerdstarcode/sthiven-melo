import AnimatedText from '@/components/AnimatedText';
import Layout from '@/components/Layout';
import Head from 'next/head';

import Image from 'next/image'
import aboutpicturelight from '@p/aboutpicturelight.jpg'
import aboutpicture from '@p/aboutpicture.jpg'
import aboutpicturehover from '@p/aboutpicturehover.jpg'

import { useEffect, useRef, useState } from 'react';
import ImageTry from '@/components/ImageTry';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { IntersectionOptions, useInView } from 'react-intersection-observer';
import router from 'next/router';

const AnimatedNumbers = ({ value }: any) => {
  const ref = useRef(null)

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref as IntersectionOptions)

  useEffect(()=>{
    if(isInView){
      motionValue.set(value);
    }
  }, [isInView, value, motionValue])

  useEffect(()=>{
    springValue.on("change", (latest)=>{
      // console.log(latest)
    });
  }, [springValue, value])

  return (
    <span ref={ref}>
    </span>
  )
}

const text = {
  pt: {
    main: 'A paixão alimenta o propósito!',
    biography: 'Biografia',
    about: "Hi, I'm CodeBucks, a web developer and UI/UX designer with a passion for creating beautiful, functional, and user-centered digital experiences. With 4 years of experience in the field. I am always looking for new and innovative ways to bring my clients' visions to life.\nI believe that design is about more than just making things look pretty – it's about solving problems and creating intuitive, enjoyable experiences for users. \n Whether I'm working on a website, mobile app, or other digital product, I bring my commitment to design excellence and user-centered thinking to every project I work on. I look forward to the opportunity to bring my skills and passion to your next project.",
    repos: 'Repositórios',
    curses: 'Cursos completos',
    yearExperience: 'Anos de experiência'
  },
  en: {
    main: 'Passion Fuels Purpose! ',
    biography: 'Biography',
    about: "Hi, I'm CodeBucks, a web developer and UI/UX designer with a passion for creating beautiful, functional, and user-centered digital experiences. With 4 years of experience in the field. I am always looking for new and innovative ways to bring my clients' visions to life.\nI believe that design is about more than just making things look pretty – it's about solving problems and creating intuitive, enjoyable experiences for users. \nWhether I'm working on a website, mobile app, or other digital product, I bring my commitment to design excellence and user-centered thinking to every project I work on. I look forward to the opportunity to bring my skills and passion to your next project.",
    repos: 'Repositories',
    curses: 'Complete courses',
    yearExperience: 'Year of experience'
  },
  es: {
    main: '¡La pasión alimenta el propósito!',
    biography: 'Biografía',
    about: "Hi, I'm CodeBucks, a web developer and UI/UX designer with a passion for creating beautiful, functional, and user-centered digital experiences. With 4 years of experience in the field. I am always looking for new and innovative ways to bring my clients' visions to life.\nI believe that design is about more than just making things look pretty – it's about solving problems and creating intuitive, enjoyable experiences for users. \nWhether I'm working on a website, mobile app, or other digital product, I bring my commitment to design excellence and user-centered thinking to every project I work on. I look forward to the opportunity to bring my skills and passion to your next project.",
    repos: 'Repositorios',
    curses: 'Cursos completos',
    yearExperience: 'Años de experiencia'
  }
}

export default function About() {
  const [language, setLanguage] = useState<'pt' | 'es' | 'en'>('pt');
  const [image, setImage] = useState(aboutpicture)
  useEffect(()=>{
    const paginaAnterior = router.query.nome
    console.log(paginaAnterior)
  })
  return (
    <>
      <Head>
        <title>NerdStarCode | About Page</title>
        <meta name='description' content='sobre minha trajetória no desnvolvimento'></meta>
      </Head>
      <main className='flex w-full flex-col items-center justify-center'>
        <Layout classname='pt-16'>
          <AnimatedText text={text[language]?.main} className='mb-16' />
          <section className='grid w-full max-h-screen grid-cols-8 gap-16'>
            <article className='col-span-3 flex flex-col items-star justify-start '>
              <h2 className='mb-4 text-lg font-bold uppercase text-dark/75'>{text[language]?.biography}</h2>
              {
                text[language]?.about.split("\n").map((paragraph, index) => {
                  return <p key={`paragraph-${index}`} className='font-medium [&:not(:last-child)]:mb-4' >
                    {paragraph}
                  </p>
                })
              }

            </article>
            <aside className='col-span-3 relative h-full rounded-2xl border-2 border-solid border-dark bg-light p-8'>
              <ImageTry />
              <div className='absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-3xl bg-dark' />
            </aside>
            <div className='col-span-2 flex flex-col justify-between items-end'>
              <div className='flex flex-col items-end justify-center'>
                <span className='inline-block text-7xl font-bold'>
                  <AnimatedNumbers value={50}/>+
                </span>
                <h3 className='text-xl font-medium capitalize text-dark/75'>{text[language]?.repos}</h3>
              </div>
              <div className='flex flex-col items-end justify-center'>
                <span className='inline-block text-7xl font-bold'>
                  30+
                </span>
                <h3 className='text-xl font-medium capitalize text-dark/75'>{text[language]?.curses}</h3>
              </div>
              <div className='flex flex-col items-end justify-center'>
                <span className='inline-block text-7xl font-bold'>
                  1+
                </span>
                <h3 className='text-xl font-medium capitalize text-dark/75'>{text[language]?.yearExperience}</h3>
              </div>
            </div>
          </section>
        </Layout>
      </main>
    </>
  )
}
