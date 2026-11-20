import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { DEFAULT_AZURE_CONFIG } from '@/features/location-overview/lib/azure/azureConfigStorage'
import { squadDeliveryBySprint } from '@/features/location-overview/lib/squadDelivery'
import { demoSprints, demoSquads, demoWorkItems } from '@/features/seed/demoSeed'
import { SquadsDeliveryChart } from './SquadsDeliveryChart'

const meta = {
  title: 'Organisms/SquadsDeliveryChart',
  component: SquadsDeliveryChart,
  tags: ['autodocs'],
  args: {
    deliveries: squadDeliveryBySprint(
      demoSprints,
      demoSquads,
      demoWorkItems,
      DEFAULT_AZURE_CONFIG.pointTypes,
    ),
  },
  parameters: {
    docs: {
      description: {
        component: `Visão por squad do Dashboard: SP entregues por squad em cada sprint (barras empilhadas), o total planejado (linha) e a tabela "entregue / planejado".

\`\`\`tsx
<SquadsDeliveryChart deliveries={squadDeliveryBySprint(sprints, squads, workItems, pointTypes)} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SquadsDeliveryChart>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('table', { name: 'Entregues / Planejado' }),
    ).toBeInTheDocument()
  },
}

export const SemSprints: Story = { args: { deliveries: [] } }
