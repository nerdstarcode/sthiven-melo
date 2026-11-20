import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import lightPicture from '@p/aboutpicturelight.jpg'
import { ProfileImage } from './ProfileImage'

const meta = {
  title: 'Atoms/ProfileImage',
  component: ProfileImage,
  tags: ['autodocs'],
  args: { alt: 'Foto de Sthiven Melo', className: 'max-w-sm' },
  parameters: {
    docs: {
      description: {
        component: `Foto de perfil com cantos arredondados (antigo \`ImageTry\`). Usada no quadro lateral do \`AboutSummary\` na página \`about\`. A imagem padrão é \`public/aboutpicture.jpg\`.

\`\`\`tsx
<ProfileImage alt={t.profileAlt} />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof ProfileImage>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement, args }) => {
    await expect(within(canvasElement).getByAltText(args.alt)).toBeInTheDocument()
  },
}

export const OutraFoto: Story = { args: { src: lightPicture } }
