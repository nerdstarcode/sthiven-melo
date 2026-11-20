import { ExperienceItem } from '@/components/molecules/ExperienceItem'
import { experiences as defaultExperiences, type Experience } from '@/data/experiences'
import { useTranslation } from '@/i18n'

export interface ExperienceTimelineProps {
  experiences?: Experience[]
}

/** Seção "Experiências" (âncora `#experience`), alternando o lado da ilustração. */
export function ExperienceTimeline({ experiences = defaultExperiences }: ExperienceTimelineProps) {
  const t = useTranslation('about')

  return (
    <section id='experience' className='flex flex-col gap-16'>
      <h2 className='w-full text-center text-4xl font-bold sm:text-8xl'>{t.experienceTitle}</h2>
      <div className='relative mx-auto w-full'>
        <ul className='flex w-full flex-col items-center justify-center gap-4'>
          {experiences.map((experience, index) => (
            <ExperienceItem
              key={experience.id}
              experience={experience}
              imageSide={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ExperienceTimeline
