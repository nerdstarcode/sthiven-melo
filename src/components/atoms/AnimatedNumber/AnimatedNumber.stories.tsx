import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, waitFor, within } from 'storybook/test'
import { AnimatedNumber } from './AnimatedNumber'

const meta = {
  title: 'Atoms/AnimatedNumber',
  component: AnimatedNumber,
  tags: ['autodocs', 'browser-only'],
  args: { value: 50, className: 'text-7xl font-bold text-zinc-200' },
  parameters: {
    docs: {
      description: {
        component: `Contador que anima de 0 até \`value\` quando entra na viewport (apenas na primeira vez). Usado dentro de \`StatItem\` nos números da página \`about\`.

\`\`\`tsx
<AnimatedNumber value={50} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AnimatedNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Cinquenta: Story = {
  play: async ({ canvasElement, args }) => {
    const counter = within(canvasElement).getByLabelText(String(args.value))
    await waitFor(() => expect(counter).toHaveTextContent(String(args.value)), { timeout: 5000 })
  },
}

export const Pequeno: Story = { args: { value: 3 } }
