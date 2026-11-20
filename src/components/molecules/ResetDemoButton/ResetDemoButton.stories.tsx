import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ResetDemoButton } from './ResetDemoButton'

const meta = {
  title: 'Molecules/ResetDemoButton',
  component: ResetDemoButton,
  tags: ['autodocs'],
  args: { onReset: fn(), confirm: () => true },
  parameters: {
    docs: {
      description: {
        component: `Apaga os dados dos apps de \`/projects\` no navegador e volta para a demonstração. O token do Azure é preservado. Pede confirmação e, por padrão, recarrega a página. Fica nas ações do \`LocationOverviewLayout\`.

\`\`\`tsx
<ResetDemoButton />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ResetDemoButton>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button'))
    await expect(args.onReset).toHaveBeenCalledTimes(1)
  },
}
