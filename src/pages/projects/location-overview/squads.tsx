import { SquadsManager } from '@/components/organisms/SquadsManager'
import { useRouter } from 'next/router'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { useTranslation } from '@/i18n'

export default function SquadsPage() {
  const t = useTranslation('apps')
  const { query } = useRouter()
  return (
    <LocationOverviewLayout title={t.squads.title}>
      <SquadsManager startCreating={query.novo === '1'} />
    </LocationOverviewLayout>
  )
}
