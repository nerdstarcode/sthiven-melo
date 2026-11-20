import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { RESUME_PATH } from '@/constants/social'
import { Hero } from './Hero'

const meta = {
  title: 'Organisms/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Seção inicial da home (\`pages/index.tsx\`), exibida quando nenhuma área está selecionada na \`Logo\`. Mostra a ilustração, o título animado, a apresentação e os links de currículo e contato.

\`\`\`tsx
<Hero />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { level: 1 })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'Currículo' })).toHaveAttribute(
      'href',
      RESUME_PATH,
    )
  },
}
