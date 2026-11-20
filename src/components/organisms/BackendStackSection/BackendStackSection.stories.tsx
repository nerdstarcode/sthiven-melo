import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { backendStack } from '@/data/tools'
import { BackendStackSection } from './BackendStackSection'

const meta = {
  title: 'Organisms/BackendStackSection',
  component: BackendStackSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Seção da home exibida ao escolher "Backend" na \`Logo\`: grade de logos da stack (\`src/data/tools.ts\`), ilustração e a coluna "Projetos". A coluna de projetos ainda está vazia no layout original.

\`\`\`tsx
<BackendStackSection />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof BackendStackSection>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByAltText('NestJS')).toBeInTheDocument()
  },
}

export const StackReduzida: Story = { args: { stack: backendStack.slice(0, 3) } }
