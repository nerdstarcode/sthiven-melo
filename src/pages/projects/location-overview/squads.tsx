import { SquadsManager } from '@/components/organisms/SquadsManager'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { useTranslation } from '@/i18n'

export default function SquadsPage() {
  const t = useTranslation('apps')
  return (
    <LocationOverviewLayout title={t.squads.title}>
      <SquadsManager />
    </LocationOverviewLayout>
  )
}
