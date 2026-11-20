import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'
import { AppsShowcase } from './AppsShowcase'

const meta = {
  title: 'Organisms/AppsShowcase',
  component: AppsShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Vitrine dos apps no topo de \`/projects\`. Cada card mostra:
- as hard e soft skills do app
- o botão para abrir o app, quando ele já existe
- atalhos para as áreas do fluxo, como Sprints › Squads › Alocações

Apps sem rota aparecem como "Em breve" ou "Projeto fictício".

\`\`\`tsx
<AppsShowcase />
\`\`\``,
      },
    },
  },
} satisfies Meta<typeof AppsShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Abrir Location Overview' }),
    ).toBeInTheDocument()
  },
}
