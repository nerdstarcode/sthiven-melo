import AnimatedText from '@/components/AnimatedText';
import Layout from '@/components/Layout';
import Head from 'next/head';
import nttDataImage from '@p/backend.svg'
import volunteer from '@p/experience/Volunteering-bro.svg'
import develop from '@p/experience/developer-activity-animate.svg'
import freela from '@p/experience/freelancer-animate.svg'
import aboutpicture from '@p/aboutpicture.jpg'

import { useEffect, useLayoutEffect, useRef } from 'react';
import ImageTry from '@/components/ImageTry';
import { useMotionValue, useSpring } from 'framer-motion';
import { IntersectionOptions, useInView } from 'react-intersection-observer';
import router from 'next/router';
import Skills from '@/components/Skills';
import Details from '@/components/Details';
import { useLanguageContext } from '@/contexts/LanguageContext';

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
    aboutShort:
      'Sou Sthiven, desenvolvedor fullstack focado em backend, com boa base em frontend e design. Venho da física, passei por pesquisa em energia e matéria escura e hoje uso código para melhorar a vida das pessoas.',
    repos: 'Repositórios',
    curses: 'Cursos completos',
    yearExperience: 'Anos de experiência',
    skillsTitle: 'Skills',
    experienceTitle: 'Experiências',
  },
  en: {
    main: 'Passion Fuels Purpose! ',
    biography: 'Biography',
    about:
      "Hi, I'm Sthiven, a fullstack developer with a strong focus on backend, but also comfortable on the frontend and with design. I started in Physics at UFRRJ, did scientific research in dark matter and energy, and today I use code to solve real problems and improve people’s daily lives.\nI believe technology should be accessible and meaningful, so I’m always learning and exploring new tools, from DevOps to UI/UX, to deliver better experiences.",
    aboutShort:
      "I'm Sthiven, a fullstack developer focused on backend, with solid experience in frontend and design. My background in Physics and research helps me think analytically while using code to solve real-world problems.",
    repos: 'Repositories',
    curses: 'Complete courses',
    yearExperience: 'Year of experience',
    skillsTitle: 'Skills',
    experienceTitle: 'Experience',
  },
  es: {
    main: '¡La pasión alimenta el propósito!',
    biography: 'Biografía',
    about:
      "Hola, soy Sthiven, desarrollador fullstack con foco en backend, pero también con buena base en frontend y diseño. Empecé en Física en la UFRRJ, participé en investigaciones sobre materia y energía oscura y hoy utilizo el código para mejorar la vida diaria de las personas.\nCreo que la tecnología debe ser útil y accesible, por eso siempre estoy estudiando nuevas herramientas, desde DevOps hasta UI/UX, para ofrecer mejores experiencias.",
    aboutShort:
      'Soy Sthiven, desarrollador fullstack enfocado en backend, con experiencia en frontend y diseño. Mi base en Física y en investigación me ayuda a pensar de forma analítica mientras uso código para resolver problemas reales.',
    repos: 'Repositorios',
    curses: 'Cursos completos',
    yearExperience: 'Años de experiencia',
    skillsTitle: 'Skills',
    experienceTitle: 'Experiencias',
  }
}

export default function About() {
  const { language } = useLanguageContext();

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
              {/* Versão curta para mobile */}
              <p className='font-medium text-justify md:hidden'>
                {text[language]?.aboutShort}
              </p>
              {/* Versão completa para telas médias e maiores */}
              <div className='hidden md:block'>
                {text[language]?.about.split("\n").map((paragraph, index) => {
                  return (
                    <p
                      key={`paragraph-${index}`}
                      className='font-medium [&:not(:last-child)]:mb-4 text-justify'
                    >
                      {paragraph}
                    </p>
                  )
                })}
              </div>

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
                  3+
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
  const { language } = useLanguageContext();

  return (
    <section id={'skills'}>
      <h2 className='font-bold text-4xl sm:text-6xl lg:text-8xl w-full text-center mb-8'>{text[language].skillsTitle}</h2>
      <div className='w-full h-[26rem] sm:h-[32rem] lg:h-screen relative flex items-center justify-center rounded-full bg-circularDark overflow-hidden'>
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
  const { language } = useLanguageContext();

  return (
    <section id='experience' className='flex flex-col gap-16'>
      <h2 className='font-bold text-4xl sm:text-8xl w-full text-center'>{text[language].experienceTitle}</h2>
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
              {/* resumo mobile */}
              <Details.Description
                classname='font-medium w-full md:hidden'
                work='Desenvolvedor fullstack criando aplicações internas e para clientes com React/Angular no frontend e NestJS no backend, em contato frequente com Azure e Kubernetes.'
              />
              {/* texto completo desktop */}
              <Details.Description
                classname='hidden md:block font-medium w-full'
                work='Diariamente trabalho como desenvolvedor fullstack criando aplicações internas ou para nossos clientes utilizando React ou Angular para frontend e Nestjs no backend, frequente contato com arquitetura na Azure e Kubernetes.'
              />
            </Details.Article>
          </Details.Main>


          <Details.Main classname='flex items-center gap-8'>
            <Details.Article classname='w-11/12'>
              <Details.Title
                classname='capitalize'
                companyLink='https://www.linkedin.com/company/doutor-hoje/'
                company='Doutor Hoje'
                position='Freelancer'
              />
              <Details.SpaceAndTime
                classname='capitalize opacity-75'
                address='Brasil'
                time='2024/06 - 2025/12'
              />
              {/* resumo mobile */}
              <Details.Description
                classname='font-medium w-full md:hidden'
                work='Desenvolvimento de frontend em Next.js consumindo APIs GraphQL e REST, com apoio pontual no backend em PHP.'
              />
              {/* texto completo desktop */}
              <Details.Description
                classname='hidden md:block font-medium w-full'
                work={`
                  Atuação como desenvolvedor freelancer na Doutor Hoje, focado no desenvolvimento do frontend em Next.js,
                  consumindo tanto APIs GraphQL quanto REST para integrar as funcionalidades da plataforma.
                  Também realizei apoio pontual no backend em PHP, ajudando na evolução e correção de serviços existentes.
                `}
              />
            </Details.Article>
            <Details.AsideImage classname='opacity-70' src={develop} alt='doutor hoje developer' />
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
              {/* resumo mobile */}
              <Details.Description
                classname='font-medium w-full md:hidden'
                work='Desenvolvimento de RPAs com Puppeteer e interfaces com Blockly para ensino de programação, além de refatoração de código legado em PHP para React.'
              />
              {/* texto completo desktop */}
              <Details.Description
                classname='hidden md:block font-medium w-full'
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
              {/* resumo mobile */}
              <Details.Description
                classname='font-medium w-full md:hidden'
                work='Atuação voluntária em projetos de educação e pequenos negócios, ajudando com backend, frontend e design conforme a necessidade.'
              />
              {/* texto completo desktop */}
              <Details.Description
                classname='hidden md:block font-medium w-full'
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