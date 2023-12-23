import AnimatedText from '@/components/AnimatedText';
import Layout from '@/components/Layout';
import Head from 'next/head';

import Image from 'next/image'
import aboutpicturelight from '@p/aboutpicturelight.jpg'
import aboutpicture from '@p/aboutpicture.jpg'
import aboutpicturehover from '@p/aboutpicturehover.jpg'

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ImageTry from '@/components/ImageTry';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { IntersectionOptions, useInView } from 'react-intersection-observer';
import router from 'next/router';

const AnimatedNumbers = ({ value }: any) => {
  const ref = useRef(null)

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref as IntersectionOptions)

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue])

  if (typeof window !== 'undefined') {
    useLayoutEffect(() => {
      router?.query?.nome !== 'about' ? router.push('/') : ''
    }, [router?.query])
  }
  useEffect(() => {
    springValue.on("change", (latest) => {
      // console.log(latest)
    });
  }, [springValue, value])
  return (
    <span ref={ref}>
      {value}
    </span>
  )
}

const text = {
  pt: {
    main: 'A paixão alimenta o propósito!',
    biography: 'Biografia',
    about: `
    Meu nome é Sthiven Raphael Melo Correia e hoje sou estagiário na empresa NTT DATA, tive um longo caminho para chegar até onde estou e fiz muitas curvas. Iniciei estudando licenciatura plena em física na UFRRJ, participei de iniciação científica em energia e matéria escura no Observatório Nacional e hoje em dia ajudo a melhorar a qualidade de vida de outros trabalhadores através do código
    Tenho foco em backend, mas não consigo focar nele sem entender os entornos, então também tenho bastante experiência em front e quebro uns galhos na parte de design. No momento tenho estudado a parte de devops.
    Sou uma pessoa simples e geralmente bem alegre, meu foco na carreira é ser o melhor que eu posso ser e ajudar o máximo de pessoas que eu puder.
    `,
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

  return (
    <div className='h-fit'>
      <Head>
        <title>NerdStarCode | About Page</title>
        <meta name='description' content='sobre minha trajetória no desnvolvimento'></meta>
      </Head>
      <main className='flex w-full flex-col items-center justify-center'>
        <Layout classname='pt-16'>
          <AnimatedText text={text[language]?.main} className='md:mb-16' />
          <section className='grid grid-cols-3 w-full md:max-h-screen md:grid-cols-8 gap-16'>
            <article className='col-span-3 flex flex-col items-star justify-start '>
              <h2 className='mb-4 text-lg font-bold uppercase text-dark/75'>{text[language]?.biography}</h2>
              {
                text[language]?.about.split("\n").map((paragraph, index) => {
                  return <p key={`paragraph-${index}`} className='font-medium [&:not(:last-child)]:mb-4 text-justify' >
                    {paragraph}
                  </p>
                })
              }

            </article>
            <aside className='hidden md:block col-span-3 relative h-full rounded-2xl border-2 border-solid border-dark bg-light dark:dark:bg-zinc-900 p-8'>
              <ImageTry />
              <div className='absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-3xl bg-dark' />
            </aside>
            <div className='col-span-3 md:col-span-2 flex md:flex-col justify-between items-end'>
              <div className='flex flex-col items-end justify-center'>
                <span className='inline-block text-3xl sm:text-6xl md:text-7xl font-bold'>
                  <AnimatedNumbers value={50} />+
                </span>
                <h3 className='text-xs sm:text-xl font-medium capitalize text-dark/75 dark:text-zinc-400/75'>{text[language]?.repos}</h3>
              </div>
              <div className='flex flex-col items-end justify-center'>
                <span className='inline-block text-3xl sm:text-6xl md:text-7xl font-bold'>
                  30+
                </span>
                <h3 className='text-xs sm:text-xl font-medium capitalize text-dark/75 dark:text-zinc-400/75'>{text[language]?.curses}</h3>
              </div>
              <div className='flex flex-col items-end justify-center'>
                <span className='inline-block text-3xl sm:text-6xl md:text-7xl font-bold'>
                  1+
                </span>
                <h3 className='text-xs sm:text-xl font-medium capitalize text-dark/75 dark:text-zinc-400/75'>{text[language]?.yearExperience}</h3>
              </div>
            </div>
          </section>
        </Layout>

      </main>
    </div>
  )
}
