import { CargosManager } from '@/components/organisms/CargosManager'
import { LevelsManager } from '@/components/organisms/LevelsManager'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { useTranslation } from '@/i18n'

export default function LevelsPage() {
  const t = useTranslation('apps')
  return (
    <LocationOverviewLayout title={t.nav.levels}>
      <div className='flex flex-col gap-10'>
        <LevelsManager />
        <CargosManager />
      </div>
    </LocationOverviewLayout>
  )
}
