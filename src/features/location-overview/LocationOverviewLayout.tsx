import Head from 'next/head'
import type { ReactNode } from 'react'
import { ResetDemoButton } from '@/components/molecules/ResetDemoButton'
import { AppLayout } from '@/components/templates/AppLayout'
import { useTranslation } from '@/i18n'
import { locationOverviewNav } from './navigation'

export const LOCATION_OVERVIEW_NAME = 'Location Overview'

export interface LocationOverviewLayoutProps {
  title: string
  description?: string
  /** Ações extras ao lado do "Restaurar demonstração". */
  actions?: ReactNode
  children: ReactNode
}

/** `AppLayout` já configurado com a navegação e as ações do Location Overview. */
export function LocationOverviewLayout({
  title,
  description,
  actions,
  children,
}: LocationOverviewLayoutProps) {
  const t = useTranslation('apps')

  return (
    <>
      <Head>
        <title>{`${title} · ${LOCATION_OVERVIEW_NAME}`}</title>
      </Head>
      <AppLayout
        appName={LOCATION_OVERVIEW_NAME}
        title={title}
        description={description}
        navItems={locationOverviewNav(t)}
        actions={
          <>
            {actions}
            <ResetDemoButton />
          </>
        }
      >
        {children}
      </AppLayout>
    </>
  )
}
