import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { GithubIcon } from '@/components/atoms/Icon'
import type { Project } from '@/data/projects'
import { useLocalize, useTranslation } from '@/i18n'

export interface ProjectCardProps {
  project: Project
}

/** Estilos por variante: `featured` (largo, com resumo) e `codeOnly` (compacto, só GitHub). */
const VARIANT_STYLES = {
  featured: {
    card: 'md:col-span-12 4xl:col-span-8 sm:flex-row',
    thumb: 'sm:w-1/2 h-full',
    aside: 'sm:w-1/2 px-2 sm:px-4 pb-2 sm:pb-4',
    links: '',
  },
  codeOnly: {
    card: 'md:col-span-6 4xl:col-span-4',
    thumb: 'h-[65%]',
    aside: 'min-h-fit h-[35%] px-2 pb-2 sm:px-8 sm:pb-8',
    links: 'w-full justify-between flex-row-reverse',
  },
}

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslation('projects')
  const localize = useLocalize()
  const styles = VARIANT_STYLES[project.variant]
  const link = project.variant === 'featured' ? project.link : project.github

  return (
    <motion.article
      className={twMerge(
        'col-span-12 flex w-full flex-col items-stretch justify-between gap-1 overflow-hidden rounded-3xl border border-solid border-gray-800 bg-zinc-900/60 px-0 shadow-2xl transition-transform duration-200 sm:items-center',
        styles.card,
      )}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <Link
        href={link}
        {...EXTERNAL}
        tabIndex={-1}
        aria-hidden
        className={twMerge(
          'w-full cursor-pointer overflow-hidden rounded-t-3xl sm:rounded-s-3xl sm:rounded-tr-none',
          styles.thumb,
        )}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.25 }}
          className='h-full w-full'
        >
          <Image
            src={project.image}
            alt={project.title}
            className={twMerge(
              'h-full w-full object-cover 4xl:h-full 4xl:w-auto 4xl:object-cover',
              project.imageClassName,
            )}
          />
        </motion.div>
      </Link>

      <div
        className={twMerge(
          'flex h-full w-full flex-col items-start justify-between p-4 sm:py-4 sm:pr-4',
          styles.aside,
        )}
      >
        <div className='flex flex-col items-start justify-between gap-1 sm:gap-4'>
          <span className='text-sm font-medium text-primary sm:text-xl'>
            {t.types[project.type]}
          </span>
          <Link className='underline-offset-2 hover:underline' href={link} {...EXTERNAL}>
            <h4 className='text-xl font-bold sm:text-4xl'>{project.title}</h4>
          </Link>
        </div>

        {project.variant === 'featured' && (
          <p className='my-2 max-h-[9.5rem] overflow-y-scroll font-medium 4xl:max-h-full 4xl:text-2xl 2xl:text-xl'>
            {localize(project.summary)}
          </p>
        )}

        <div className={twMerge('flex items-center gap-2 sm:gap-4', styles.links)}>
          {project.github && (
            <Link className='w-6 sm:w-10' href={project.github} aria-label='GitHub' {...EXTERNAL}>
              <GithubIcon aria-hidden />
            </Link>
          )}
          <Link className='text-sm sm:text-base' href={link} {...EXTERNAL}>
            {t.viewProject}
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectCard
