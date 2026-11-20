import { Sparkles } from 'lucide-react'
import Head from 'next/head'
import type { ReactNode } from 'react'
import { DataBackup } from '@/components/molecules/DataBackup'
import { ResetDemoButton } from '@/components/molecules/ResetDemoButton'
import { AppLayout } from '@/components/templates/AppLayout'
import { useTranslation } from '@/i18n'

export const SKILLS_TEMPLATE_NAME = 'Skills Template'
export const SKILLS_TEMPLATE_ROUTE = '/projects/skills-template'

/** URL do Skills Template com o perfil aberto (`?perfil=`). */
export function skillsTemplateHref(personId?: string): string {
  return personId
    ? `${SKILLS_TEMPLATE_ROUTE}?perfil=${encodeURIComponent(personId)}`
    : SKILLS_TEMPLATE_ROUTE
}

/** `AppLayout` do Skills Template, com backup e "Restaurar demonstração". */
export function SkillsTemplateLayout({ children }: { children: ReactNode }) {
  const t = useTranslation('apps')
  return (
    <>
      <Head>
        <title>{SKILLS_TEMPLATE_NAME}</title>
      </Head>
      <AppLayout
        appName={SKILLS_TEMPLATE_NAME}
        title={t.skillsTemplate.title}
        description={t.skillsTemplate.description}
        navItems={[{ href: SKILLS_TEMPLATE_ROUTE, label: t.skillsTemplate.nav, icon: Sparkles }]}
        actions={
          <>
            <DataBackup />
            <ResetDemoButton />
          </>
        }
      >
        {children}
      </AppLayout>
    </>
  )
}
