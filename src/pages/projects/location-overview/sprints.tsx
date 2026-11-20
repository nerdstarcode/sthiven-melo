import { useRouter } from 'next/router'
import { SprintsExplorer } from '@/components/organisms/SprintsExplorer'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { selectionFromQuery, sprintsHref } from '@/features/location-overview/navigation'
import { useTranslation } from '@/i18n'

/** Sprint → Squads → Alocação. O nível aberto fica na URL (`?sprint=…&squad=…`). */
export default function SprintsPage() {
  const t = useTranslation('apps')
  const router = useRouter()
  const { sprintId, squadId } = selectionFromQuery(router.query)

  return (
    <LocationOverviewLayout title={t.sprints.title}>
      <SprintsExplorer
        sprintId={sprintId}
        squadId={squadId}
        onNavigate={(selection) => router.push(sprintsHref(selection), undefined, { scroll: false })}
      />
    </LocationOverviewLayout>
  )
}
