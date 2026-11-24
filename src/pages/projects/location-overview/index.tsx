import type { GetServerSideProps } from 'next'
import { locationOverviewRoutes } from '@/features/location-overview/navigation'

/** A entrada do app é o fluxo Sprint → Squads → Alocação. */
export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: { destination: locationOverviewRoutes.sprints, permanent: false },
})

export default function LocationOverviewIndex() {
  return null
}
