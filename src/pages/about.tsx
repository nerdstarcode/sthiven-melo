import AnimatedText from '@/components/AnimatedText';
import Layout from '@/components/Layout';
import Head from 'next/head';
import nttDataImage from '@p/backend.svg'
import volunteer from '@p/experience/Volunteering-bro.svg'
import develop from '@p/experience/developer-activity-animate.svg'
import freela from '@p/experience/freelancer-animate.svg'
import aboutpicture from '@p/aboutpicture.jpg'

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ImageTry from '@/components/ImageTry';
import { useMotionValue, useSpring } from 'framer-motion';
import { IntersectionOptions, useInView } from 'react-intersection-observer';
import router from 'next/router';
import Skills from '@/components/Skills';
import Details from '@/components/Details';

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
      // router?.query?.nome !== 'about' ? router.push('/') : ''
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
        <Layout classname='pt-16 gap-16'>
          <AnimatedText text={text[language]?.main} />
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
            <aside className='hidden md:block col-span-3 relative h-full rounded-2xl border-2 border-solid border-dark bg-zinc-900 p-8'>
              <ImageTry />
              <div className='absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-3xl bg-dark' />
            </aside>
            <div className='col-span-3 grid grid-cols-2 gap-8 place-items-center md:col-span-2 md:flex md:flex-col justify-between items-end'>
              <div className='flex flex-col items-end justify-center'>
                <span className='inline-block text-6xl md:text-7xl font-bold'>
                  <AnimatedNumbers value={50} />+
                </span>
                <h3 className='text-xl font-medium capitalize text-zinc-400/75'>{text[language]?.repos}</h3>
              </div>
              <div className='flex flex-col items-end justify-center'>
                <span className='inline-block text-6xl md:text-7xl font-bold'>
                  30+
                </span>
                <h3 className='text-xl font-medium capitalize text-zinc-400/75'>{text[language]?.curses}</h3>
              </div>
              <div className='flex flex-col items-end justify-center'>
                <span className='inline-block text-6xl md:text-7xl font-bold'>
                  1+
                </span>
                <h3 className='text-sm font-medium capitalize text-zinc-400/75'>{text[language]?.yearExperience}</h3>
              </div>
            </div>
          </section>
          <SkiilsSection />
          <ExperienceSection />
        </Layout>

      </main>
    </div>
  )
}

function SkiilsSection() {
  return (
    <section id={'skills'}>
      <h2 className='font-bold text-8xl w-full text-center'>Skills</h2>
      <div className='w-full h-screen relative flex items-center justify-center rounded-full bg-circularDark'>
        <Skills text='Figma' x='0' y='-15vw' />
        <Skills text='React Native' x='25vw' y='5vw' />
        <Skills text='Kubernetes' x='30vw' y='-6vw' />
        <Skills text='RabbitMQ' x='-30vw' y='6vw' />
        <Skills text='Java' x='-25vw' y='-5vw' />
        <Skills text='Sql' x='-25vw' y='15vw' />
        <Skills text='MongoDB' x='-30vw' y='-15vw' />

        <Skills text='Cisco' x='-15vw' y='-15vw' />
        <Skills text='Service Now' x='26vw' y='15vw' />
        <Skills text='Redis' x='-15vw' y='10vw' />
        <Skills text='Tailwind' x='12vw' y='-8vw' />
        <Skills text='Scss' x='-8vw' y='20vw' />
        <Skills text='Angular' x='15vw' y='-18vw' />
        <Skills text='Vue' x='15vw' y='18vw' />

        <Skills text='NestJS' x='0' y='0' />

        <Skills text='React' x='-10vw' y='-5vw' />
        <Skills text='Next' x='5vw' y='15vw' />
      </div>
    </section>
  )
}

function ExperienceSection() {
  return (
    <section className='flex flex-col gap-16'>
      <h2 className='font-bold text-4xl sm:text-8xl w-full text-center'>Experience</h2>
      <div className='w-full mx-auto relative'>
        <ul className='flex flex-col gap-4 w-full items-center justify-center'>
          <Details.Main classname='flex items-center gap-8'>
            <Details.AsideImage classname='opacity-70' src={nttDataImage} alt='ntt programmer' />
            <Details.Article classname='w-11/12'>
              <Details.Title
                classname='capitalize'
                companyLink='https://www.linkedin.com/company/ntt-data-inc/mycompany/'
                company='NTT DATA, Inc'
                position='Intern Software Engineer'
              />
              <Details.SpaceAndTime
                classname='capitalize opacity-75'
                address='Brasil'
                time='2022/11 - Atual'
              />
              <Details.Description
                classname='font-medium w-full'
                work='Diariamente trabalho como desenvolvedor fullstack criando aplicações internas ou para nossos clientes utilizando React ou Angular para frontend e Nestjs no backend, frequente contatocom arquitetura na Azure e kubernetes.'
              />
            </Details.Article>
          </Details.Main>


          <Details.Main classname='flex items-center gap-8'>
            <Details.Article classname='w-11/12'>
              <Details.Title
                classname='capitalize'
                companyLink='https://www.linkedin.com/company/faex-conseil-juridique/'
                company='Faex'
                position='Freelancer'
              />
              <Details.SpaceAndTime
                classname='capitalize opacity-75'
                address='Brasil'
                time='2024/01 - Atual'
              />
              <Details.Description
                classname='font-medium w-full'
                work={`
                  Desenvolvimento de integração do ORM Angedor com Whatsapp para agilizar os processos de novos clientes tal qual para melhorar o atendimento com antigos com fluxos personalizados para cada um.
                  Além de criação de bots para automatizar a captura de dados e melhorar a qualidade de vida dos trabalhadores.
                `}
              />
            </Details.Article>
            <Details.AsideImage classname='opacity-70' src={develop} alt='ntt programmer' />
          </Details.Main>

          <Details.Main classname='flex items-center gap-8'>
            <Details.AsideImage classname='opacity-70' src={freela} alt='ntt programmer' />
            <Details.Article classname='w-11/12'>
              <Details.Title
                classname='capitalize'
                companyLink='https://www.linkedin.com/company/modal---modalnetworks-servi-os-em-inform-tica/about/'
                company='Modalnetworks | ModalEduca'
                position='Software Engineer'
              />
              <Details.SpaceAndTime
                classname='capitalize opacity-75'
                address='Brasil'
                time='2022/09 - 2023/03'
              />
              <Details.Description
                classname='font-medium w-full'
                work={`
                  Trabalhos diários desenvolvendo RPAs com puppeteer e criação de interface utilizando de blockly para ajudar no ensino de programação para estudantes do fundamental.
                  Além de orientar um segundo estagiário a realizar os RPAs. Houveram também refatorações de códigos legado com php para a nova plataforma com React.
                `}
              />
            </Details.Article>
          </Details.Main>


          <Details.Main classname='flex items-center gap-8'>
            <Details.Article classname='w-11/12'>
              <Details.Title
                classname='capitalize'
                // companyLink='https://www.linkedin.com/company/ntt-data-inc/mycompany/'
                // company='NTT DATA, Inc'
                position='Voluntário'
              />
              <Details.SpaceAndTime
                classname='capitalize opacity-75'
                address='Brasil'
                time=''
              />
              <Details.Description
                classname='font-medium w-full'
                work={`
                  Participo de trabalhos voluntários para aprimorar minha experiência, já trabalhei para empresas de educação e para mini empresa da faculdade UFRRJ. Normalmente atuo em áreas que precisam de algum auxílio, sendo back, front ou até mesmo com design para criação de logos ou na parte de UI/UX
                `}
              />
            </Details.Article>
            <Details.AsideImage classname='opacity-70' src={volunteer} alt='ntt programmer' />
          </Details.Main>
        </ul>
      </div>
    </section>
  )
}