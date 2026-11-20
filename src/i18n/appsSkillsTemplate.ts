import type { Localized } from './types'

/** Textos do Skills Template (perfil de skills de cada visitante). */
const pt = {
  skillsTemplate: {
    title: 'Skills Template',
    description:
      'Monte o seu perfil de hard e soft skills. O do Sthiven vem de exemplo, e tudo fica só no seu navegador.',
    nav: 'Perfil',
    profile: 'Perfil',
    createTitle: 'Criar meu perfil',
    yourName: 'Seu nome',
    copyFrom: 'Começar com as skills de {name}',
    create: 'Criar perfil',
    nameRequired: 'Informe o seu nome.',
    created: 'Perfil de {name} criado. Ajuste os níveis abaixo.',
    radarTitle: 'Visão do perfil',
    radarDescription: 'Nível de 1 a 5 em cada skill.',
    radarEmpty: 'Adicione ao menos 3 skills de um tipo para ver o radar.',
    summary: '{count} skill(s) · média {average}',
  },
}

export type SkillsTemplateTranslation = typeof pt

const en: SkillsTemplateTranslation = {
  skillsTemplate: {
    title: 'Skills Template',
    description:
      "Build your own hard and soft skills profile. Sthiven's comes as an example, and everything stays in your browser.",
    nav: 'Profile',
    profile: 'Profile',
    createTitle: 'Create my profile',
    yourName: 'Your name',
    copyFrom: "Start with {name}'s skills",
    create: 'Create profile',
    nameRequired: 'Enter your name.',
    created: "{name}'s profile created. Adjust the levels below.",
    radarTitle: 'Profile overview',
    radarDescription: 'Level from 1 to 5 in each skill.',
    radarEmpty: 'Add at least 3 skills of a type to see the radar.',
    summary: '{count} skill(s) · average {average}',
  },
}

const es: SkillsTemplateTranslation = {
  skillsTemplate: {
    title: 'Skills Template',
    description:
      'Arma tu perfil de hard y soft skills. El de Sthiven viene de ejemplo y todo queda solo en tu navegador.',
    nav: 'Perfil',
    profile: 'Perfil',
    createTitle: 'Crear mi perfil',
    yourName: 'Tu nombre',
    copyFrom: 'Empezar con las skills de {name}',
    create: 'Crear perfil',
    nameRequired: 'Escribe tu nombre.',
    created: 'Perfil de {name} creado. Ajusta los niveles abajo.',
    radarTitle: 'Vista del perfil',
    radarDescription: 'Nivel de 1 a 5 en cada skill.',
    radarEmpty: 'Agrega al menos 3 skills de un tipo para ver el radar.',
    summary: '{count} skill(s) · media {average}',
  },
}

export const skillsTemplateTexts: Localized<SkillsTemplateTranslation> = { pt, en, es }
