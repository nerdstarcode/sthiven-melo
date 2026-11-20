import Head from 'next/head'
import { AnimatedText } from '@/components/atoms/AnimatedText'
import { Container } from '@/components/atoms/Container'
import { AboutSummary } from '@/components/organisms/AboutSummary'
import { ExperienceTimeline } from '@/components/organisms/ExperienceTimeline'
import { SkillsCloud } from '@/components/organisms/SkillsCloud'
import { useTranslation } from '@/i18n'

export default function About() {
  const t = useTranslation('about')

  return (
    <>
      <Head>
        <title>{t.metaTitle}</title>
        <meta name='description' content={t.metaDescription} />
      </Head>
      <div className='flex h-fit w-full flex-col items-center justify-center'>
        <Container className='gap-16 pt-16'>
          <AnimatedText text={t.main} />
          <AboutSummary />
          <SkillsCloud />
          <ExperienceTimeline />
        </Container>
      </div>
    </>
  )
}
