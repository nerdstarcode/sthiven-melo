import { useRouter } from 'next/router'
import { SprintAnalysis } from '@/components/organisms/SprintAnalysis'
import { LocationOverviewLayout } from '@/features/location-overview/LocationOverviewLayout'
import { analysisHref, selectionFromQuery } from '@/features/location-overview/navigation'
import { useTranslation } from '@/i18n'

/** Análise de uma squad na sprint. A seleção fica na URL (`?sprint=…&squad=…`). */
export default function AnalysisPage() {
  const t = useTranslation('apps')
  const router = useRouter()
  const { sprintId, squadId } = selectionFromQuery(router.query)

  return (
    <LocationOverviewLayout title={t.analysis.title} description={t.analysis.description}>
      <SprintAnalysis
        sprintId={sprintId}
        squadId={squadId}
        onSelect={(selection) =>
          router.push(analysisHref(selection), undefined, { shallow: true, scroll: false })
        }
      />
    </LocationOverviewLayout>
  )
}
