import { SprintsManager } from '@/components/organisms/SprintsManager'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { useTranslation } from '@/i18n'

export default function SprintsPage() {
  const t = useTranslation('apps')
  return (
    <LocationOverviewLayout title={t.sprints.title}>
      <SprintsManager />
    </LocationOverviewLayout>
  )
}
