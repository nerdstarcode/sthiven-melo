import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { AnimatedText } from './AnimatedText'

const meta = {
  title: 'Atoms/AnimatedText',
  component: AnimatedText,
  tags: ['autodocs'],
  args: { text: 'A paixão alimenta o propósito!', Tag: 'h2' },
  argTypes: { Tag: { control: 'inline-radio', options: ['h1', 'h2', 'h3', 'h4', 'h5'] } },
  parameters: {
    docs: {
      description: {
        component: `Título que revela palavra por palavra (motion). É o cabeçalho principal das páginas \`about\` e \`projects\` e do \`Hero\` da home.

\`\`\`tsx
<AnimatedText Tag='h1' text={t.title} className='text-3xl! lg:text-6xl!' />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AnimatedText>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement, args }) => {
    const heading = within(canvasElement).getByRole('heading', { level: 2 })
    await expect(heading).toHaveTextContent(args.text!)
  },
}

export const ComoH1: Story = {
  args: { Tag: 'h1', text: 'Transformando ideias em realidade', className: 'text-3xl! text-left' },
}

export const Curto: Story = { args: { text: 'Skills' } }
