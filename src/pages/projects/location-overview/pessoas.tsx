import { PeopleManager } from '@/components/organisms/PeopleManager'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { useTranslation } from '@/i18n'

export default function PeoplePage() {
  const t = useTranslation('apps')
  return (
    <LocationOverviewLayout title={t.people.title}>
      <PeopleManager />
    </LocationOverviewLayout>
  )
}
