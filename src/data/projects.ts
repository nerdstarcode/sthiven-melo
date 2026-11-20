import type { StaticImageData } from 'next/image'
import type { Localized } from '@/i18n'
import arduino from '@p/projects/arduino.png'
import cartaoSaude from '@p/projects/cartao-saude.png'
import cloneInstagram from '@p/projects/clone-insta.png'
import igniteLabNodejs from '@p/projects/ignitelab-nodejs.png'
import igniteLabStorybook from '@p/projects/ignitelab-storybook.png'
import loginBootstrap from '@p/projects/login-bootstrap.png'
import nlpRedis from '@p/projects/nlp-redis.png'
import nlwESports from '@p/projects/nlw-esports.png'
import nlwSpaceTime from '@p/projects/nlw-space-time.png'
import nlwUnite from '@p/projects/nlw-unite.png'
import spotify from '@p/projects/spotify.png'

export const PROJECT_TYPES = ['Frontend', 'Backend', 'FullStack', 'Others'] as const
export type ProjectType = (typeof PROJECT_TYPES)[number]

interface BaseProject {
  id: string
  title: string
  type: ProjectType
  image: StaticImageData
  github?: string
  imageClassName?: string
}

/** Card grande, com resumo e link para o projeto publicado. */
export interface FeaturedProject extends BaseProject {
  variant: 'featured'
  link: string
  summary: Localized
}

/** Card compacto: só código no GitHub. */
export interface CodeOnlyProject extends BaseProject {
  variant: 'codeOnly'
  github: string
}

export type Project = FeaturedProject | CodeOnlyProject

export const projects: Project[] = [
  {
    id: 'cartao-saude',
    variant: 'featured',
    title: 'Cartão Saúde mais',
    link: 'https://sejasaudemais.com.br/',
    image: cartaoSaude,
    imageClassName: 'object-center',
    type: 'Frontend',
    summary: {
      pt: 'Experiência profissional como dev pleno no desenvolvimento do site do plano de saúde Cartão Saúde + em Next.js, usando uma API GraphQL, enquanto orientava um júnior no desenvolvimento.',
      en: 'Professional experience as a mid-level developer building the Cartão Saúde + health plan website in Next.js with a GraphQL API, while mentoring a junior developer.',
      es: 'Experiencia profesional como desarrollador semi-senior en el sitio del plan de salud Cartão Saúde + en Next.js con una API GraphQL, mientras orientaba a un junior en el desarrollo.',
    },
  },
  {
    id: 'nlw-unite',
    variant: 'codeOnly',
    title: 'NLW Unite',
    github: 'https://github.com/nerdstarcode/node-nlw-unite',
    image: nlwUnite,
    type: 'Backend',
  },
  {
    id: 'ignite-lab-nodejs',
    variant: 'codeOnly',
    title: 'Ignite Lab Nodejs',
    github: 'https://github.com/nerdstarcode/ignite-lab-nodejs',
    image: igniteLabNodejs,
    type: 'Backend',
  },
  {
    id: 'ignite-lab-storybook',
    variant: 'codeOnly',
    title: 'Ignite Lab Storybook',
    github: 'https://github.com/nerdstarcode/IgniteLabStorybook',
    image: igniteLabStorybook,
    type: 'Frontend',
  },
  {
    id: 'nlp-redis',
    variant: 'codeOnly',
    title: 'NLP Redis',
    github: 'https://github.com/nerdstarcode/NLP',
    image: nlpRedis,
    type: 'Backend',
  },
  {
    id: 'nlw-space-time',
    variant: 'featured',
    title: 'Nlw Space Time',
    github: 'https://github.com/nerdstarcode/NLW_SpaceTime',
    link: 'https://github.com/nerdstarcode/NLW_SpaceTime',
    image: nlwSpaceTime,
    imageClassName: '4xl:object-left',
    type: 'FullStack',
    summary: {
      pt: 'Projeto fullstack em Next.js, Express e React Native. Funciona como um diário: o usuário se cadastra e adiciona fotos e uma história para cada memória, que ficam armazenadas formando uma timeline de acontecimentos.',
      en: 'Fullstack project built with Next.js, Express and React Native. It works like a journal: users sign up and add photos and a story to each memory, which are stored to build a timeline of events.',
      es: 'Proyecto fullstack en Next.js, Express y React Native. Funciona como un diario: el usuario se registra y agrega fotos y una historia a cada recuerdo, que se almacenan formando una línea de tiempo.',
    },
  },
  {
    id: 'spotify-web',
    variant: 'codeOnly',
    title: 'Spotify Web',
    github: 'https://github.com/nerdstarcode/spotify-music-info',
    image: spotify,
    type: 'Frontend',
  },
  {
    id: 'spotify-server',
    variant: 'codeOnly',
    title: 'Spotify Server',
    github: 'https://github.com/nerdstarcode/spotify-music-info-server',
    image: spotify,
    type: 'Backend',
  },
  {
    id: 'nlw-esports',
    variant: 'featured',
    title: 'NLW Esports',
    github: 'https://github.com/nerdstarcode/nlw-esports',
    link: 'https://github.com/nerdstarcode/nlw-esports',
    image: nlwESports,
    imageClassName: '4xl:object-center',
    type: 'FullStack',
    summary: {
      pt: 'Projeto fullstack em Next.js, Express e React Native para criar anúncios que reúnem pessoas para jogar determinados jogos. Todo o fluxo de criação de anúncios usa a API da Twitch para buscar imagens atualizadas dos jogos.',
      en: 'Fullstack project built with Next.js, Express and React Native to create posts that bring people together to play specific games. The whole ad creation flow uses the Twitch API to fetch up-to-date game images.',
      es: 'Proyecto fullstack en Next.js, Express y React Native para crear anuncios que reúnen personas para jugar determinados juegos. Todo el flujo de creación de anuncios usa la API de Twitch para obtener imágenes actualizadas de los juegos.',
    },
  },
  {
    id: 'clone-instagram',
    variant: 'codeOnly',
    title: 'Clone Instagram',
    github: 'https://github.com/nerdstarcode/Clone-Instagram',
    image: cloneInstagram,
    type: 'Frontend',
  },
  {
    id: 'login-gitlab',
    variant: 'codeOnly',
    title: 'Login Gitlab Rebranding',
    github: 'https://github.com/nerdstarcode/LoginBootstrap',
    image: loginBootstrap,
    type: 'Frontend',
  },
  {
    id: 'arduino',
    variant: 'codeOnly',
    title: 'Arduino - Básico',
    github: 'https://github.com/nerdstarcode/ProgramasBasicosArduino',
    image: arduino,
    type: 'Others',
  },
]
