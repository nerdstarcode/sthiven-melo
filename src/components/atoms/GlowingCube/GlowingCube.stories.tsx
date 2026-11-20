import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { GlowingCube } from './GlowingCube'

const meta = {
  title: 'Atoms/GlowingCube',
  component: GlowingCube,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='flex h-80 items-center justify-center'>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `Cubo 3D girando, feito só com CSS (\`transform-style: preserve-3d\` e a animação \`.rotate-cube\` de \`globals.css\`). É uma demonstração exibida em \`ShowcaseSection\` na página \`examples\`.

\`\`\`tsx
<GlowingCube />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof GlowingCube>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByTestId('glowing-cube')).toHaveClass('rotate-cube')
  },
}
