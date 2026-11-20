import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import * as Icons from '.'

const ICON_NAMES = [
  'GithubIcon',
  'LinkedInIcon',
  'PinterestIcon',
  'DribbbleIcon',
  'SunIcon',
  'MoonIcon',
  'CircularText',
  'LinkArrow',
] as const

function IconGallery({ className }: { className?: string }) {
  return (
    <ul className='grid grid-cols-4 gap-6 text-zinc-200'>
      {ICON_NAMES.map((name) => {
        const Icon = Icons[name]
        return (
          <li key={name} className='flex flex-col items-center gap-2' data-testid={name}>
            <Icon className={className} />
            <code className='text-xs'>{name}</code>
          </li>
        )
      })}
    </ul>
  )
}

const meta = {
  title: 'Atoms/Icon',
  component: IconGallery,
  tags: ['autodocs'],
  args: { className: 'w-12' },
  parameters: {
    docs: {
      description: {
        component: `Ícones SVG inline, um arquivo por ícone em \`atoms/Icon\`. Todos aceitam as props de \`<svg>\` e ocupam 100% da largura por padrão; controle o tamanho com \`className\` (ex.: \`w-6\`).

Usados em \`SocialLinks\` (GitHub, LinkedIn), \`Hero\` (LinkArrow) e \`HireMe\` (CircularText).

\`\`\`tsx
import { GithubIcon } from '@/components/atoms/Icon'

<GithubIcon className='w-6' />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof IconGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Galeria: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ICON_NAMES) {
      await expect(canvas.getByTestId(name).querySelector('svg')).toBeInTheDocument()
    }
  },
}

export const Pequenos: Story = { args: { className: 'w-6' } }
