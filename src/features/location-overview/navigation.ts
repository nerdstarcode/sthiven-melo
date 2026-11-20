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
    { href: locationOverviewRoutes.allocations, label: t.nav.allocations, icon: LayoutDashboard },
    { href: locationOverviewRoutes.squads, label: t.nav.squads, icon: Layers },
    { href: locationOverviewRoutes.sprints, label: t.nav.sprints, icon: CalendarRange },
    { href: locationOverviewRoutes.people, label: t.nav.people, icon: Users },
    { href: locationOverviewRoutes.skills, label: t.nav.skills, icon: Sparkles },
    { href: locationOverviewRoutes.levels, label: t.nav.levels, icon: SlidersHorizontal },
  ]
}
