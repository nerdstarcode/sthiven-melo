import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { SkillBubble } from './SkillBubble'

const meta = {
  title: 'Atoms/SkillBubble',
  component: SkillBubble,
  tags: ['autodocs'],
  args: { name: 'NestJS', x: '0', y: '0' },
  decorators: [
    (Story) => (
      <div className='relative flex h-80 items-center justify-center overflow-hidden rounded-full bg-circularDark'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `Bolha de skill que "voa" do centro até \`(x, y)\` ao entrar na viewport. É posicionada de forma absoluta, então precisa de um pai \`relative\`. Usada em \`SkillsCloud\` com os dados de \`src/data/skills.ts\`.

\`\`\`tsx
<SkillBubble name='Figma' x='0' y='-15vw' />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof SkillBubble>

export default meta
type Story = StoryObj<typeof meta>

export const NoCentro: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('NestJS')).toBeVisible()
  },
}

export const Deslocada: Story = { args: { name: 'Figma', x: '0', y: '-8rem' } }
