import Head from 'next/head'
import { Container } from '@/components/atoms/Container'
import { GlowingCube } from '@/components/atoms/GlowingCube'
import { ShowcaseSection } from '@/components/molecules/ShowcaseSection'
import { ThreeScene } from '@/components/organisms/ThreeScene'
import { useTranslation } from '@/i18n'

export default function Examples() {
  const t = useTranslation('examples')

  return (
    <>
      <Head>
        <title>{t.metaTitle}</title>
      </Head>
      <div className='flex min-h-screen w-full items-center justify-center text-dark dark:text-zinc-400'>
        <Container className='flex max-w-7xl flex-col gap-32 pt-0'>
          <ShowcaseSection
            id='three_cube'
            title={t.cubeTitle}
            description={t.cubeDescription}
            accentClassName='group-hover:text-blue-500'
          >
            <ThreeScene />
          </ShowcaseSection>
          <ShowcaseSection
            id='glowing_cube'
            title={t.glowingTitle}
            description={t.glowingDescription}
            accentClassName='group-hover:text-fuchsia-500'
            demoSide='left'
          >
            <GlowingCube />
          </ShowcaseSection>
        </Container>
      </div>
    </>
  )
}
