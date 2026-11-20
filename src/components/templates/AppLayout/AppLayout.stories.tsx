import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { Button } from '@/components/atoms/Button'
import {
  locationOverviewNav,
  locationOverviewRoutes,
} from '@/features/location-overview/navigation'
import { apps } from '@/i18n/apps'
import { AppLayout } from './AppLayout'

const meta = {
  title: 'Templates/AppLayout',
  component: AppLayout,
  tags: ['autodocs'],
  args: {
    appName: 'Location Overview',
    title: 'Pessoas',
    description: 'Cadastro de pessoas, com cargo, nível, squads e skills.',
    navItems: locationOverviewNav(apps.pt),
    actions: <Button size='sm'>Ação</Button>,
    children: <div className='rounded-md border border-line p-10 text-fg'>Conteúdo da tela</div>,
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: { router: { pathname: locationOverviewRoutes.people } },
    docs: {
      description: {
        component: `Casca dos apps internos de \`/projects\`: link de volta, sidebar de navegação (vira faixa horizontal rolável no mobile), cabeçalho com título e ações, e o conteúdo. Fica dentro do \`PageLayout\` do portfólio. O \`LocationOverviewLayout\` já o configura para o Location Overview.

\`\`\`tsx
<AppLayout appName='Location Overview' title={t.people.title} navItems={locationOverviewNav(t)}>…</AppLayout>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AppLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const menu = within(within(canvasElement).getByRole('navigation', { name: 'Menu do app' }))
    await expect(menu.getAllByRole('link')).toHaveLength(3)
  },
}

export const Mobile: Story = { globals: { viewport: { value: 'mobile1' } } }
