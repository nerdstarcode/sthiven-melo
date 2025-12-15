import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { GithubIcon } from "../Icons";
import { motion } from "framer-motion";

export interface ProjectCardDTO {
  title: string;
  className?: string;
  link: string;
  github?: string;
  src: any;
  children?: any;
  type: string;
  summary: string;
  imageClassName?: string;
}

const MotionArticle = motion.article;

export function Main({ children, className }: Pick<ProjectCardDTO, 'children' | 'className'>) {
  return (
    <MotionArticle
      className={twMerge(
        `
        col-span-12 md:col-span-6 4xl:col-span-3 
        w-full 
        flex
        flex-col sm:flex-row
        gap-4 sm:gap-6
        items-stretch sm:items-center
        justify-between
        rounded-3xl
        border-solid
        border
        border-gray-800
        bg-zinc-900/60
        shadow-2xl
        overflow-hidden
        transition-transform
        duration-200
      `,
        className
      )}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </MotionArticle>
  )
}

export function Tumble({ title, className, link = '#', src, imageClassName }: Pick<ProjectCardDTO, 'title' | 'className' | 'link' | 'src' | 'imageClassName'>) {
  return (
    <Link
      href={link}
      className={twMerge('cursor-pointer overflow-hidden rounded-t-3xl sm:rounded-s-3xl sm:rounded-tr-none', className)}
      target='_blank'
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.25 }}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt={title}
          className={twMerge(
            'w-full h-full object-cover 4xl:h-full 4xl:w-auto 4xl:object-cover',
            imageClassName
          )}
        />
      </motion.div>
    </Link>
  )
}

export function Aside({ children, className }: Pick<ProjectCardDTO, 'children' | 'className'>) {
  return (
    <div className={twMerge('flex flex-col w-full h-full p-4 sm:py-4 sm:pr-4', className)}>
      {children}
    </div>
  )
}

export function Header({ children, className }: Pick<ProjectCardDTO, 'children' | 'className'>) {
  return (
    <div className={twMerge('flex flex-col items-start justify-between gap-1 sm:gap-4', className)}>
      {children}
    </div>
  )
}

export function Type({ type, className }: Pick<ProjectCardDTO, 'type' | 'className'>) {
  return (
    <span className={twMerge('text-primary font-medium text-sm sm:text-xl', className)}>{type}</span>
  )
}

export function Title({ title, className, link = '#', }: Pick<ProjectCardDTO, 'title' | 'className' | 'link'>) {
  return (
    <Link className="hover:underline underline-offset-2" href={link} target='_blank'>
      <h4 className={twMerge('text-xl sm:text-4xl font-bold', className)}>{title}</h4>
    </Link>
  )
}
export function Summary({ summary, className }: Pick<ProjectCardDTO, 'summary' | 'className'>) {
  return (
    <p className={twMerge("my-2 font-medium max-h-[9.5rem] 4xl:max-h-full 2xl:text-xl 4xl:text-2xl overflow-y-scroll", className)}>{summary}</p>
  )
}
export function Links({ github, className, link = '#', }: Pick<ProjectCardDTO, 'github' | 'className' | 'link'>) {
  return (
    <div className={twMerge("flex items-center gap-2 sm:gap-4", className)}>
      {github !== undefined &&
        <Link className="w-6 sm:w-10" href={github} target='_blank'>
          <GithubIcon />
        </Link>
      }
      <Link className="text-sm sm:text-base" href={link} target='_blank'>
        View Project
      </Link>
    </div>
  )
}

const ProjectCard = {
  Main,
  Tumble,
  Aside,
  Header,
  Type,
  Title,
  Summary,
  Links,
}
export default ProjectCard

