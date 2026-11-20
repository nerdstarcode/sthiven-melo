import Image, { type StaticImageData } from 'next/image'
import { twMerge } from 'tailwind-merge'
import { ToolExperienceCard } from '@/components/molecules/ToolExperienceCard'
import type { ToolExperience } from '@/data/tools'
import { useTranslation } from '@/i18n'

export interface ToolExperienceSectionProps {
  illustration: StaticImageData
  illustrationAlt: string
  tools: ToolExperience[]
  /** Lado da ilustração no desktop; ela entra deslizando para esse lado. */
  illustrationSide: 'left' | 'right'
  /** Classes extras para a ilustração (ex.: animação contínua). */
  illustrationClassName?: string
  toolImageClassName?: string
}

const SIDE_STYLES = {
  left: { slide: 'animate-slide-left', aside: 'md:pl-[40vw]' },
  right: { slide: 'animate-slide-right', aside: 'md:pr-[40vw]' },
}

/** Seção da home para "UI/UX" e "Front": ilustração que desliza + grade de ferramentas. */
export function ToolExperienceSection({
  illustration,
  illustrationAlt,
  tools,
  illustrationSide,
  illustrationClassName,
  toolImageClassName,
}: ToolExperienceSectionProps) {
  const t = useTranslation('home')
  const styles = SIDE_STYLES[illustrationSide]

  return (
    <section className='relative flex min-h-screen w-full flex-col items-center justify-center'>
      <div className={twMerge('absolute', styles.slide)}>
        <div className='hidden animate-jump-in animate-ease-in md:block'>
          <Image
            className={illustrationClassName}
            alt={illustrationAlt}
            src={illustration}
            priority
          />
        </div>
      </div>
      <aside
        className={twMerge(
          'flex h-full min-h-[50vh] w-full animate-fade-right flex-col items-center justify-between gap-8 p-12 animate-delay-1000',
          styles.aside,
        )}
      >
        <h3 className='text-4xl'>{t.experience}</h3>
        <div className='grid animate-jump-in grid-cols-1 place-items-center gap-12 animate-delay-1000 md:grid-cols-3'>
          {tools.map((tool) => (
            <ToolExperienceCard key={tool.name} tool={tool} imageClassName={toolImageClassName} />
          ))}
        </div>
      </aside>
    </section>
  )
}

export default ToolExperienceSection
