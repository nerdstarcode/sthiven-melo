import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { Container } from './Container'

const meta = {
  title: 'Atoms/Container',
  component: Container,
  tags: ['autodocs'],
  args: {
    children: <p className='text-zinc-200'>Conteúdo da página</p>,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Wrapper de conteúdo com o padding padrão das páginas (antigo \`Layout\`). Classes passadas em \`className\` sobrescrevem as padrão via \`tailwind-merge\`. Usado em todas as páginas e no \`Footer\`.

\`\`\`tsx
<Container className='gap-16 pt-16'>...</Container>
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Conteúdo da página')).toBeVisible()
  },
}

export const SemPaddingVertical: Story = { args: { className: 'py-0 md:py-0' } }
