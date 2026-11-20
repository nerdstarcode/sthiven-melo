import { DEFAULT_AZURE_CONFIG } from './azure/azureConfigStorage'
import { squadDeliveryBySprint } from './squadDelivery'
import { demoSprints, demoSquads, demoWorkItems } from '@/features/seed/demoSeed'

const deliveries = squadDeliveryBySprint(
  [...demoSprints].reverse(),
  demoSquads,
  demoWorkItems,
  DEFAULT_AZURE_CONFIG.pointTypes,
)

describe('squadDeliveryBySprint', () => {
  it('ordena as sprints pela data de início', () => {
    expect(deliveries.map((d) => d.sprintId)).toEqual(['sp-10', 'sp-11', 'sp-12'])
  })

  it('na sprint fechada tudo o que foi planejado foi entregue', () => {
    const [sp10] = deliveries
    const web = sp10.squads.find((s) => s.squadId === 'sq-web')!
    expect(web).toMatchObject({ planned: 21, delivered: 21 })
    expect(sp10.planned).toBe(sp10.delivered)
  })

  it('na sprint em andamento a entrega é parcial e na futura é zero', () => {
    const [, sp11, sp12] = deliveries
    expect(sp11.delivered).toBeGreaterThan(0)
    expect(sp11.delivered).toBeLessThan(sp11.planned)
    expect(sp12.delivered).toBe(0)
    expect(sp12.squads.find((s) => s.squadId === 'sq-data')?.planned).toBe(0)
  })
})
