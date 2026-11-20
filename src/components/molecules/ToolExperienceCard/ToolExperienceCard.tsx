import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import type { ToolExperience } from '@/data/tools'
import { useTranslation } from '@/i18n'

export interface ToolExperienceCardProps {
  tool: ToolExperience
  imageClassName?: string
}

/** Logo da ferramenta + tempo de uso + nível de domínio. */
export function ToolExperienceCard({ tool, imageClassName }: ToolExperienceCardProps) {
  const t = useTranslation('tools')

  return (
    <div className='flex w-full items-center gap-4'>
      <Image
        className={twMerge('w-20', imageClassName)}
        alt={tool.name}
        src={tool.image}
        priority
      />
      <div className='flex flex-col gap-2'>
        <h4 className='text-2xl'>
          {tool.years} {t.years}
        </h4>
        <h5 className='text-xs'>
          {t.expertise}: {t.levels[tool.level]}
        </h5>
      </div>
    </div>
  )
}

export default ToolExperienceCard
