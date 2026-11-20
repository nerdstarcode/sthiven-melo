import Head from 'next/head'
import type { ReactNode } from 'react'
import { BackendStackSection } from '@/components/organisms/BackendStackSection'
import { Hero } from '@/components/organisms/Hero'
import { ToolExperienceSection } from '@/components/organisms/ToolExperienceSection'
import type { WorkArea } from '@/constants/work'
import { useDataContext } from '@/contexts/WorkContext'
import { designTools, frontendTools } from '@/data/tools'
import { useTranslation } from '@/i18n'
import designIllustration from '@p/design.svg'
import frontendIllustration from '@p/frontend.svg'

/** Seção exibida quando uma área é escolhida nas abas da Logo. */
const WORK_AREA_SECTIONS: Record<WorkArea, () => ReactNode> = {
  'UI/UX': () => (
    <ToolExperienceSection
      illustration={designIllustration}
      illustrationAlt='UI/UX'
      illustrationSide='left'
      illustrationClassName='animate-wiggle animate-infinite'
      tools={designTools}
      toolImageClassName='rounded-full'
    />
  ),
  Front: () => (
    <ToolExperienceSection
      illustration={frontendIllustration}
      illustrationAlt='Frontend'
      illustrationSide='right'
      tools={frontendTools}
    />
  ),
  Backend: () => <BackendStackSection />,
}

export default function Home() {
  const t = useTranslation('home')
  const { Work: work } = useDataContext().dataContext
  const renderSection = work ? WORK_AREA_SECTIONS[work] : undefined

  return (
    <>
      <Head>
        <title>{t.metaTitle}</title>
        <meta name='description' content={t.metaDescription} />
      </Head>
      {renderSection ? <div key={work}>{renderSection()}</div> : <Hero />}
    </>
  )
}
