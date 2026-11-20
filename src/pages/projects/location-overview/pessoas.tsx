import { PeopleManager } from '@/components/organisms/PeopleManager'
import { useRouter } from 'next/router'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { useTranslation } from '@/i18n'

export default function PeoplePage() {
  const t = useTranslation('apps')
  const { query } = useRouter()
  return (
    <LocationOverviewLayout title={t.people.title}>
      <PeopleManager startCreating={query.novo === '1'} />
    </LocationOverviewLayout>
  )
}
