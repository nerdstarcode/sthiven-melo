import { ArrowRight, CalendarRange, Dices, LayoutDashboard, Sparkles, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/atoms/Badge'
import { LOCATION_OVERVIEW_NAME } from '@/features/location-overview/constants'
import { locationOverviewRoutes } from '@/features/location-overview/navigation'
import { format, useTranslation } from '@/i18n'
import type { AppsTranslation } from '@/i18n/apps'

export interface ShowcaseApp {
  id: string
  name: string
  description: (t: AppsTranslation['showcase']) => string
  icon: LucideIcon
  hard: string[]
  soft: string[]
  /** Sem `href` o app aparece como "em breve". */
  href?: string
  fictional?: boolean
  /** Atalhos para os níveis do fluxo principal. */
  flow?: (t: AppsTranslation) => { label: string; href: string }[]
}

export const SHOWCASE_APPS: ShowcaseApp[] = [
  {
    id: 'location-overview',
    name: LOCATION_OVERVIEW_NAME,
    description: (t) => t.locationDescription,
    icon: CalendarRange,
    href: locationOverviewRoutes.sprints,
    hard: ['React', 'TypeScript', 'Next.js', 'TanStack Table', 'Azure DevOps API'],
    soft: ['Organização', 'Comunicação', 'Visão de produto'],
    flow: (t) => [
      { label: t.nav.sprints, href: locationOverviewRoutes.sprints },
      { label: t.nav.squads, href: locationOverviewRoutes.squads },
      { label: t.nav.allocations, href: locationOverviewRoutes.allocations },
      { label: t.nav.people, href: locationOverviewRoutes.people },
      { label: t.nav.skills, href: locationOverviewRoutes.skills },
    ],
  },
  {
    id: 'skills-template',
    name: 'Skills Template',
    description: (t) => t.skillsDescription,
    icon: Sparkles,
    hard: ['React', 'TypeScript', 'Tailwind'],
    soft: ['Autoconhecimento', 'Comunicação'],
  },
  {
    id: 'rpg-sheets',
    name: 'Fichas de RPG',
    description: (t) => t.rpgDescription,
    icon: Dices,
    fictional: true,
    hard: ['Next.js', 'PostgreSQL'],
    soft: ['Criatividade'],
  },
]

/** Vitrine dos apps de /projects: cada card mostra hard/soft skills e leva ao app (ou ao fluxo). */
export function AppsShowcase({ apps = SHOWCASE_APPS }: { apps?: ShowcaseApp[] }) {
  const t = useTranslation('apps')

  return (
    <section aria-labelledby='apps-showcase-title' className='flex w-full flex-col gap-6'>
      <div>
        <h2 id='apps-showcase-title' className='flex items-center gap-2 text-2xl font-bold text-fg-strong'>
          <LayoutDashboard size={22} aria-hidden /> {t.showcase.title}
        </h2>
        <p className='mt-1 text-sm text-fg'>{t.showcase.description}</p>
      </div>

      <ul className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        {apps.map((app) => {
          const Icon = app.icon
          const flow = app.flow?.(t) ?? []
          return (
            <li
              key={app.id}
              aria-label={app.name}
              className='flex flex-col gap-4 rounded-2xl border border-line bg-surface-elevated p-5'
            >
              <div className='flex items-start justify-between gap-2'>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-fg-strong'>
                  <Icon size={18} className='text-accent' aria-hidden /> {app.name}
                </h3>
                {!app.href && (
                  <Badge>{app.fictional ? t.showcase.fictional : t.showcase.soon}</Badge>
                )}
              </div>
              <p className='text-sm text-fg'>{app.description(t.showcase)}</p>

              <div className='flex flex-col gap-2'>
                <div className='flex flex-wrap gap-1' aria-label={t.showcase.hard}>
                  {app.hard.map((skill) => (
                    <Badge key={skill} tone='hard'>
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className='flex flex-wrap gap-1' aria-label={t.showcase.soft}>
                  {app.soft.map((skill) => (
                    <Badge key={skill} tone='soft'>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {flow.length > 0 && (
                <nav aria-label={`${t.showcase.flow} ${app.name}`}>
                  <ol className='flex flex-wrap items-center gap-1 text-xs'>
                    {flow.map((step, index) => (
                      <li key={step.href} className='flex items-center gap-1'>
                        {index > 0 && <span aria-hidden className='text-fg/60'>›</span>}
                        <Link href={step.href} className='text-fg hover:text-accent'>
                          {step.label}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {app.href && (
                <Link
                  href={app.href}
                  className='mt-auto inline-flex items-center gap-1 self-start rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent-strong'
                >
                  {format(t.showcase.open, { app: app.name })} <ArrowRight size={14} aria-hidden />
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default AppsShowcase
