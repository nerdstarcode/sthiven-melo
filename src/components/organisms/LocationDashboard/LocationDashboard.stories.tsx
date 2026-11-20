import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, within } from 'storybook/test'
import { DEMO_TODAY } from '@/features/seed/demoPlanning'
import { resetDemoData } from '@/features/seed/demoSeed'
import { LocationDashboard } from './LocationDashboard'

const meta = {
  title: 'Organisms/LocationDashboard',
  component: LocationDashboard,
  tags: ['autodocs'],
  args: { view: 'squads', onNavigate: fn(), today: DEMO_TODAY },
  beforeEach: () => resetDemoData(),
  parameters: {
    docs: {
      description: {
        component: `Dashboard do Location Overview com os dados da base local: a visão de squads (SP entregues por sprint) e a de pessoas (resumo e métricas de cada uma, com apoio). A visão, a pessoa e o filtro de squad vêm por props; a página os grava na URL.

\`\`\`tsx
<LocationDashboard view='people' personId='demo-ana' onNavigate={(s) => router.push(dashboardHref(s))} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof LocationDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Squads: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole('region', { name: 'Story points por sprint' }),
    ).toBeInTheDocument()
  },
}

export const Pessoas: Story = { args: { view: 'people' } }

export const UmaPessoa: Story = {
  args: { view: 'people', personId: 'demo-ana' },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole('heading', { name: 'Ana (exemplo)' }),
    ).toBeInTheDocument()
  },
}
