import { SkillsCatalog } from '@/components/organisms/SkillsCatalog'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { useTranslation } from '@/i18n'

export default function SkillsPage() {
  const t = useTranslation('apps')
  return (
    <LocationOverviewLayout title={t.skills.title}>
      <SkillsCatalog />
    </LocationOverviewLayout>
  )
}
