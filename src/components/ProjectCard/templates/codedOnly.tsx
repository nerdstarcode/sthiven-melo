import ProjectCard, { ProjectCardDTO } from "../";

export default function ProjectCodedOnly({ title, className, src, type, github }: Omit<ProjectCardDTO, 'summary' | 'link'>) {
    return (
        <ProjectCard.Main className="col-span-12 md:col-span-6 4xl:col-span-4 flex-col px-0 overflow-hidden gap-1">
            <ProjectCard.Tumble src={src} link={github??''} title={title} className="w-full h-[65%]" />
            <ProjectCard.Aside className="w-full min-h-fit h-[35%] flex flex-col items-start justify-between px-2 pb-2 sm:px-8 sm:pb-8">
                <ProjectCard.Header >
                    <ProjectCard.Type type={type} />
                    <ProjectCard.Title link={github??''} title={title} className="" />
                </ProjectCard.Header>
                {/* <ProjectCard.Summary summary={summary} /> */}
                <ProjectCard.Links link={github??''} github={github} className="w-full justify-between flex-row-reverse" />
            </ProjectCard.Aside>
        </ProjectCard.Main>
    )
}