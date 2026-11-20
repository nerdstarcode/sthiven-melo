import { ProfileImage } from '@/components/atoms/ProfileImage'
import { StatItem } from '@/components/molecules/StatItem'
import { useTranslation } from '@/i18n'

const REPOSITORIES = 50
const COMPLETED_COURSES = 30
const YEARS_OF_EXPERIENCE = 3

/** Topo da página "Sobre": biografia, foto e números de destaque. */
export function AboutSummary() {
  const t = useTranslation('about')

  return (
    <section className='grid w-full grid-cols-3 gap-16 md:max-h-screen md:grid-cols-8'>
      <article className='col-span-3 flex flex-col items-start justify-start'>
        <h2 className='mb-4 text-lg font-bold text-dark/75 uppercase'>{t.biography}</h2>
        <p className='text-justify font-medium md:hidden'>{t.aboutShort}</p>
        <div className='hidden md:block'>
          {t.about.split('\n').map((paragraph, index) => (
            <p key={index} className='text-justify font-medium [&:not(:last-child)]:mb-4'>
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <aside className='relative col-span-3 hidden h-full rounded-2xl border-2 border-solid border-dark bg-zinc-900 p-8 md:block'>
        <ProfileImage alt={t.profileAlt} />
        <div className='absolute top-0 -right-3 -z-10 h-[103%] w-[102%] rounded-3xl bg-dark' />
      </aside>

      <div className='col-span-3 grid grid-cols-2 place-items-center items-end justify-between gap-8 md:col-span-2 md:flex md:flex-col'>
        <StatItem value={REPOSITORIES} label={t.repos} />
        <StatItem value={COMPLETED_COURSES} label={t.curses} />
        <StatItem value={YEARS_OF_EXPERIENCE} label={t.yearExperience} labelClassName='text-sm' />
      </div>
    </section>
  )
}

export default AboutSummary
