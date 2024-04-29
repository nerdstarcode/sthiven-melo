import AnimatedText from '@/components/AnimatedText';
import Layout from '@/components/Layout';
import ProjectCardTemplate from '@/components/ProjectCard/templates/default';
import Head from 'next/head';
import ProjectCodedOnly from '@/components/ProjectCard/templates/codedOnly';

//projects
import nlwSpaceTime from '@p/projects/nlw-space-time.png'
import nlwUnite from '@p/projects/nlw-unite.png'
import nlwESports from '@p/projects/nlw-esports.png'
import igniteLabStorybook from '@p/projects/ignitelab-storybook.png'
import igniteLabNodejs from '@p/projects/ignitelab-nodejs.png'

import cloneInstagram from '@p/projects/clone-insta.png'
import loginBootstrap from '@p/projects/login-bootstrap.png'

import nplRedis from '@p/projects/nlp-redis.png'
import arduino from '@p/projects/arduino.png'
import spotify from '@p/projects/spotify.png'

export default function Projects() {
  return (
    <div className='h-fit min-h-screen'>
      <Head>
        <title>NerdStarCode | Projects Page</title>
        <meta name='description' content='sobre minha trajetória no desnvolvimento'></meta>
      </Head>
      <main className='flex w-full flex-col items-center justify-center'>
        <Layout classname='pt-16 gap-16'>
          <AnimatedText text='A imaginação aprimora o esforço' className='' />
          <section className='grid grid-cols-12 gap-4 sm:gap-8 '>
            {/* <h3 className='col-span-12'>Projetos desenvolvidos</h3> */}
            <ProjectCardTemplate
              title='Nlw Space Time'
              github='https://github.com/nerdstarcode/NLW_SpaceTime'
              link='https://github.com/nerdstarcode/NLW_SpaceTime'
              src={nlwSpaceTime}
              imageClassName='4xl:object-left'
              summary={`Construido um projeto fullstack em Nextjs, Express e React Native. O Projeto é como um diário onde o usuário se cadastra e adiciona fotos e uma história para sua memória que ficam armazenadas de forma que cria uma timeline de acontecimentos`}
              type='FullStack' />

            <ProjectCodedOnly
              title='NLW Unite'
              github='https://github.com/nerdstarcode/node-nlw-unite'
              src={nlwUnite}
              type='Backend' />


            <ProjectCodedOnly
              title='Ignite Lab Nodejs'
              github='https://github.com/nerdstarcode/ignite-lab-nodejs'
              src={igniteLabNodejs}
              type='Backend' />

            <ProjectCardTemplate
              title='NLW Esports'
              github='https://github.com/nerdstarcode/nlw-esports'
              link='https://github.com/nerdstarcode/nlw-esports'
              src={nlwESports}
              imageClassName='4xl:object-center'

              summary={`Construido um projeto fullstack em Nextjs, Express e React Native. O Projeto tem o objetivo de criar posts para juntar pessoas para jogarem determinados jogos. Há todo o processo de criação de anuncios utilizando a api da twitch para pegar imagens atualizadas dos jogos em questão.`}
              type='FullStack' />

            <ProjectCodedOnly
              title='Ignite Lab Storybook'
              github='https://github.com/nerdstarcode/IgniteLabStorybook'
              src={igniteLabStorybook}
              type='Frontend' />

            <ProjectCodedOnly
              title='NLP Redis'
              github='https://github.com/nerdstarcode/NLP'
              src={nplRedis}
              type='Backend' />
            <ProjectCodedOnly
              title='Spotify Web'
              github='https://github.com/nerdstarcode/spotify-music-info'
              src={spotify}
              type='Frontend' />
            <ProjectCodedOnly
              title='Spotify Server'
              github='https://github.com/nerdstarcode/spotify-music-info-server'
              src={spotify}
              type='Backend' />
            <ProjectCodedOnly
              title='Clone Instagram'
              github='https://github.com/nerdstarcode/Clone-Instagram'
              src={cloneInstagram}
              type='FrontEnd' />
            <ProjectCodedOnly
              title='Login Gitlab Rebrading'
              github='https://github.com/nerdstarcode/LoginBootstrap'
              src={loginBootstrap}
              type='FrontEnd' />
            <ProjectCodedOnly
              title='Arduino - Básico'
              github='https://github.com/nerdstarcode/ProgramasBasicosArduino'
              src={arduino}
              type='Others' />
          </section>
        </Layout>
      </main>
    </div>
  )
}
