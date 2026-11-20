import type { GetStaticProps } from 'next'
import { locationOverviewRoutes } from '@/features/location-overview/navigation'

/** A entrada do app é a tela de alocações. */
export const getStaticProps: GetStaticProps = async () => ({
  redirect: { destination: locationOverviewRoutes.allocations, permanent: false },
})

export default function LocationOverviewIndex() {
  return null
}
