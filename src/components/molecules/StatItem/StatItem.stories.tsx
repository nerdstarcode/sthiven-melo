import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { StatItem } from './StatItem'

const meta = {
  title: 'Molecules/StatItem',
  component: StatItem,
  tags: ['autodocs'],
  args: { value: 50, label: 'Repositórios' },
  parameters: {
    docs: {
      description: {
        component: `Número animado (\`AnimatedNumber\`) com sufixo e legenda. Usado nos números de destaque do \`AboutSummary\` na página \`about\`.

\`\`\`tsx
<StatItem value={50} label={t.repos} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof StatItem>

export default meta
type Story = StoryObj<typeof meta>

export const Repositorios: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Repositórios' })).toBeInTheDocument()
    await expect(canvas.getByText('+')).toBeInTheDocument()
  },
}

export const LegendaPequena: Story = {
  args: { value: 3, label: 'Anos de experiência', labelClassName: 'text-sm' },
}

export const SemSufixo: Story = { args: { value: 30, label: 'Cursos', suffix: '' } }
