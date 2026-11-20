import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, waitFor, within } from 'storybook/test'
import { ThreeScene } from './ThreeScene'

const meta = {
  title: 'Organisms/ThreeScene',
  component: ThreeScene,
  tags: ['autodocs', 'browser-only'],
  parameters: {
    docs: {
      description: {
        component: `Cubo 3D girando com three.js (canvas WebGL de 200×200), exibido em \`ShowcaseSection\` na página \`examples\`. Ao desmontar, cancela o loop de animação e libera renderer, geometria e material (antes vazava, e o StrictMode criava dois canvases).

\`\`\`tsx
<ThreeScene />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ThreeScene>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    const container = within(canvasElement).getByTestId('three-scene')
    await waitFor(() => expect(container.querySelectorAll('canvas')).toHaveLength(1))
  },
}
