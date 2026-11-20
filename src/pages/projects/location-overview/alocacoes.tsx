import { AllocationsOverview } from '@/components/organisms/AllocationsOverview'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { useTranslation } from '@/i18n'

export default function AllocationsPage() {
  const t = useTranslation('apps')
  return (
    <LocationOverviewLayout title={t.allocations.title}>
      <AllocationsOverview />
    </LocationOverviewLayout>
  )
}
