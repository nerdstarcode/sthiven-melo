import Image from 'next/image'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import type { Experience } from '@/data/experiences'
import { useLocalize, useTranslation } from '@/i18n'

export interface ExperienceItemProps {
  experience: Experience
  /** Lado da ilustração (desktop). */
  imageSide?: 'left' | 'right'
}

/** Item da linha do tempo de experiências (antigo `Details.*`). */
export function ExperienceItem({ experience, imageSide = 'left' }: ExperienceItemProps) {
  const t = useTranslation('experience')
  const localize = useLocalize()
  const { position, company, companyLink, start, end, address, summary, description, image } =
    experience

  const period = start ? `${start} - ${end ?? t.present}` : undefined
  const location = [period, localize(address)].filter(Boolean).join(' | ')

  return (
    <li className={twMerge('flex items-center gap-8', imageSide === 'right' && 'flex-row-reverse')}>
      <aside className='opacity-70'>
        <Image className='w-full' src={image.src} alt={localize(image.alt)} />
      </aside>
      <article className='w-11/12'>
        <h3 className='capitalize'>
          {localize(position)}&nbsp;{' '}
          {company && companyLink && (
            <Link
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary capitalize'
              href={companyLink}
            >
              {company}
            </Link>
          )}
        </h3>
        <div className='capitalize opacity-75'>{location}</div>
        <p className='w-full font-medium md:hidden'>{localize(summary)}</p>
        <p className='hidden w-full font-medium md:block'>{localize(description)}</p>
      </article>
    </li>
  )
}

export default ExperienceItem
