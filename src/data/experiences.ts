import type { StaticImageData } from 'next/image'
import type { Localized } from '@/i18n'
import nttDataImage from '@p/backend.svg'
import develop from '@p/experience/developer-activity-animate.svg'
import freela from '@p/experience/freelancer-animate.svg'
import volunteer from '@p/experience/Volunteering-bro.svg'

export interface Experience {
  id: string
  position: Localized
  company?: string
  companyLink?: string
  /** Formato `AAAA/MM`. */
  start?: string
  /** Formato `AAAA/MM`; ausente = emprego atual. */
  end?: string
  address: Localized
  /** Texto curto exibido no mobile. */
  summary: Localized
  /** Texto completo exibido a partir de `md`. */
  description: Localized
  image: { src: StaticImageData; alt: Localized }
}

const BRAZIL: Localized = { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }

export const experiences: Experience[] = [
  {
    id: 'ntt-data',
    position: {
      pt: 'Estagiário de Engenharia de Software',
      en: 'Intern Software Engineer',
      es: 'Becario de Ingeniería de Software',
    },
    company: 'NTT DATA, Inc',
    companyLink: 'https://www.linkedin.com/company/ntt-data-inc/mycompany/',
    start: '2022/11',
    address: BRAZIL,
    summary: {
      pt: 'Desenvolvedor fullstack criando aplicações internas e para clientes com React/Angular no frontend e NestJS no backend, em contato frequente com Azure e Kubernetes.',
      en: 'Fullstack developer building internal and client applications with React/Angular on the frontend and NestJS on the backend, working closely with Azure and Kubernetes.',
      es: 'Desarrollador fullstack creando aplicaciones internas y para clientes con React/Angular en el frontend y NestJS en el backend, en contacto frecuente con Azure y Kubernetes.',
    },
    description: {
      pt: 'Diariamente trabalho como desenvolvedor fullstack criando aplicações internas ou para nossos clientes utilizando React ou Angular para frontend e Nestjs no backend, frequente contato com arquitetura na Azure e Kubernetes.',
      en: 'Every day I work as a fullstack developer building internal applications and solutions for our clients, using React or Angular on the frontend and NestJS on the backend, with frequent hands-on work on Azure architecture and Kubernetes.',
      es: 'Diariamente trabajo como desarrollador fullstack creando aplicaciones internas o para nuestros clientes con React o Angular en el frontend y NestJS en el backend, con contacto frecuente con arquitectura en Azure y Kubernetes.',
    },
    image: {
      src: nttDataImage,
      alt: {
        pt: 'Ilustração de desenvolvimento backend',
        en: 'Backend development illustration',
        es: 'Ilustración de desarrollo backend',
      },
    },
  },
  {
    id: 'doutor-hoje',
    position: { pt: 'Freelancer', en: 'Freelancer', es: 'Freelancer' },
    company: 'Doutor Hoje',
    companyLink: 'https://www.linkedin.com/company/doutor-hoje/',
    start: '2024/06',
    end: '2025/12',
    address: BRAZIL,
    summary: {
      pt: 'Desenvolvimento de frontend em Next.js consumindo APIs GraphQL e REST, com apoio pontual no backend em PHP.',
      en: 'Frontend development in Next.js consuming GraphQL and REST APIs, with occasional backend support in PHP.',
      es: 'Desarrollo de frontend en Next.js consumiendo APIs GraphQL y REST, con apoyo puntual en el backend en PHP.',
    },
    description: {
      pt: 'Atuação como desenvolvedor freelancer na Doutor Hoje, focado no desenvolvimento do frontend em Next.js, consumindo tanto APIs GraphQL quanto REST para integrar as funcionalidades da plataforma. Também realizei apoio pontual no backend em PHP, ajudando na evolução e correção de serviços existentes.',
      en: 'Freelance developer at Doutor Hoje, focused on frontend development in Next.js, consuming both GraphQL and REST APIs to integrate the platform features. I also provided occasional backend support in PHP, helping evolve and fix existing services.',
      es: 'Desarrollador freelancer en Doutor Hoje, enfocado en el desarrollo del frontend en Next.js, consumiendo APIs GraphQL y REST para integrar las funcionalidades de la plataforma. También brindé apoyo puntual en el backend en PHP, ayudando a evolucionar y corregir servicios existentes.',
    },
    image: {
      src: develop,
      alt: {
        pt: 'Ilustração de desenvolvedor trabalhando',
        en: 'Developer at work illustration',
        es: 'Ilustración de desarrollador trabajando',
      },
    },
  },
  {
    id: 'modalnetworks',
    position: {
      pt: 'Engenheiro de Software',
      en: 'Software Engineer',
      es: 'Ingeniero de Software',
    },
    company: 'Modalnetworks | ModalEduca',
    companyLink:
      'https://www.linkedin.com/company/modal---modalnetworks-servi-os-em-inform-tica/about/',
    start: '2022/09',
    end: '2023/03',
    address: BRAZIL,
    summary: {
      pt: 'Desenvolvimento de RPAs com Puppeteer e interfaces com Blockly para ensino de programação, além de refatoração de código legado em PHP para React.',
      en: 'Built RPAs with Puppeteer and Blockly interfaces for teaching programming, plus refactoring legacy PHP code into React.',
      es: 'Desarrollo de RPAs con Puppeteer e interfaces con Blockly para la enseñanza de programación, además de refactorizar código legado en PHP a React.',
    },
    description: {
      pt: 'Trabalhos diários desenvolvendo RPAs com puppeteer e criação de interface utilizando de blockly para ajudar no ensino de programação para estudantes do fundamental. Além de orientar um segundo estagiário a realizar os RPAs. Houveram também refatorações de códigos legado com php para a nova plataforma com React.',
      en: 'Daily work building RPAs with Puppeteer and creating Blockly-based interfaces to help teach programming to elementary school students, while mentoring a second intern on the RPAs. I also refactored legacy PHP code into the new React platform.',
      es: 'Trabajo diario desarrollando RPAs con Puppeteer y creando interfaces con Blockly para ayudar a enseñar programación a estudiantes de primaria, además de orientar a un segundo becario con los RPAs. También refactoricé código legado en PHP para la nueva plataforma en React.',
    },
    image: {
      src: freela,
      alt: {
        pt: 'Ilustração de freelancer',
        en: 'Freelancer illustration',
        es: 'Ilustración de freelancer',
      },
    },
  },
  {
    id: 'volunteer',
    position: { pt: 'Voluntário', en: 'Volunteer', es: 'Voluntario' },
    address: BRAZIL,
    summary: {
      pt: 'Atuação voluntária em projetos de educação e pequenos negócios, ajudando com backend, frontend e design conforme a necessidade.',
      en: 'Volunteer work on education and small business projects, helping with backend, frontend and design as needed.',
      es: 'Trabajo voluntario en proyectos de educación y pequeños negocios, ayudando con backend, frontend y diseño según la necesidad.',
    },
    description: {
      pt: 'Participo de trabalhos voluntários para aprimorar minha experiência, já trabalhei para empresas de educação e para mini empresa da faculdade UFRRJ. Normalmente atuo em áreas que precisam de algum auxílio, sendo back, front ou até mesmo com design para criação de logos ou na parte de UI/UX',
      en: "I take part in volunteer work to improve my experience. I've worked for education companies and for the UFRRJ student-run company, usually helping wherever support is needed: backend, frontend or even design, creating logos or working on UI/UX.",
      es: 'Participo en trabajos voluntarios para mejorar mi experiencia; ya trabajé para empresas de educación y para la mini empresa de la universidad UFRRJ. Normalmente actúo en áreas que necesitan apoyo: back, front o incluso diseño, creando logos o en UI/UX.',
    },
    image: {
      src: volunteer,
      alt: {
        pt: 'Ilustração de voluntariado',
        en: 'Volunteering illustration',
        es: 'Ilustración de voluntariado',
      },
    },
  },
]
