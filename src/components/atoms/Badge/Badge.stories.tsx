import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Badge } from './Badge'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'React', tone: 'hard' },
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'warning', 'danger', 'hard', 'soft'],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Etiqueta curta. Os tons \`hard\` e \`soft\` diferenciam os tipos de skill. \`success\`, \`warning\` e \`danger\` indicam a cobertura (coberta, parcial e gap). Com \`onRemove\`, mostra um "×".

\`\`\`tsx
<Badge tone='soft'>Comunicação</Badge>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Hard: Story = {}

export const Soft: Story = { args: { children: 'Comunicação', tone: 'soft' } }

export const Removivel: Story = {
  args: { tone: 'neutral', children: 'Frontend Web', onRemove: fn() },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Remover Frontend Web' }),
    )
    await expect(args.onRemove).toHaveBeenCalledTimes(1)
  },
}

export const Status: Story = {
  render: () => (
    <div className='flex gap-2'>
      <Badge tone='success'>Coberta</Badge>
      <Badge tone='warning'>Parcial</Badge>
      <Badge tone='danger'>Gap</Badge>
    </div>
  ),
}
