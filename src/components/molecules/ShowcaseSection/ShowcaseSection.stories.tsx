import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { GlowingCube } from '@/components/atoms/GlowingCube'
import { ShowcaseSection } from './ShowcaseSection'

const meta = {
  title: 'Molecules/ShowcaseSection',
  component: ShowcaseSection,
  tags: ['autodocs'],
  args: {
    id: 'glowing_cube',
    title: 'Glowing Cube component',
    description: 'Componente criado com Tailwind CSS',
    accentClassName: 'group-hover:text-fuchsia-500',
    demoSide: 'left',
    children: <GlowingCube />,
  },
  parameters: {
    docs: {
      description: {
        component: `Seção da página \`examples\`: título e descrição ao lado de uma demonstração (passada como \`children\`). O título ganha opacidade e a cor de \`accentClassName\` no hover da seção. Antigos \`SectionComponents\` + \`AsideComponent\`.

\`\`\`tsx
<ShowcaseSection title={t.cubeTitle} description={t.cubeDescription}>
  <ThreeScene />
</ShowcaseSection>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ShowcaseSection>

export default meta
type Story = StoryObj<typeof meta>

export const DemoAEsquerda: Story = {
  play: async ({ canvasElement, args }) => {
    await expect(within(canvasElement).getByRole('heading', { name: args.title })).toBeVisible()
  },
}

export const DemoADireita: Story = { args: { demoSide: 'right' } }
