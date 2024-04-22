import ProjectCard, { ProjectCardDTO } from "../";

export default function ProjectCardTemplate({ title, className, link = '#', src, type, summary, github }: ProjectCardDTO) {
    return (
        <ProjectCard.Main className="col-span-12 md:col-span-12 4xl:col-span-12 flex-col px-0 overflow-hidden gap-1 sm:flex-row">
            <ProjectCard.Tumble src={src} link={link} title={title} className="w-full sm:w-1/2 h-full" />
            <ProjectCard.Aside className="w-full sm:w-1/2 flex flex-col items-start justify-between px-2 sm:px-4 pb-2 sm:pb-4">
                <ProjectCard.Header>
                    <ProjectCard.Type type={type} />
                    <ProjectCard.Title link={link} title={title} className="" />
                </ProjectCard.Header>
                <ProjectCard.Summary summary={summary} />
                <ProjectCard.Links link={link} github={github} className="" />
            </ProjectCard.Aside>
        </ProjectCard.Main>
    )
}