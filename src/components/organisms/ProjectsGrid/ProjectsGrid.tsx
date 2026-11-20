import { ProjectCard } from '@/components/molecules/ProjectCard'
import { projects as defaultProjects, type Project } from '@/data/projects'

export interface ProjectsGridProps {
  projects?: Project[]
}

/** Grade de 12 colunas com os cards de projeto. */
export function ProjectsGrid({ projects = defaultProjects }: ProjectsGridProps) {
  return (
    <section className='grid grid-cols-12 gap-4 sm:gap-8'>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  )
}

export default ProjectsGrid
