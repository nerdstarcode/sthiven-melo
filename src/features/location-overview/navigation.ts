import {
  CalendarRange,
  Layers,
  LayoutDashboard,
  Sparkles,
  SlidersHorizontal,
  Users,
} from 'lucide-react'
import type { AppNavItem } from '@/components/templates/AppLayout'
import type { AppsTranslation } from '@/i18n/apps'

export const LOCATION_OVERVIEW_BASE = '/projects/location-overview'

export const locationOverviewRoutes = {
  home: LOCATION_OVERVIEW_BASE,
  allocations: `${LOCATION_OVERVIEW_BASE}/alocacoes`,
  squads: `${LOCATION_OVERVIEW_BASE}/squads`,
  sprints: `${LOCATION_OVERVIEW_BASE}/sprints`,
  people: `${LOCATION_OVERVIEW_BASE}/pessoas`,
  skills: `${LOCATION_OVERVIEW_BASE}/skills`,
  levels: `${LOCATION_OVERVIEW_BASE}/niveis`,
}

/** Itens da sidebar do Location Overview, na ordem exibida. */
export function locationOverviewNav(t: AppsTranslation): AppNavItem[] {
  return [
    { href: locationOverviewRoutes.sprints, label: t.nav.sprints, icon: CalendarRange },
    { href: locationOverviewRoutes.allocations, label: t.nav.allocations, icon: LayoutDashboard },
    { href: locationOverviewRoutes.squads, label: t.nav.squads, icon: Layers },
    { href: locationOverviewRoutes.people, label: t.nav.people, icon: Users },
    { href: locationOverviewRoutes.skills, label: t.nav.skills, icon: Sparkles },
    { href: locationOverviewRoutes.levels, label: t.nav.levels, icon: SlidersHorizontal },
  ]
}

/** Nível aberto no fluxo de sprints, mais os atalhos para cadastrar pessoa/squad. */
export interface SprintsSelection {
  sprintId?: string
  squadId?: string
  createPerson?: boolean
  createSquad?: boolean
}

/** URL de um nível do fluxo: `?sprint=` abre a sprint e `&squad=` a squad dentro dela. */
export function sprintsHref({ sprintId, squadId, createPerson, createSquad }: SprintsSelection): string {
  if (createPerson) return `${locationOverviewRoutes.people}?novo=1`
  if (createSquad) return `${locationOverviewRoutes.squads}?novo=1`
  const params = new URLSearchParams()
  if (sprintId) params.set('sprint', sprintId)
  if (sprintId && squadId) params.set('squad', squadId)
  const query = params.toString()
  return query ? `${locationOverviewRoutes.sprints}?${query}` : locationOverviewRoutes.sprints
}

/** Lê a seleção a partir da query da URL (`router.query`). */
export function selectionFromQuery(query: Record<string, string | string[] | undefined>): {
  sprintId?: string
  squadId?: string
} {
  const first = (value: string | string[] | undefined) =>
    (Array.isArray(value) ? value[0] : value) || undefined
  return { sprintId: first(query.sprint), squadId: first(query.squad) }
}
