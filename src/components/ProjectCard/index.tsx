import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { GithubIcon } from "../Icons";

export interface ProjectCardDTO {
  title: string;
  className?: string;
  link: string;
  github: string;
  src: any;
  children?: any;
  type: string;
  summary: string;
}

export function Main({ children, className }: Pick<ProjectCardDTO, 'children' | 'className'>) {
  return (
    <article className={
      twMerge(`
        col-span-12 md:col-span-6 4xl:col-span-3 
        w-full 
        flex
        gap-6
        items-center
        justify-between
        rounded-3xl
        border-solid
        border
        border-gray-800
        shadow-2xl
      `, className)}>
      {children}
    </article>
  )
}

export function Tumble({ title, className, link = '#', src }: Pick<ProjectCardDTO, 'title' | 'className' | 'link' | 'src'>) {
  return (
    <Link href={link} className={twMerge('cursor-pointer overflow-hidden rounded-s-lg' , className)} target='_blank'>
      <Image src={src} alt={title} className='w-full h-auto' />
    </Link>
  )
}

export function Aside({ children, className }: Pick<ProjectCardDTO, 'children' | 'className'>) {
  return (
    <div className={twMerge('flex flex-col w-full h-full py-2 pr-2 ', className)}>
      {children}
    </div>
  )
}

export function Header({ children, className }: Pick<ProjectCardDTO, 'children' | 'className'>) {
  return (
    <div className={twMerge('flex flex-col items-start justify-between gap-4', className)}>
      {children}
    </div>
  )
}

export function Type({ type, className }: Pick<ProjectCardDTO, 'type' | 'className'>) {
  return (
    <span className={twMerge('text-primary font-medium text-xl', className)}>{type}</span>
  )
}

export function Title({ title, className, link = '#', }: Pick<ProjectCardDTO, 'title' | 'className' | 'link'>) {
  return (
    <Link className="hover:underline underline-offset-2" href={link} target='_blank'>
      <h4 className={twMerge('text-4xl font-bold', className)}>{title}</h4>
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
    <div className={twMerge("flex items-center gap-4", className)}>
      <Link className="w-10" href={github} target='_blank'>
        <GithubIcon />
      </Link>
      <Link href={link} target='_blank'>
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

