import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { StatCard } from './StatCard'

const meta = {
  title: 'Molecules/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  args: { label: 'Capacity points', value: 42, hint: 'Sprint 11 - FY26-27' },
  parameters: {
    docs: {
      description: {
        component: `Indicador numérico com rótulo, dica e alerta opcional. Usado nos KPIs da squad, no dashboard e no resumo de cobertura de skills.

\`\`\`tsx
<StatCard label='Gaps' value={summary.gap} alert={summary.gap ? 'Skills sem ninguém alocado' : undefined} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const ComAlerta: Story = {
  args: { label: 'Gaps de skill', value: 2, hint: undefined, alert: 'Skills sem ninguém alocado' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('status')).toHaveTextContent(
      'Skills sem ninguém alocado',
    )
  },
}
