import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { designTools, frontendTools } from '@/data/tools'
import { ToolExperienceCard } from './ToolExperienceCard'

const meta = {
  title: 'Molecules/ToolExperienceCard',
  component: ToolExperienceCard,
  tags: ['autodocs'],
  args: { tool: frontendTools[0] },
  parameters: {
    docs: {
      description: {
        component: `Logo da ferramenta com tempo de uso e nível de domínio, traduzidos pelo idioma atual. Antes era copiado 11 vezes na home; agora é renderizado por \`ToolExperienceSection\` a partir de \`src/data/tools.ts\`.

\`\`\`tsx
<ToolExperienceCard tool={{ name: 'React', image: react, years: '3+', level: 'high' }} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ToolExperienceCard>

export default meta
type Story = StoryObj<typeof meta>

export const React: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByAltText('React')).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { level: 4 })).toHaveTextContent('3+')
  },
}

export const FigmaRedondo: Story = {
  args: { tool: designTools[0], imageClassName: 'rounded-full' },
}
