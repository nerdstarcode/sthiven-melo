import type { StaticImageData } from 'next/image'
import aftereffect from '@p/aftereffect.png'
import autodesk from '@p/autodesk.png'
import azure from '@p/back/azure.png'
import nest from '@p/back/nest.svg'
import postgresql from '@p/back/postgreesql.png'
import postman from '@p/back/postman.svg'
import prisma from '@p/back/prisma.png'
import puppeteer from '@p/back/puppeteer.png'
import python from '@p/back/python.png'
import typeorm from '@p/back/typeorm.png'
import typescript from '@p/back/typescript.png'
import figma from '@p/figma.svg'
import angular from '@p/front/angular.png'
import react from '@p/front/react.png'
import sass from '@p/front/sass.png'
import storybook from '@p/front/storybook.png'
import vue from '@p/front/vue.png'
import zod from '@p/front/zod.png'
import illustrator from '@p/illustrator.png'
import photoshop from '@p/photoshop.png'

export type ExpertiseLevel = 'small' | 'medium' | 'high'

export interface Tool {
  name: string
  image: StaticImageData
}

export interface ToolExperience extends Tool {
  /** Ex.: `3+`, `1-`. */
  years: string
  level: ExpertiseLevel
}

export const designTools: ToolExperience[] = [
  { name: 'Figma', image: figma, years: '3+', level: 'medium' },
  { name: 'Photoshop', image: photoshop, years: '2+', level: 'small' },
  { name: 'Illustrator', image: illustrator, years: '2+', level: 'medium' },
  { name: 'Autodesk', image: autodesk, years: '2+', level: 'small' },
  { name: 'After Effects', image: aftereffect, years: '3+', level: 'small' },
]

export const frontendTools: ToolExperience[] = [
  { name: 'React', image: react, years: '3+', level: 'high' },
  { name: 'Vue', image: vue, years: '1-', level: 'small' },
  { name: 'Angular', image: angular, years: '2+', level: 'high' },
  { name: 'Sass', image: sass, years: '3+', level: 'high' },
  { name: 'Storybook', image: storybook, years: '3+', level: 'high' },
  { name: 'Zod', image: zod, years: '3+', level: 'high' },
]

export const backendStack: Tool[] = [
  { name: 'Azure', image: azure },
  { name: 'NestJS', image: nest },
  { name: 'PostgreSQL', image: postgresql },
  { name: 'Postman', image: postman },
  { name: 'Prisma', image: prisma },
  { name: 'TypeScript', image: typescript },
  { name: 'Puppeteer', image: puppeteer },
  { name: 'Python', image: python },
  { name: 'TypeORM', image: typeorm },
]
