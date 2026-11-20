import { apps } from './apps'
import type { Localized } from './types'

export const nav = {
  pt: {
    home: 'Início',
    about: 'Sobre',
    projects: 'Projetos',
    examples: 'Exemplos',
    skills: 'Skills',
    experience: 'Experiências',
    openMenu: 'Abrir menu',
    toggleTheme: 'Alternar tema claro/escuro',
  },
  en: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    examples: 'Examples',
    skills: 'Skills',
    experience: 'Experience',
    openMenu: 'Open menu',
    toggleTheme: 'Toggle light/dark theme',
  },
  es: {
    home: 'Inicio',
    about: 'Sobre mí',
    projects: 'Proyectos',
    examples: 'Ejemplos',
    skills: 'Skills',
    experience: 'Experiencias',
    openMenu: 'Abrir menú',
    toggleTheme: 'Cambiar tema claro/oscuro',
  },
} satisfies Localized<Record<string, string>>

export const home = {
  pt: {
    metaTitle: 'Nerd Star Code',
    metaDescription: 'Portfólio de Sthiven Melo, desenvolvedor full-stack.',
    title: 'Transformando ideias em realidade com código e design.',
    describe:
      'Desenvolvedor full-stack com 4 anos de experiência no mercado, atuando em frontend e backend, bancos relacionais e não relacionais, além de cloud (Azure e AWS).\nNavegue pelos meus projetos e artigos mais recentes, que unem código, arquitetura e design para criar experiências web bem organizadas.',
    experience: 'Experiência',
    stack: 'Stack',
    projects: 'Projetos',
    andMore: 'E mais...',
    contact: 'Contato',
    resume: 'Currículo',
    profileAlt: 'Ilustração de Sthiven Melo programando',
  },
  en: {
    metaTitle: 'Nerd Star Code',
    metaDescription: "Sthiven Melo's portfolio, full-stack developer.",
    title: 'Turning Vision Into Reality With Code And Design.',
    describe:
      "I'm a full-stack developer with 4 years of professional experience, working across frontend, backend, relational and non-relational databases, and cloud (Azure & AWS).\nBrowse my latest projects and articles, where I combine code, architecture and design to build well-structured web experiences.",
    experience: 'Experience',
    stack: 'Stack',
    projects: 'Projects',
    andMore: 'And more...',
    contact: 'Contact',
    resume: 'Resume',
    profileAlt: 'Illustration of Sthiven Melo coding',
  },
  es: {
    metaTitle: 'Nerd Star Code',
    metaDescription: 'Portafolio de Sthiven Melo, desarrollador full-stack.',
    title: 'Convirtiendo la visión en realidad con código y diseño.',
    describe:
      'Desarrollador full-stack con 4 años de experiencia en el mercado, trabajando tanto en frontend como en backend, con bases de datos relacionales y no relacionales y cloud (Azure y AWS).\nExplore mis últimos proyectos y artículos, donde uno código, arquitectura y diseño para crear experiencias web bien organizadas.',
    experience: 'Experiencia',
    stack: 'Stack',
    projects: 'Proyectos',
    andMore: 'Y más...',
    contact: 'Contacto',
    resume: 'Currículum',
    profileAlt: 'Ilustración de Sthiven Melo programando',
  },
} satisfies Localized<Record<string, string>>

export const tools = {
  pt: {
    years: 'anos',
    expertise: 'Domínio',
    levels: { small: 'básico', medium: 'intermediário', high: 'avançado' },
  },
  en: {
    years: 'years',
    expertise: 'Expertise',
    levels: { small: 'small', medium: 'medium', high: 'high' },
  },
  es: {
    years: 'años',
    expertise: 'Dominio',
    levels: { small: 'básico', medium: 'intermedio', high: 'avanzado' },
  },
}

export const about = {
  pt: {
    metaTitle: 'NerdStarCode | Sobre',
    metaDescription: 'Sobre minha trajetória no desenvolvimento.',
    main: 'A paixão alimenta o propósito!',
    biography: 'Biografia',
    about:
      'Meu nome é Sthiven Raphael Melo Correia e hoje sou estagiário na empresa NTT DATA, tive um longo caminho para chegar até onde estou e fiz muitas curvas. Iniciei estudando licenciatura plena em física na UFRRJ, participei de iniciação científica em energia e matéria escura no Observatório Nacional e hoje em dia ajudo a melhorar a qualidade de vida de outros trabalhadores através do código\nTenho foco em backend, mas não consigo focar nele sem entender os entornos, então também tenho bastante experiência em front e quebro uns galhos na parte de design. No momento tenho estudado a parte de devops.\nSou uma pessoa simples e geralmente bem alegre, meu foco na carreira é ser o melhor que eu posso ser e ajudar o máximo de pessoas que eu puder.',
    aboutShort:
      'Sou Sthiven, desenvolvedor fullstack focado em backend, com boa base em frontend e design. Venho da física, passei por pesquisa em energia e matéria escura e hoje uso código para melhorar a vida das pessoas.',
    repos: 'Repositórios',
    curses: 'Cursos completos',
    yearExperience: 'Anos de experiência',
    skillsTitle: 'Skills',
    experienceTitle: 'Experiências',
    profileAlt: 'Foto de Sthiven Melo',
  },
  en: {
    metaTitle: 'NerdStarCode | About',
    metaDescription: 'About my journey in software development.',
    main: 'Passion Fuels Purpose!',
    biography: 'Biography',
    about:
      "Hi, I'm Sthiven, a fullstack developer with a strong focus on backend, but also comfortable on the frontend and with design. I started in Physics at UFRRJ, did scientific research in dark matter and energy, and today I use code to solve real problems and improve people's daily lives.\nI believe technology should be accessible and meaningful, so I'm always learning and exploring new tools, from DevOps to UI/UX, to deliver better experiences.",
    aboutShort:
      "I'm Sthiven, a fullstack developer focused on backend, with solid experience in frontend and design. My background in Physics and research helps me think analytically while using code to solve real-world problems.",
    repos: 'Repositories',
    curses: 'Complete courses',
    yearExperience: 'Years of experience',
    skillsTitle: 'Skills',
    experienceTitle: 'Experience',
    profileAlt: 'Photo of Sthiven Melo',
  },
  es: {
    metaTitle: 'NerdStarCode | Sobre mí',
    metaDescription: 'Sobre mi trayectoria en el desarrollo.',
    main: '¡La pasión alimenta el propósito!',
    biography: 'Biografía',
    about:
      'Hola, soy Sthiven, desarrollador fullstack con foco en backend, pero también con buena base en frontend y diseño. Empecé en Física en la UFRRJ, participé en investigaciones sobre materia y energía oscura y hoy utilizo el código para mejorar la vida diaria de las personas.\nCreo que la tecnología debe ser útil y accesible, por eso siempre estoy estudiando nuevas herramientas, desde DevOps hasta UI/UX, para ofrecer mejores experiencias.',
    aboutShort:
      'Soy Sthiven, desarrollador fullstack enfocado en backend, con experiencia en frontend y diseño. Mi base en Física y en investigación me ayuda a pensar de forma analítica mientras uso código para resolver problemas reales.',
    repos: 'Repositorios',
    curses: 'Cursos completos',
    yearExperience: 'Años de experiencia',
    skillsTitle: 'Skills',
    experienceTitle: 'Experiencias',
    profileAlt: 'Foto de Sthiven Melo',
  },
} satisfies Localized<Record<string, string>>

export const experience = {
  pt: { present: 'Atual' },
  en: { present: 'Present' },
  es: { present: 'Actual' },
} satisfies Localized<Record<string, string>>

export const projects = {
  pt: {
    metaTitle: 'NerdStarCode | Projetos',
    heading: 'A imaginação aprimora o esforço',
    metaDescription:
      'Projetos que desenvolvi como fullstack, frontend e backend, unindo código, arquitetura e design.',
    viewProject: 'Ver projeto',
    types: { Frontend: 'Frontend', Backend: 'Backend', FullStack: 'FullStack', Others: 'Outros' },
  },
  en: {
    metaTitle: 'NerdStarCode | Projects',
    heading: 'Imagination enhances effort',
    metaDescription:
      'Projects I have built as a fullstack, frontend and backend developer, combining code, architecture and design.',
    viewProject: 'View Project',
    types: { Frontend: 'Frontend', Backend: 'Backend', FullStack: 'FullStack', Others: 'Others' },
  },
  es: {
    metaTitle: 'NerdStarCode | Proyectos',
    heading: 'La imaginación potencia el esfuerzo',
    metaDescription:
      'Proyectos que desarrollé como fullstack, frontend y backend, uniendo código, arquitectura y diseño.',
    viewProject: 'Ver proyecto',
    types: { Frontend: 'Frontend', Backend: 'Backend', FullStack: 'FullStack', Others: 'Otros' },
  },
}

export const examples = {
  pt: {
    metaTitle: 'NerdStarCode | Exemplos',
    cubeTitle: 'Cube 3D Rotation',
    cubeDescription: 'Componente criado com ThreeJS',
    glowingTitle: 'Glowing Cube component',
    glowingDescription: 'Componente criado com Tailwind CSS',
  },
  en: {
    metaTitle: 'NerdStarCode | Examples',
    cubeTitle: 'Cube 3D Rotation',
    cubeDescription: 'Component built with ThreeJS',
    glowingTitle: 'Glowing Cube component',
    glowingDescription: 'Component built with Tailwind CSS',
  },
  es: {
    metaTitle: 'NerdStarCode | Ejemplos',
    cubeTitle: 'Rotación de Cubo 3D',
    cubeDescription: 'Componente creado con ThreeJS',
    glowingTitle: 'Componente Cubo Brillante',
    glowingDescription: 'Componente creado con Tailwind CSS',
  },
} satisfies Localized<Record<string, string>>

export const hireMe = {
  pt: { contact: 'Contato' },
  en: { contact: 'Contact' },
  es: { contact: 'Contacto' },
} satisfies Localized<Record<string, string>>

export const footer = {
  pt: {
    rights: 'Todos os direitos reservados.',
    builtWith: 'Feito com',
    by: 'por',
    sayHello: 'Diga olá!',
  },
  en: { rights: 'All Rights Reserved.', builtWith: 'Build With', by: 'by', sayHello: 'Say Hello!' },
  es: {
    rights: 'Todos los derechos reservados.',
    builtWith: 'Hecho con',
    by: 'por',
    sayHello: '¡Saluda!',
  },
} satisfies Localized<Record<string, string>>

export const notFound = {
  pt: { title: 'NÃO ENCONTRADO', alt: 'Ilustração de página não encontrada' },
  en: { title: 'NOT FOUND', alt: 'Page not found illustration' },
  es: { title: 'NO ENCONTRADO', alt: 'Ilustración de página no encontrada' },
} satisfies Localized<Record<string, string>>

export const dictionaries = {
  apps,
  nav,
  home,
  tools,
  about,
  experience,
  projects,
  examples,
  hireMe,
  footer,
  notFound,
}

export type Namespace = keyof typeof dictionaries
