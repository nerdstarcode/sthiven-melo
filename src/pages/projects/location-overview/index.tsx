import type { GetStaticProps } from 'next'
import { locationOverviewRoutes } from '@/features/location-overview/navigation'

/** A entrada do app é o fluxo Sprint → Squads → Alocação. */
export const getStaticProps: GetStaticProps = async () => ({
  redirect: { destination: locationOverviewRoutes.sprints, permanent: false },
})

export default function LocationOverviewIndex() {
  return null
}
