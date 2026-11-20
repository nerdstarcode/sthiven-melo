import Head from 'next/head'
import { AnimatedText } from '@/components/atoms/AnimatedText'
import { Container } from '@/components/atoms/Container'
import { ProjectsGrid } from '@/components/organisms/ProjectsGrid'
import { useTranslation } from '@/i18n'

export default function Projects() {
  const t = useTranslation('projects')

  return (
    <>
      <Head>
        <title>{t.metaTitle}</title>
        <meta name='description' content={t.metaDescription} />
      </Head>
      <div className='flex h-fit min-h-screen w-full flex-col items-center justify-center'>
        <Container className='gap-16 pt-16'>
          <AnimatedText text={t.heading} />
          <ProjectsGrid />
        </Container>
      </div>
    </>
  )
}
