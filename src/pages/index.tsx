import Head from 'next/head'
import { Hero } from '@/components/organisms/Hero'
import { useTranslation } from '@/i18n'

export default function Home() {
  const t = useTranslation('home')

  return (
    <>
      <Head>
        <title>{t.metaTitle}</title>
        <meta name='description' content={t.metaDescription} />
      </Head>
      <Hero />
    </>
  )
}
