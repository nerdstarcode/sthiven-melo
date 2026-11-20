import { useRouter } from 'next/router'
import { LocationDashboard } from '@/components/organisms/LocationDashboard'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { dashboardHref } from '@/features/location-overview/navigation'
import { useTranslation } from '@/i18n'

const first = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) || undefined

/** Dashboard: visão por squad ou por pessoa. A seleção fica na URL. */
export default function DashboardPage() {
  const t = useTranslation('apps')
  const router = useRouter()

  return (
    <LocationOverviewLayout title={t.dashboard.title} description={t.dashboard.description}>
      <LocationDashboard
        view={first(router.query.visao) === 'pessoas' ? 'people' : 'squads'}
        personId={first(router.query.pessoa)}
        squadId={first(router.query.squad)}
        onNavigate={(selection) =>
          router.push(dashboardHref(selection), undefined, { shallow: true, scroll: false })
        }
      />
    </LocationOverviewLayout>
  )
}
