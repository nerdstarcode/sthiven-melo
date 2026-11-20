import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { WorkTab } from './WorkTab'

const meta = {
  title: 'Molecules/WorkTab',
  component: WorkTab,
  tags: ['autodocs'],
  args: { area: 'Front', onSelect: fn() },
  decorators: [
    (Story) => (
      // As abas só aparecem no hover de um ancestral `group`; aqui ficam sempre visíveis.
      <div className='group flex gap-2 [&_a]:pointer-events-auto [&_a]:translate-y-0 [&_a]:opacity-100'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `Aba de área de atuação (UI/UX, Front, Backend) que aparece ao passar o mouse na \`Logo\`. Ao clicar, troca a seção exibida na home via \`WorkContext\` (antigo \`SpanModify\`).

\`\`\`tsx
{WORK_AREAS.map((area) => <WorkTab key={area} area={area} />)}
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof WorkTab>

export default meta
type Story = StoryObj<typeof meta>

export const Front: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('link', { name: 'Front' }))
    await expect(args.onSelect).toHaveBeenCalledWith('Front')
  },
}

export const UiUx: Story = { args: { area: 'UI/UX' } }

export const Backend: Story = { args: { area: 'Backend' } }
