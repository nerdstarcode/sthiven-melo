import { matchingWorkItems } from './allocationGroups'
import { isPointItem } from './azure/sprintMetrics'
import { round1 } from './numbers'
import { formatSprintLabel, type Sprint } from './sprintsStorage'
import type { Squad } from './squadsStorage'
import { CLOSED_STATES, type WorkItemRow } from './workItems'

export interface SquadDelivery {
  squadId: string
  name: string
  /** SP dos itens da squad na sprint (todos os estados). */
  planned: number
  /** SP dos itens fechados. */
  delivered: number
}

export interface SprintDelivery {
  sprintId: string
  label: string
  squads: SquadDelivery[]
  planned: number
  delivered: number
}

/** SP planejados e entregues de cada squad em cada sprint, da sprint mais antiga para a mais nova. */
export function squadDeliveryBySprint(
  sprints: Sprint[],
  squads: Squad[],
  workItems: WorkItemRow[],
  pointTypes: string[],
): SprintDelivery[] {
  return [...sprints]
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map((sprint) => {
      const bySquad = squads.map((squad) => {
        const items = matchingWorkItems(workItems, squad, sprint).filter((item) =>
          isPointItem(item, pointTypes),
        )
        const sum = (list: WorkItemRow[]) => round1(list.reduce((s, i) => s + i.storyPoints, 0))
        return {
          squadId: squad.id,
          name: squad.name,
          planned: sum(items),
          delivered: sum(items.filter((i) => CLOSED_STATES.has(i.state))),
        }
      })
      return {
        sprintId: sprint.id,
        label: formatSprintLabel(sprint),
        squads: bySquad,
        planned: round1(bySquad.reduce((s, q) => s + q.planned, 0)),
        delivered: round1(bySquad.reduce((s, q) => s + q.delivered, 0)),
      }
    })
}
