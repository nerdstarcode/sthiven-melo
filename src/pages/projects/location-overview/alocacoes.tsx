import { useRouter } from 'next/router'
import { AllocationsOverview } from '@/components/organisms/AllocationsOverview'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { sprintsHref } from '@/features/location-overview/navigation'
import { useTranslation } from '@/i18n'

export default function AllocationsPage() {
  const t = useTranslation('apps')
  const router = useRouter()
  return (
    <LocationOverviewLayout title={t.allocations.title}>
      <AllocationsOverview
        onOpenGroup={(squadId, sprintId) => router.push(sprintsHref({ sprintId, squadId }))}
      />
    </LocationOverviewLayout>
  )
}
