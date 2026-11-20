import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { designTools, frontendTools } from '@/data/tools'
import designIllustration from '@p/design.svg'
import frontendIllustration from '@p/frontend.svg'
import { ToolExperienceSection } from './ToolExperienceSection'

const meta = {
  title: 'Organisms/ToolExperienceSection',
  component: ToolExperienceSection,
  tags: ['autodocs'],
  args: {
    illustration: frontendIllustration,
    illustrationAlt: 'Frontend',
    illustrationSide: 'right',
    tools: frontendTools,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Seção da home exibida ao escolher "UI/UX" ou "Front" na \`Logo\`. A ilustração desliza para o lado escolhido e as ferramentas aparecem em grade (\`ToolExperienceCard\`). Unifica os dois blocos quase idênticos que existiam em \`pages/index.tsx\`.

\`\`\`tsx
<ToolExperienceSection illustration={frontend} illustrationAlt='Frontend' illustrationSide='right' tools={frontendTools} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ToolExperienceSection>

export default meta
type Story = StoryObj<typeof meta>

export const Front: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    for (const tool of args.tools) {
      await expect(canvas.getByAltText(tool.name)).toBeInTheDocument()
    }
  },
}

export const UiUx: Story = {
  args: {
    illustration: designIllustration,
    illustrationAlt: 'UI/UX',
    illustrationSide: 'left',
    illustrationClassName: 'animate-wiggle animate-infinite',
    tools: designTools,
    toolImageClassName: 'rounded-full',
  },
}
